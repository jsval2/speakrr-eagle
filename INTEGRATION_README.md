# Voice Agent Dashboard - ElevenLabs Integration

## Overview

This dashboard now connects to the **ElevenLabs Conversational AI API** to display real-time call data from your Valentis Dental Receptionist AI agent.

## What's Been Implemented

### 1. ElevenLabs API Integration
- **File**: `src/lib/elevenlabs.ts`
- Fetches conversations from ElevenLabs API
- Supports both list view and single conversation details
- Includes proper TypeScript types for all API responses

### 2. Data Processing Utilities
- **File**: `src/lib/conversationUtils.ts`
- `determineOutcome()` - Analyzes transcripts to determine call outcome (booked, failed, escalated, inquiry, in_progress)
- `extractBookingDetails()` - Extracts booking information from successful appointments
- `getCallDuration()` - Calculates call duration (live for in-progress calls)
- `formatDuration()` - Formats seconds as MM:SS
- `formatPhoneNumber()` - Formats phone numbers for display (UK/US formats)
- `formatRelativeTime()` - Formats timestamps ("2m ago", "Today 3:45pm")
- `getAgentStatus()` - Determines current agent status from transcript
- `getLastAgentMessage()` - Extracts last agent message for preview

### 3. React Query Hooks
- **File**: `src/hooks/useConversations.ts`
- `useConversations()` - Fetches all conversations (polls every 5 seconds)
- `useConversation(id)` - Fetches single conversation with full transcript
- `useActiveCalls()` - Filters for in-progress calls only
- `useRecentCalls(hours)` - Filters calls from last N hours (default 24)
- `useDashboardStats()` - Calculates dashboard statistics (totals, averages, rates)

### 4. Updated Pages

#### Index (Dashboard Overview)
- **File**: `src/pages/Index.tsx`
- Real-time KPI cards with today vs yesterday comparisons
- Live call count and active calls display
- Auto-updates every 5 seconds

#### Live Calls
- **File**: `src/pages/LiveCalls.tsx`
- Shows only in-progress calls
- Live duration counter
- Agent status (Checking availability, Booking appointment, etc.)
- Manual refresh button with loading state

#### Call History
- **File**: `src/pages/CallHistory.tsx`
- Table view of recent calls (last 24 hours)
- Searchable by phone number
- Click to view full conversation details in modal
- Modal includes:
  - Full transcript with agent/caller messages
  - Tool calls (check_availability, book_appointment, etc.)
  - Booking details section (if appointment was booked)
  - Tool execution times and results

## Configuration

### Environment Variables

The `.env` file has been updated with:

```bash
VITE_ELEVENLABS_API_KEY=sk_efdfe2893b13f1cfc846425ff01ae0978957ffefe13a0fba
```

**Important**: Vite requires environment variables to be prefixed with `VITE_` to be accessible in the browser.

### Agent Configuration

The agent ID is hardcoded in `src/lib/elevenlabs.ts`:

```typescript
const AGENT_ID = 'agent_2101ke1rkdp6e0g9x1gyge1fmdns';
```

