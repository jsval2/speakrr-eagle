import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRecentCalls, useConversation } from "@/hooks/useConversations";
import { Conversation } from "@/lib/elevenlabs";
import {
  determineOutcome,
  formatPhoneNumber,
  formatDuration,
  formatRelativeTime,
  getCallDuration,
  extractBookingDetails,
  getPhoneNumber,
  getCreatedAt,
} from "@/lib/conversationUtils";

const mockCallHistory = [
  {
    id: 1,
    date: "Today, 2:34 PM",
    caller: "+1 (555) 234-5678",
    intent: "Appointment Booking",
    outcome: "Resolved",
    duration: "2:45",
    transcript:
      "Caller: Hi, I'd like to book an appointment for next week.\nAI: Of course! I'd be happy to help you schedule an appointment. What day works best for you?\nCaller: How about Tuesday afternoon?\nAI: I have availability on Tuesday at 2:00 PM or 3:30 PM. Which would you prefer?\nCaller: 2:00 PM works great.\nAI: Perfect! I've booked you for Tuesday at 2:00 PM. You'll receive a confirmation text shortly. Is there anything else I can help you with?\nCaller: No, that's all. Thank you!\nAI: You're welcome! We look forward to seeing you on Tuesday.",
    summary:
      "Caller successfully booked an appointment for Tuesday at 2:00 PM. No issues encountered.",
  },
  {
    id: 2,
    date: "Today, 1:12 PM",
    caller: "+1 (555) 876-5432",
    intent: "Insurance Question",
    outcome: "Transferred",
    duration: "3:21",
    transcript:
      "Caller: I have a question about my insurance coverage.\nAI: I'd be happy to help with your insurance question. What would you like to know?\nCaller: Does my plan cover orthodontic work?\nAI: Insurance coverage can vary by plan. Let me connect you with our billing specialist who can look up your specific coverage details.\nCaller: Okay, thank you.",
    summary:
      "Caller had a specific insurance question about orthodontic coverage. Transferred to billing specialist for detailed policy information.",
  },
  {
    id: 3,
    date: "Today, 11:45 AM",
    caller: "+1 (555) 111-2222",
    intent: "Rescheduling",
    outcome: "Resolved",
    duration: "1:58",
    transcript:
      "Caller: I need to reschedule my appointment from tomorrow.\nAI: No problem! I can help you reschedule. What's your name?\nCaller: Sarah Johnson.\nAI: Thank you, Sarah. I see your appointment for tomorrow at 10:00 AM. When would you like to reschedule to?\nCaller: Can I come in on Friday instead?\nAI: I have Friday at 11:00 AM available. Would that work?\nCaller: Yes, perfect.\nAI: Great! I've rescheduled you for Friday at 11:00 AM. You'll receive an updated confirmation.",
    summary:
      "Sarah Johnson rescheduled her appointment from Thursday 10:00 AM to Friday 11:00 AM.",
  },
  {
    id: 4,
    date: "Today, 10:30 AM",
    caller: "+1 (555) 333-4444",
    intent: "New Patient Inquiry",
    outcome: "Resolved",
    duration: "4:12",
    transcript:
      "Caller: Hi, I'm looking for a new dentist. Are you accepting new patients?",
    summary:
      "New patient inquiry. Provided office information and scheduled initial consultation.",
  },
  {
    id: 5,
    date: "Yesterday, 4:55 PM",
    caller: "+1 (555) 555-6666",
    intent: "Billing Question",
    outcome: "Voicemail",
    duration: "0:45",
    transcript: "Caller reached voicemail after business hours.",
    summary: "After-hours call. Voicemail left for billing inquiry.",
  },
  {
    id: 6,
    date: "Yesterday, 3:20 PM",
    caller: "+1 (555) 777-8888",
    intent: "Emergency",
    outcome: "Transferred",
    duration: "1:15",
    transcript:
      "Caller: I have a dental emergency, I broke my tooth!\nAI: I'm sorry to hear that. Let me connect you with our emergency line right away.",
    summary:
      "Dental emergency - broken tooth. Immediately transferred to emergency line.",
  },
];

