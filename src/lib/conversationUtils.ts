import { Conversation } from './elevenlabs';

export type ConversationOutcome = 'booked' | 'failed' | 'escalated' | 'inquiry' | 'in_progress';

/**
 * Determine call outcome from transcript analysis
 */
export function determineOutcome(conversation: Conversation): ConversationOutcome {
  if (conversation.status === 'in-progress') {
    return 'in_progress';
  }

  if (!conversation.transcript || conversation.transcript.length === 0) {
    return 'inquiry';
  }

  const allToolCalls = conversation.transcript.flatMap((turn) => turn.tool_calls || []);
  const allToolResults = conversation.transcript.flatMap((turn) => turn.tool_results || []);

  // Check for escalation
  const hasEscalation = allToolCalls.some(
    (call) => call.tool_name === 'human_escallation_message'
  );
  if (hasEscalation) return 'escalated';

  // Check for booking result
  const bookingResult = allToolResults.find(
    (result) => result.tool_name === 'book_appointment'
  );

  if (bookingResult) {
    try {
      const data = JSON.parse(bookingResult.result_value);
      return data.success ? 'booked' : 'failed';
    } catch {
      return 'failed';
    }
  }

  // Check if booking was attempted
  const bookingAttempted = allToolCalls.some((call) => call.tool_name === 'book_appointment');
  if (bookingAttempted) return 'failed';

  return 'inquiry';
}

export interface BookingDetails {
  customer_name: string;
  phone_number: string;
  service_variation_id: string;
  start_at: string;
  team_member_id?: string;
  booking_id?: string;
  customer_id?: string;
}

/**
 * Extract booking information from successful booking
 */
export function extractBookingDetails(conversation: Conversation): BookingDetails | null {
  if (!conversation.transcript) return null;

  const bookingCall = conversation.transcript
    .flatMap((turn) => turn.tool_calls || [])
    .find((call) => call.tool_name === 'book_appointment');

  if (!bookingCall) return null;

  try {
    const params = JSON.parse(bookingCall.params_as_json);

    const bookingResult = conversation.transcript
      .flatMap((turn) => turn.tool_results || [])
      .find((result) => result.tool_name === 'book_appointment');

    if (!bookingResult) return null;

    const resultData = JSON.parse(bookingResult.result_value);
    if (!resultData.success) return null;

    return {
      customer_name: params.customer_name,
      phone_number: params.phone_number,
      service_variation_id: params.service_variation_id,
      start_at: params.start_at,
      team_member_id: params.team_member_id,
      booking_id: resultData.data?.booking_id,
      customer_id: resultData.data?.customer_id,
    };
  } catch {
    return null;
  }
}

/**
 * Calculate call duration in seconds
 */
export function getCallDuration(conversation: Conversation): number {
  // Use call_duration_secs from API if available
  if (conversation.call_duration_secs) {
    return conversation.call_duration_secs;
  }

  if (conversation.status === 'in-progress' && conversation.start_time_unix_secs) {
    const startTime = conversation.start_time_unix_secs * 1000; // Convert to milliseconds
    const now = Date.now();
    return Math.floor((now - startTime) / 1000);
  }

  // For completed calls, use last turn timestamp
  if (!conversation.transcript || conversation.transcript.length === 0) {
    return 0;
  }

  const lastTurn = conversation.transcript[conversation.transcript.length - 1];
  return lastTurn?.time_in_call_secs || 0;
}

/**
 * Format seconds as MM:SS
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format phone number for display
 */
export function formatPhoneNumber(phone: string): string {
  // Remove any non-digit characters
  const cleaned = phone.replace(/\D/g, '');

  // UK format: +44 7XXX XXX XXX
  if (cleaned.startsWith('44') && cleaned.length === 12) {
    return `+44 ${cleaned.slice(2, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
  }

  // US format: +1 (XXX) XXX-XXXX
  if (cleaned.startsWith('1') && cleaned.length === 11) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }

  // Return original if format not recognized
  return phone;
}

/**
 * Get relative time string (e.g., "2 minutes ago", "Today 3:45pm")
 */
export function formatRelativeTime(dateInput: string | number): string {
  // Handle both ISO string and Unix timestamp
  const date = typeof dateInput === 'number'
    ? new Date(dateInput * 1000) // Unix timestamp to milliseconds
    : new Date(dateInput);

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) {
    const time = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    return `Today ${time}`;
  }
  if (diffDays === 1) {
    const time = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    return `Yesterday ${time}`;
  }
  if (diffDays < 7) {
    const day = date.toLocaleDateString('en-US', { weekday: 'short' });
    const time = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    return `${day} ${time}`;
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Get phone number from conversation (handles different API response structures)
 */
export function getPhoneNumber(conversation: Conversation): string {
  // Check user_id first (detailed response)
  if (conversation.user_id) {
    return conversation.user_id;
  }

  // Check metadata for phone number (some responses)
  if (conversation.metadata?.phone_call?.external_number) {
    return conversation.metadata.phone_call.external_number;
  }

  // Fallback to Unknown
  return 'Unknown';
}

/**
 * Get created_at timestamp (handles Unix timestamp or ISO string)
 */
export function getCreatedAt(conversation: Conversation): number {
  if (conversation.start_time_unix_secs) {
    return conversation.start_time_unix_secs;
  }

  if (conversation.metadata?.start_time_unix_secs) {
    return conversation.metadata.start_time_unix_secs;
  }

  return Date.now() / 1000; // Fallback to now
}

/**
 * Get last agent message from transcript
 */
export function getLastAgentMessage(conversation: Conversation): string {
  if (!conversation.transcript || conversation.transcript.length === 0) {
    return '';
  }

  const agentTurns = conversation.transcript.filter((turn) => turn.role === 'agent');
  if (agentTurns.length === 0) return '';

  const lastMessage = agentTurns[agentTurns.length - 1].message;
  return lastMessage.length > 60 ? lastMessage.slice(0, 60) + '...' : lastMessage;
}

/**
 * Determine current agent status from transcript
 */
export function getAgentStatus(conversation: Conversation): string {
  if (conversation.status !== 'in-progress') {
    return 'Completed';
  }

  if (!conversation.transcript || conversation.transcript.length === 0) {
    return 'Connecting...';
  }

  const lastTurn = conversation.transcript[conversation.transcript.length - 1];

  // Check if currently executing a tool
  if (lastTurn.tool_calls && lastTurn.tool_calls.length > 0) {
    const lastToolCall = lastTurn.tool_calls[lastTurn.tool_calls.length - 1];

    switch (lastToolCall.tool_name) {
      case 'check_availability':
        return 'Checking availability...';
      case 'book_appointment':
        return 'Booking appointment...';
      case 'human_escallation_message':
        return 'Escalating to human...';
      default:
        return 'Processing...';
    }
  }

  return 'Speaking with caller';
}
