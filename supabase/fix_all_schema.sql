-- 1. 添加缺失的 planting_subject 字段 (如果尚未添加)
ALTER TABLE storage_locations ADD COLUMN IF NOT EXISTS planting_subject TEXT;

-- 2. 转换 storage_locations 表的 impurity_grade 为数字类型
-- 如果字段类型已经是 TEXT，需要先转换内容，非数字内容将转换为 0
ALTER TABLE storage_locations ALTER COLUMN impurity_grade TYPE NUMERIC USING (
  CASE 
    WHEN impurity_grade ~ '^[0-9]+(\.[0-9]+)?$' THEN impurity_grade::numeric
    ELSE 0 
  END
);

-- 3. 转换 grain_inspections 表的 impurity_grade 为数字类型
ALTER TABLE grain_inspections ALTER COLUMN impurity_grade TYPE NUMERIC USING (
  CASE 
    WHEN impurity_grade ~ '^[0-9]+(\.[0-9]+)?$' THEN impurity_grade::numeric
    ELSE 0
  END
);
