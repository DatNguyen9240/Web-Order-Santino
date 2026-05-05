/**
 * DB — localStorage CRUD helper
 * Collections: 'products', 'sizes', 'promotions', 'orders'
 */
const DB = (function () {
  const PREFIX = 'santino_';

  function _key(col) { return PREFIX + col; }
  function getAll(col) {
    try { return JSON.parse(localStorage.getItem(_key(col))) || []; }
    catch { return []; }
  }
  function setAll(col, arr) { localStorage.setItem(_key(col), JSON.stringify(arr)); }

  function add(col, item) {
    const arr = getAll(col);
    item.id = item.id || Date.now() + '_' + Math.random().toString(36).slice(2, 6);
    arr.push(item);
    setAll(col, arr);
    return item;
  }
  function update(col, id, patch) {
    const arr = getAll(col).map(r => r.id === id ? { ...r, ...patch } : r);
    setAll(col, arr);
  }
  function remove(col, id) {
    setAll(col, getAll(col).filter(r => r.id !== id));
  }
  function find(col, id) {
    return getAll(col).find(r => r.id === id);
  }

  // Init seed data (chỉ chạy lần đầu nếu chưa có data)
  function initSeed() {
    if (!localStorage.getItem(_key('products'))) {
      const seeded = productMaster.map((p, i) => ({ ...p, id: 'p' + i }));
      setAll('products', seeded);
    }
    if (!localStorage.getItem(_key('sizes'))) {
      const seeded = [];
      Object.entries(sizeGroups).forEach(([group, sizes]) => {
        sizes.forEach(s => seeded.push({ id: group + '_' + s, size: s, ten_size: String(s), nhom_size: group }));
      });
      setAll('sizes', seeded);
    }
    if (!localStorage.getItem(_key('promotions'))) {
      const seeded = promotionsData.map(p => ({ ...p, id: p.ma_ctbh }));
      setAll('promotions', seeded);
    }
    if (!localStorage.getItem(_key('orders'))) {
      setAll('orders', []);
    }
  }

  return { getAll, setAll, add, update, remove, find, initSeed };
})();
