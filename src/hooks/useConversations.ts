import { useQuery } from '@tanstack/react-query';
import { fetchConversations, fetchConversation, Conversation } from '@/lib/elevenlabs';
import { determineOutcome, getCallDuration, getCreatedAt } from '@/lib/conversationUtils';

/**
 * Hook to fetch and poll all conversations (refreshes every 5 seconds)
 */
export function useConversations() {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: () => fetchConversations(100),
    refetchInterval: 2000, // Poll every 2 seconds for faster live updates
    staleTime: 1000, // Consider data stale after 1 second
  });
}

/**
 * Hook to fetch a single conversation with full details
 */
export function useConversation(conversationId: string | null) {
  return useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: () => fetchConversation(conversationId!),
    enabled: !!conversationId,
    refetchInterval: 2000, // Poll if viewing in-progress call
  });
}

/**
 * Hook to get active (in-progress) calls only
 */
export function useActiveCalls() {
  const { data, ...rest } = useConversations();

  const activeCalls = data?.conversations.filter((conv) => conv.status === 'in-progress') || [];

  return {
    ...rest,
    data: activeCalls,
    count: activeCalls.length,
  };
}

/**
 * Hook to get recent calls from last 24 hours
 */
export function useRecentCalls(hoursBack = 24) {
  const { data, ...rest } = useConversations();

  const cutoffTimeUnix = Math.floor(Date.now() / 1000) - (hoursBack * 3600);

  const recentCalls =
    data?.conversations.filter((conv) => {
      const created = getCreatedAt(conv);
      return created >= cutoffTimeUnix;
    }) || [];

  // Sort by created_at descending (most recent first)
  recentCalls.sort((a, b) => getCreatedAt(b) - getCreatedAt(a));

  return {
    ...rest,
    data: recentCalls,
    count: recentCalls.length,
  };
}

/**
 * Hook to get dashboard statistics
 */
export function useDashboardStats() {
  const { data, ...rest } = useConversations();

  if (!data) {
    return {
      ...rest,
      stats: null,
    };
  }

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);

  const todayStartUnix = Math.floor(todayStart.getTime() / 1000);
  const yesterdayStartUnix = Math.floor(yesterdayStart.getTime() / 1000);

  const allConversations = data.conversations;
  const todayCalls = allConversations.filter(
    (conv) => getCreatedAt(conv) >= todayStartUnix
  );
  const yesterdayCalls = allConversations.filter(
    (conv) =>
      getCreatedAt(conv) >= yesterdayStartUnix && getCreatedAt(conv) < todayStartUnix
  );

  // Count by outcome
  const countByOutcome = (calls: Conversation[]) => {
    const counts = { booked: 0, failed: 0, escalated: 0, inquiry: 0, in_progress: 0 };
    calls.forEach((conv) => {
      const outcome = determineOutcome(conv);
      counts[outcome]++;
    });
    return counts;
  };

  const todayOutcomes = countByOutcome(todayCalls);
  const yesterdayOutcomes = countByOutcome(yesterdayCalls);

  // Calculate average duration
  const calculateAvgDuration = (calls: Conversation[]) => {
    const completedCalls = calls.filter((conv) => conv.status === 'done');
    if (completedCalls.length === 0) return 0;
    const totalSecs = completedCalls.reduce((sum, conv) => sum + getCallDuration(conv), 0);
    return Math.floor(totalSecs / completedCalls.length);
  };

  const avgDurationToday = calculateAvgDuration(todayCalls);
  const avgDurationYesterday = calculateAvgDuration(yesterdayCalls);

  // Resolution rate (booked + inquiry) / (total - in_progress)
  const calculateResolutionRate = (calls: Conversation[]) => {
    const completed = calls.filter((conv) => conv.status === 'done');
    if (completed.length === 0) return 0;
    const outcomes = countByOutcome(completed);
    const resolved = outcomes.booked + outcomes.inquiry;
    return Math.round((resolved / completed.length) * 100);
  };

  const resolutionRateToday = calculateResolutionRate(todayCalls);
  const resolutionRateYesterday = calculateResolutionRate(yesterdayCalls);

  return {
    ...rest,
    stats: {
      totalCalls: todayCalls.length,
      totalCallsYesterday: yesterdayCalls.length,
      answered: todayCalls.length - todayOutcomes.failed,
      answeredYesterday: yesterdayCalls.length - yesterdayOutcomes.failed,
      transferred: todayOutcomes.escalated,
      transferredYesterday: yesterdayOutcomes.escalated,
      missed: todayOutcomes.failed,
      missedYesterday: yesterdayOutcomes.failed,
      avgDuration: avgDurationToday,
      avgDurationYesterday: avgDurationYesterday,
      resolutionRate: resolutionRateToday,
      resolutionRateYesterday: resolutionRateYesterday,
      bookings: todayOutcomes.booked,
      bookingsYesterday: yesterdayOutcomes.booked,
      activeCalls: todayOutcomes.in_progress,
    },
  };
}
