-- Create tables for Grain Valley Digital Platform

-- Crops table (Global Context)
create table crops (
  id text primary key, -- 'rice' or 'wheat'
  name text not null
);

insert into crops (id, name) values ('rice', '水稻'), ('wheat', '小麦');

-- Agricultural Activities (Module 1)
create table activities (
  id uuid default gen_random_uuid() primary key,
  crop_id text references crops(id) not null,
  date date not null default current_date,
  activity_type text not null, -- e.g., 'planting', 'fertilizing'
  description text,
  status text default 'pending', -- 'pending', 'completed'
  created_at timestamptz default now()
);

-- Machinery (Module 2)
create table machinery (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  type text not null, -- e.g., 'tractor', 'harvester'
  status text default 'idle', -- 'idle', 'working', 'maintenance'
  location text, -- simple text for now, could be lat/long later
  created_at timestamptz default now()
);

-- Dispatches (Module 2)
create table dispatches (
  id uuid default gen_random_uuid() primary key,
  machinery_id uuid references machinery(id) not null,
  activity_id uuid references activities(id), -- optional link to activity
  date date not null default current_date,
  status text default 'scheduled', -- 'scheduled', 'in_progress', 'completed'
  created_at timestamptz default now()
);

-- Locations / Warehouses (Module 3)
create table locations (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  admin_name text,
  crop_type text references crops(id), -- what is stored here
  grain_quality text, -- e.g., 'A', 'B'
  grain_weight numeric,
  remarks text,
  created_at timestamptz default now()
);

-- Inspection Records (Module 3)
create table inspections (
  id uuid default gen_random_uuid() primary key,
  location_id uuid references locations(id) not null,
  date date not null default current_date,
  inspector_name text,
  grain_quality text,
  grain_weight numeric,
  created_at timestamptz default now()
);
