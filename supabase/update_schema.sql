-- Add new fields for Raw Grain Monitoring optimization

-- Update storage_locations table
ALTER TABLE storage_locations ADD COLUMN IF NOT EXISTS impurity_grade TEXT;
ALTER TABLE storage_locations ADD COLUMN IF NOT EXISTS temperature NUMERIC;
ALTER TABLE storage_locations ADD COLUMN IF NOT EXISTS humidity NUMERIC;

-- Update grain_inspections table
ALTER TABLE grain_inspections ADD COLUMN IF NOT EXISTS impurity_grade TEXT;
ALTER TABLE grain_inspections ADD COLUMN IF NOT EXISTS temperature NUMERIC;
ALTER TABLE grain_inspections ADD COLUMN IF NOT EXISTS humidity NUMERIC;
