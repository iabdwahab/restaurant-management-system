CREATE TABLE ingredients (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
name TEXT NOT NULL,
description TEXT,
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