## Running the Dashboard

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Access the dashboard**:
   Open [http://localhost:5173](http://localhost:5173) in your browser

## Testing with Real Data

### Option 1: Make Test Calls
1. Call your Valentis Dental AI agent
2. Go through a booking flow
3. Watch the dashboard update in real-time (refreshes every 5 seconds)

### Option 2: Check Existing Conversations
If you already have conversations in ElevenLabs:
1. Open the dashboard
2. Navigate to "Call History" to see recent calls
3. Click on any call to view the full transcript
4. Check "Live Calls" to see if any are currently in progress

## Features

### Auto-Polling
- All conversation data refreshes automatically every 5 seconds
- No need to manually refresh the page
- Loading states and skeletons while data loads

### Outcome Detection
The system automatically detects call outcomes by analyzing the transcript:
- **Booked** ✅ - `book_appointment` tool called successfully
- **Failed** ❌ - `book_appointment` tool called but failed
- **Escalated** 🙋 - `human_escallation_message` tool called
- **Inquiry** 💬 - No booking attempted
- **In Progress** ⏳ - Call still active

### Booking Details Extraction
For successfully booked appointments, the dashboard extracts:
- Customer name and phone number
- Appointment date and time
- Service type
- Team member/dentist
- Square booking ID

### Real-Time Stats
Dashboard calculates:
- Total calls today vs yesterday
- AI-answered percentage
- Transfers and escalations
- Average call duration
- Resolution rate (successful outcomes)

## Data Flow

```
ElevenLabs API (https://api.elevenlabs.io/v1/convai/conversations)
    ↓
React Query Hook (polls every 5 seconds)
    ↓
Data Processing (determine outcomes, extract bookings)
    ↓
Dashboard UI (KPIs, tables, modals)
```

## API Response Structure

### Conversation List
```typescript
{
  conversations: [
    {
      conversation_id: "conv_xxx",
      agent_id: "agent_xxx",
      status: "done" | "in_progress",
      user_id: "+447467469406", // Phone number
      created_at: "2026-01-05T15:30:00Z",
      metadata: {}
    }
  ],
  has_more: false
}
```

### Single Conversation (with transcript)
```typescript
{
  conversation_id: "conv_xxx",
  agent_id: "agent_xxx",
  status: "done",
  user_id: "+447467469406",
  created_at: "2026-01-05T15:30:00Z",
  transcript: [
    {
      role: "agent" | "user",
      message: "Hi, this is Sarah...",
      tool_calls: [
        {
          type: "webhook",
          tool_name: "book_appointment",
          params_as_json: "{...}",
          request_id: "xxx"
        }
      ],
      tool_results: [
        {
          tool_name: "book_appointment",
          request_id: "xxx",
          result_value: "{\"success\": true, ...}",
          tool_latency_secs: 0.83
        }
      ],
      time_in_call_secs: 15
    }
  ]
}
```

## Troubleshooting

### No data showing up?
1. Check that `VITE_ELEVENLABS_API_KEY` is set in `.env`
2. Verify the API key is valid
3. Check browser console for API errors
4. Ensure agent has had at least one conversation

### API errors?
- Check Network tab in browser DevTools
- Look for 401 (authentication) or 403 (authorization) errors
- Verify agent ID is correct: `agent_2101ke1rkdp6e0g9x1gyge1fmdns`

### Data not updating?
- React Query polls every 5 seconds
- Try clicking the refresh button manually
- Check that dev server is still running

## Next Steps

### For Production
1. Add error boundaries for API failures
2. Implement retry logic for failed requests
3. Add rate limiting indicators
4. Store conversations in Supabase for historical data
5. Add webhook endpoint to receive real-time updates
6. Implement user authentication

### For Enhanced Demo
1. Add audio playback for completed calls
2. Export transcripts as PDF
3. Filter by date range
4. Search by customer name
5. Analytics charts for trends over time
6. Multi-agent support

## Files Modified/Created

### New Files
- `src/lib/elevenlabs.ts` - API client
- `src/lib/conversationUtils.ts` - Data processing utilities
- `src/hooks/useConversations.ts` - React Query hooks
- `.env.example` - Environment variable template
- `INTEGRATION_README.md` - This file

### Modified Files
- `src/pages/Index.tsx` - Real data integration
- `src/pages/LiveCalls.tsx` - Real data integration
- `src/pages/CallHistory.tsx` - Real data + transcript modal
- `.env` - Added VITE_ELEVENLABS_API_KEY

## Support

For issues or questions:
1. Check the browser console for errors
2. Review the ElevenLabs API documentation
3. Verify environment variables are set correctly
4. Test API directly with curl to rule out dashboard issues

## Quick Test Command

Test the API connection directly:

```bash
curl -H "xi-api-key: sk_efdfe2893b13f1cfc846425ff01ae0978957ffefe13a0fba" \
  "https://api.elevenlabs.io/v1/convai/conversations?agent_id=agent_2101ke1rkdp6e0g9x1gyge1fmdns&page_size=10"
```

This should return a JSON response with your agent's conversations.
