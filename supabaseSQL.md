CREATE TABLE ingredients (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
name TEXT NOT NULL,
description TEXT,
is_available BOOLEAN DEFAULT true,
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE categories (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
name TEXT NOT NULL,
description TEXT,
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE menu_items (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
name TEXT NOT NULL,
description TEXT,
price DECIMAL(10, 2) NOT NULL,
image_url TEXT,
is_available BOOLEAN DEFAULT true,
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE item_ingredients (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE,
UNIQUE(menu_item_id, ingredient_id)
);

---

Linking menu_items' is_available with ingredients' is_available = as item will be unavailable if there is an ingredient does not available

CREATE OR REPLACE FUNCTION update_menu_item_availability()
RETURNS TRIGGER AS $$
BEGIN
-- تحديث حالة الأطباق المرتبطة بالمكون الذي تم تعديله
UPDATE menu_items
SET is_available = (
SELECT NOT EXISTS (
SELECT 1
FROM item_ingredients ii
JOIN ingredients i ON ii.ingredient_id = i.id
WHERE ii.menu_item_id = menu_items.id AND i.is_available = false
)
)
WHERE id IN (
SELECT menu_item_id
FROM item_ingredients
WHERE ingredient_id = NEW.id
);
RETURN NEW;
END;

$$
LANGUAGE plpgsql;



--
CREATE TRIGGER trigger_update_availability
AFTER UPDATE OF is_available ON ingredients
FOR EACH ROW
EXECUTE FUNCTION update_menu_item_availability();
-


$$
