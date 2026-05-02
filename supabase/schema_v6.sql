-- 掲載期間カラムをカタログアイテムに追加
alter table catalog_items add column if not exists display_start_date date;
alter table catalog_items add column if not exists display_end_date date;

-- 既存のカタログをすべてクリア（管理者パネルから新しいピコトン商品を再投入してください）
delete from catalog_items;
