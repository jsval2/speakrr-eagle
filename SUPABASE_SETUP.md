# Supabase Setup Guide

This guide will help you connect your dashboard to Supabase and set up the database schema.

## Prerequisites

1. A Supabase project (create one at https://app.supabase.com)
2. Your Supabase project URL and anon key from the project settings

## Step 1: Install Dependencies

First, install the Supabase JS client:

```bash
npm install @supabase/supabase-js
```

Or if you're using bun:

```bash
bun add @supabase/supabase-js
```

## Step 2: Configure Environment Variables

Add your Supabase credentials to your `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project:
1. Go to https://app.supabase.com
2. Select your project
3. Go to Settings → API
4. Copy the "Project URL" and "anon public" key

## Step 3: Connect via Supabase CLI

### Install Supabase CLI

```bash
# macOS
brew install supabase/tap/supabase

# Or using npm
npm install -g supabase
```

### Login to Supabase

```bash
supabase login
```

This will open your browser to authenticate.

### Link Your Project

```bash
# Initialize Supabase in your project (if not already done)
supabase init

# Link to your remote project
supabase link --project-ref your-project-ref
```

You can find your project ref in your Supabase project URL:
- URL format: `https://your-project-ref.supabase.co`
- The project ref is the part before `.supabase.co`

### Alternative: Direct Database Connection

If you prefer to run SQL directly, you can:

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase/schema.sql`
4. Run the SQL script

## Step 4: Run the Schema

Once connected via CLI, you can run the schema:

```bash
# Push the schema to your remote database
supabase db push
```

Or manually run the SQL:

```bash
# Using psql (if you have the connection string)
psql "your-connection-string" -f supabase/schema.sql

# Or use the Supabase CLI
supabase db execute -f supabase/schema.sql
```

## Step 5: Verify Connection

The Supabase client is already set up in `src/lib/supabase.ts`. You can test the connection by importing it in your components:

```typescript
import { supabase } from '@/lib/supabase';

// Test query
const { data, error } = await supabase.from('calls').select('*');
console.log('Calls:', data, error);
```

## Database Schema

The schema includes:

1. **calls** table - For live/active calls
   - Tracks caller number, duration, intent, confidence, status
   - Auto-updates `updated_at` timestamp

2. **call_history** table - For completed calls
   - Stores transcripts, summaries, outcomes
   - Links to calls table via `call_id`

3. **call_analytics** view - Pre-aggregated analytics
   - Daily call statistics
   - Useful for dashboard KPIs

## Next Steps

1. Update your dashboard components to fetch data from Supabase
2. Set up real-time subscriptions for live calls
3. Configure Row Level Security (RLS) policies based on your auth requirements
4. Connect your 11 Labs voice agent to write call data to these tables

## Troubleshooting

- **Connection errors**: Verify your `.env` file has the correct values
- **RLS errors**: Check that your RLS policies allow the operations you need
- **Schema errors**: Make sure you've run the schema.sql file in your database

