-- 1. 添加缺失的 planting_subject 字段
ALTER TABLE storage_locations ADD COLUMN IF NOT EXISTS planting_subject TEXT;

-- 2. 既然系统提示 impurity_grade 已经是 numeric 类型，我们不需要再进行复杂的转换
-- 为了保险起见，我们只执行简单的类型确认（如果已经是 numeric，这句不会报错）
ALTER TABLE storage_locations ALTER COLUMN impurity_grade TYPE NUMERIC USING impurity_grade::numeric;
ALTER TABLE grain_inspections ALTER COLUMN impurity_grade TYPE NUMERIC USING impurity_grade::numeric;
