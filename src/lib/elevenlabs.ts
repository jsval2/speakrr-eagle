// ElevenLabs API Integration
const AGENT_ID = 'agent_2101ke1rkdp6e0g9x1gyge1fmdns';
const API_BASE = 'https://api.elevenlabs.io';

// Get API key from environment variable
const getApiKey = () => {
  const key = import.meta.env.VITE_ELEVENLABS_API_KEY;
  if (!key) {
    console.warn('ELEVENLABS_API_KEY not found in environment variables');
  }
  return key;
};

export interface Conversation {
  conversation_id: string;
  agent_id: string;
  status: 'done' | 'in-progress'; // API uses hyphen, not underscore
  user_id?: string; // Phone number (only in detailed response)
  start_time_unix_secs?: number; // Unix timestamp
  call_duration_secs?: number;
  message_count?: number;
  call_successful?: string;
  call_summary_title?: string;
  metadata?: {
    start_time_unix_secs?: number;
    phone_call?: {
      external_number?: string;
    };
  };
  transcript?: TranscriptTurn[];
}

export interface TranscriptTurn {
  role: 'agent' | 'user';
  message: string;
  tool_calls?: ToolCall[];
  tool_results?: ToolResult[];
  time_in_call_secs: number;
}

export interface ToolCall {
  type: string;
  tool_name: string;
  params_as_json: string;
  request_id: string;
}

export interface ToolResult {
  tool_name: string;
  request_id: string;
  result_value: string;
  tool_latency_secs: number;
}

export interface ConversationsResponse {
  conversations: Conversation[];
  has_more: boolean;
}

/**
 * Fetch list of conversations for the agent
 */
export async function fetchConversations(pageSize = 100): Promise<ConversationsResponse> {
  const apiKey = getApiKey();

  const response = await fetch(
    `${API_BASE}/v1/convai/conversations?agent_id=${AGENT_ID}&page_size=${pageSize}`,
    {
      headers: {
        'xi-api-key': apiKey || '',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch conversations: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch single conversation with full transcript
 */
export async function fetchConversation(conversationId: string): Promise<Conversation> {
  const apiKey = getApiKey();

  const response = await fetch(
    `${API_BASE}/v1/convai/conversations/${conversationId}`,
    {
      headers: {
        'xi-api-key': apiKey || '',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch conversation: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get audio URL for a conversation (optional feature)
 */
export function getConversationAudioUrl(conversationId: string): string {
  return `${API_BASE}/v1/convai/conversations/${conversationId}/audio`;
}
