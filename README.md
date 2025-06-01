# Modular Dashboard Application

A customizable dashboard application built with Next.js, Supabase, and React Grid Layout.

## Features

- Three specialized tabs (Finance, Personal, Professional)
- Responsive grid layout with draggable and resizable widgets
- Widget management (add, remove, resize, reposition)
- Configuration persistence using Supabase
- Example widgets (Price Alert and Todo List)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your Supabase project and add credentials to `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-url.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

4. Set up the required Supabase tables:

   ```sql
   -- Dashboard configurations
   create table dashboard_configs (
     id uuid default uuid_generate_v4() primary key,
     user_id uuid references auth.users not null,
     config jsonb not null default '{}'::jsonb,
     created_at timestamp with time zone default now() not null,
     updated_at timestamp with time zone default now() not null,
     unique(user_id)
   );

   -- Widget data
   create table widget_data (
     id uuid default uuid_generate_v4() primary key,
     user_id uuid references auth.users not null,
     widget_id text not null,
     widget_type text not null,
     data jsonb not null default '{}'::jsonb,
     created_at timestamp with time zone default now() not null,
     updated_at timestamp with time zone default now() not null,
     unique(user_id, widget_id)
   );

   -- RLS policies for security
   alter table dashboard_configs enable row level security;
   alter table widget_data enable row level security;

   create policy "Users can only access their own dashboard configs"
     on dashboard_configs for all
     using (auth.uid() = user_id);

   create policy "Users can only access their own widget data"
     on widget_data for all
     using (auth.uid() = user_id);
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Extending with New Widgets

To add a new widget type:

1. Create a new widget component in `components/widgets/`
2. Add the widget type to the `widgetTypes` array in `components/dashboard/AddWidgetDialog.tsx`
3. Register the widget in the `widgetComponents` object in `components/dashboard/WidgetWrapper.tsx`

## Deployment

This project is configured to be deployed on Vercel. Connect your repository to Vercel and it will automatically deploy your application.

Make sure to add your Supabase environment variables in the Vercel project settings.