-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create calls table for live/active calls
CREATE TABLE IF NOT EXISTS calls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  caller_number TEXT NOT NULL,
  duration_seconds INTEGER DEFAULT 0,
  intent TEXT,
  confidence DECIMAL(5, 2) CHECK (confidence >= 0 AND confidence <= 100),
  status TEXT NOT NULL CHECK (status IN ('active', 'on-hold', 'transferring', 'completed', 'missed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ
);

-- Create call_history table for completed calls with transcripts
CREATE TABLE IF NOT EXISTS call_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  call_id UUID REFERENCES calls(id) ON DELETE CASCADE,
  caller_number TEXT NOT NULL,
  intent TEXT,
  outcome TEXT NOT NULL CHECK (outcome IN ('resolved', 'transferred', 'voicemail', 'missed')),
  duration_seconds INTEGER NOT NULL,
  transcript TEXT,
  summary TEXT,
  audio_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_calls_status ON calls(status);
CREATE INDEX IF NOT EXISTS idx_calls_created_at ON calls(created_at);
CREATE INDEX IF NOT EXISTS idx_calls_caller_number ON calls(caller_number);
CREATE INDEX IF NOT EXISTS idx_call_history_call_id ON call_history(call_id);
CREATE INDEX IF NOT EXISTS idx_call_history_created_at ON call_history(created_at);
CREATE INDEX IF NOT EXISTS idx_call_history_caller_number ON call_history(caller_number);
CREATE INDEX IF NOT EXISTS idx_call_history_outcome ON call_history(outcome);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to update updated_at on calls table
CREATE TRIGGER update_calls_updated_at
  BEFORE UPDATE ON calls
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_history ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users (adjust based on your auth setup)
-- For now, allow all operations - you can restrict this later
CREATE POLICY "Allow all operations on calls" ON calls
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on call_history" ON call_history
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Optional: Create a view for dashboard analytics
CREATE OR REPLACE VIEW call_analytics AS
SELECT
  DATE(created_at) as call_date,
  COUNT(*) as total_calls,
  COUNT(*) FILTER (WHERE status = 'completed') as completed_calls,
  COUNT(*) FILTER (WHERE status = 'missed') as missed_calls,
  COUNT(*) FILTER (WHERE outcome = 'resolved') as resolved_calls,
  COUNT(*) FILTER (WHERE outcome = 'transferred') as transferred_calls,
  AVG(duration_seconds) as avg_duration_seconds,
  AVG(confidence) as avg_confidence
FROM calls
LEFT JOIN call_history ON calls.id = call_history.call_id
GROUP BY DATE(created_at)
ORDER BY call_date DESC;