const CallHistory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const { data: recentCalls, isLoading } = useRecentCalls(24 * 30); // 30 days
  const { data: selectedConversation } = useConversation(selectedConversationId);

  const getOutcomeBadge = (outcome: string) => {
    const variants: Record<string, string> = {
      booked: "bg-success/10 text-success border-success/20",
      escalated: "bg-warning/10 text-warning border-warning/20",
      inquiry: "bg-info/10 text-info border-info/20",
      failed: "bg-destructive/10 text-destructive border-destructive/20",
      in_progress: "bg-muted text-muted-foreground border-border",
    };
    return variants[outcome] || variants.inquiry;
  };

  const getOutcomeLabel = (outcome: string) => {
    const labels: Record<string, string> = {
      booked: "Booked",
      escalated: "Escalated",
      inquiry: "Inquiry",
      failed: "Failed",
      in_progress: "In Progress",
    };
    return labels[outcome] || outcome;
  };

  const filteredCalls = recentCalls?.filter(
    (call) =>
      getPhoneNumber(call).includes(searchQuery) ||
      searchQuery === ""
  ) || [];

  return (
    <DashboardLayout>
      <PageHeader
        title="Call History"
        description="Review past calls, transcripts, and AI summaries"
      >
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </PageHeader>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by phone number or intent..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg shadow-sm border border-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold">Date & Time</TableHead>
              <TableHead className="font-semibold">Caller</TableHead>
              <TableHead className="font-semibold">Conversation ID</TableHead>
              <TableHead className="font-semibold">Outcome</TableHead>
              <TableHead className="font-semibold">Duration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                </TableRow>
              ))
            ) : filteredCalls.length > 0 ? (
              filteredCalls.map((call) => {
                const outcome = determineOutcome(call);
                return (
                  <TableRow
                    key={call.conversation_id}
                    className="cursor-pointer"
                    onClick={() => setSelectedConversationId(call.conversation_id)}
                  >
                    <TableCell className="text-muted-foreground">
                      {formatRelativeTime(getCreatedAt(call))}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatPhoneNumber(getPhoneNumber(call))}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {call.conversation_id.slice(0, 12)}...
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn("font-medium", getOutcomeBadge(outcome))}
                      >
                        {getOutcomeLabel(outcome)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDuration(getCallDuration(call))}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                  No calls found in the last 30 days
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Detail Modal */}
      <Dialog open={!!selectedConversationId} onOpenChange={() => setSelectedConversationId(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <span>Conversation Details</span>
              {selectedConversation && (
                <Badge
                  variant="outline"
                  className={cn(
                    "font-medium",
                    getOutcomeBadge(determineOutcome(selectedConversation))
                  )}
                >
                  {getOutcomeLabel(determineOutcome(selectedConversation))}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>

          {selectedConversation && (
            <div className="space-y-6">
              {/* Call Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Caller</p>
                  <p className="text-sm font-medium">{formatPhoneNumber(getPhoneNumber(selectedConversation))}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Date</p>
                  <p className="text-sm font-medium">{formatRelativeTime(getCreatedAt(selectedConversation))}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Conversation ID</p>
                  <p className="text-xs font-mono">{selectedConversation.conversation_id}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Duration</p>
                  <p className="text-sm font-medium">{formatDuration(getCallDuration(selectedConversation))}</p>
                </div>
              </div>

              {/* Booking Details (if applicable) */}
              {extractBookingDetails(selectedConversation) && (
                <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                  <h4 className="text-sm font-semibold mb-3 text-success">Booking Details</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">Customer</p>
                      <p className="font-medium">{extractBookingDetails(selectedConversation)?.customer_name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="font-medium">{formatPhoneNumber(extractBookingDetails(selectedConversation)?.phone_number || '')}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-muted-foreground">Appointment Time</p>
                      <p className="font-medium">{new Date(extractBookingDetails(selectedConversation)?.start_at || '').toLocaleString()}</p>
                    </div>
                    {extractBookingDetails(selectedConversation)?.booking_id && (
                      <div className="col-span-2">
                        <p className="text-xs text-muted-foreground">Booking ID</p>
                        <p className="font-mono text-xs">{extractBookingDetails(selectedConversation)?.booking_id}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Transcript */}
              <div>
                <h4 className="text-sm font-semibold mb-3">Transcript</h4>
                <div className="space-y-3">
                  {selectedConversation.transcript && selectedConversation.transcript.length > 0 ? (
                    selectedConversation.transcript.map((turn, index) => (
                      <div key={index} className="space-y-2">
                        {/* Message */}
                        <div
                          className={cn(
                            "p-3 rounded-lg",
                            turn.role === "agent"
                              ? "bg-primary/10 border border-primary/20"
                              : "bg-muted/50"
                          )}
                        >
                          <p className="text-xs text-muted-foreground mb-1">
                            {turn.role === "agent" ? "AI Agent" : "Caller"} • {formatDuration(turn.time_in_call_secs)}
                          </p>
                          <p className="text-sm leading-relaxed">{turn.message}</p>
                        </div>

                        {/* Tool Calls */}
                        {turn.tool_calls && turn.tool_calls.length > 0 && (
                          <div className="ml-4 space-y-2">
                            {turn.tool_calls.map((tool, toolIndex) => {
                              const result = turn.tool_results?.find(r => r.request_id === tool.request_id);
                              return (
                                <div key={toolIndex} className="p-3 bg-warning/10 border border-warning/20 rounded-lg text-xs">
                                  <p className="font-semibold mb-1">🔧 Tool: {tool.tool_name}</p>
                                  <p className="text-muted-foreground mb-2">Parameters: {tool.params_as_json}</p>
                                  {result && (
                                    <p className="text-muted-foreground">
                                      Result ({result.tool_latency_secs.toFixed(2)}s): {result.result_value.slice(0, 100)}...
                                    </p>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No transcript available</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default CallHistory;
