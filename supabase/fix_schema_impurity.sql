-- Fix impurity_grade type mismatch
-- Convert impurity_grade from TEXT to NUMERIC (handling potential conversion errors)

-- 1. storage_locations
ALTER TABLE storage_locations ALTER COLUMN impurity_grade TYPE NUMERIC USING (
  CASE 
    WHEN impurity_grade ~ '^[0-9]+(\.[0-9]+)?$' THEN impurity_grade::numeric
    ELSE 0 -- Default to 0 if conversion fails or it was '一级' etc.
  END
);

-- 2. grain_inspections
ALTER TABLE grain_inspections ALTER COLUMN impurity_grade TYPE NUMERIC USING (
  CASE 
    WHEN impurity_grade ~ '^[0-9]+(\.[0-9]+)?$' THEN impurity_grade::numeric
    ELSE 0
  END
);
