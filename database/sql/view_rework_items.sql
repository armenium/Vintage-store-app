DROP VIEW IF EXISTS rework_items;
CREATE VIEW rework_items AS SELECT
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
WHERE p.product_id NOT IN (SELECT product_id FROM tags WHERE tag = 'MARKET')
    AND p.is_mystery = 0
    AND p.status = 'active'
    AND p.title LIKE '%REWORK%'
    AND (p.link_asos != '' OR p.link_depop != '')
    AND v.inventory_quantity = 1
    AND (p.body LIKE '%A* Vintage Quality%' OR body LIKE '%A Vintage Quality%')
ORDER BY v.price;


