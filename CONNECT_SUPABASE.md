# Quick Guide: Connect to Supabase

## Step 1: Login to Supabase CLI

Run this command in your terminal (it will open your browser for authentication):

```bash
supabase login
```

## Step 2: Link Your Project

After logging in, you need to link your local project to your remote Supabase project.

First, find your project reference ID:
- Go to https://app.supabase.com
- Select your project
- Look at the URL: `https://app.supabase.com/project/your-project-ref`
- Or go to Settings → General → Reference ID

Then link it:

```bash
supabase link --project-ref your-project-ref
```

You'll be prompted for your database password (the one you set when creating the project).

## Step 3: Push the Schema

Once linked, push the database schema:

```bash
# Option 1: Push the schema file directly
supabase db push

# Option 2: Or run the SQL file manually
supabase db execute -f supabase/schema.sql
```

## Step 4: Verify Your .env File

Make sure your `.env` file has these variables (you mentioned you already created this):

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

You can find these in Supabase Dashboard → Settings → API.

## Step 5: Install Dependencies

If you haven't already, install the Supabase JS client:

```bash
npm install @supabase/supabase-js
```

## Alternative: Direct SQL Execution

If you prefer not to use the CLI, you can:

1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy the contents of `supabase/schema.sql`
4. Paste and run it

## Test the Connection

You can test if everything is working by running this in your browser console (after starting your dev server):

```javascript
import { supabase } from './lib/supabase';
const { data, error } = await supabase.from('calls').select('*');
console.log('Connection test:', { data, error });
```

