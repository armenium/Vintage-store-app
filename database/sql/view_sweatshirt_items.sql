DROP VIEW IF EXISTS sweatshirt_items;
CREATE VIEW sweatshirt_items AS SELECT
	p.id,
	p.shop_id,
	p.product_id,
	v.variant_id,
	p.title AS product_title,
	v.title AS variant_title,
	v.inventory_quantity,
	v.price,
	v.size,
	v.color,
	p.image
FROM products p
LEFT JOIN variants v ON p.product_id = v.product_id
WHERE p.is_mystery = 0
  AND p.status = 'active'
  AND (p.link_asos != '' OR p.link_depop != '')
  AND v.inventory_quantity = 1
  AND v.price = 12
  AND p.title LIKE '%Sweatshirt%'
  AND (p.body LIKE '%A* Vintage Quality%' OR body LIKE '%A Vintage Quality%')
ORDER BY v.product_id ASC;

