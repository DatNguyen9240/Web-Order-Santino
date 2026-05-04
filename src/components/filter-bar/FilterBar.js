const FilterBar = {
    render: function() {
        return `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h2 style="font-family: var(--font-display); font-size: 20px;">Sản Phẩm Nổi Bật</h2>
            
            <div style="display: flex; gap: 12px; align-items: center;">
                <!-- Compact Search -->
                <div style="position: relative;">
                    <span class="material-symbols-outlined" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); font-size: 16px; color: var(--vip-text-muted);">search</span>
                    <input type="text" id="searchInput" oninput="applyFilters()" placeholder="Tìm SKU..." class="filter-search" onfocus="this.style.width='200px'" onblur="if(!this.value) this.style.width='120px'">
                </div>

                <button onclick="document.getElementById('filter-panel').classList.toggle('show-filter')" class="filter-btn">
                    <span class="material-symbols-outlined" style="font-size: 16px;">tune</span> Lọc
                </button>

                <div style="width: 1px; height: 16px; background: var(--vip-border);"></div>

                <div style="display: flex; gap: 8px;">
                    <span class="filter-pill active" onclick="setCategory('Tất cả', this)">Tất cả</span>
                    <span class="filter-pill" onclick="setCategory('Sơ mi', this)">Sơ mi</span>
                    <span class="filter-pill" onclick="setCategory('Quần âu', this)">Quần âu</span>
                </div>
            </div>
        </div>
        
        <!-- INLINE FILTER PANEL -->
        <div id="filter-panel" class="filter-panel-dropdown">
            <div style="display: flex; flex-direction: column; gap: 8px; flex: 1;">
                <label class="filter-label">Sắp xếp theo</label>
                <select id="sortSelect" onchange="applyFilters()" class="filter-select">
                    <option value="newest">Mới nhất</option>
                    <option value="price_asc">Giá tăng dần</option>
                    <option value="price_desc">Giá giảm dần</option>
                    <option value="stock_desc">Tồn kho nhiều nhất</option>
                </select>
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px; flex: 1;">
                <label class="filter-label">Màu sắc</label>
                <select id="colorSelect" onchange="applyFilters()" class="filter-select">
                    <option value="all">Tất cả màu</option>
                    <option value="Trắng">Trắng</option>
                    <option value="Đen">Đen</option>
                    <option value="Xanh Navy">Xanh Navy</option>
                    <option value="Xám">Xám</option>
                    <option value="Đỏ đô">Đỏ đô</option>
                </select>
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px; flex: 1;">
                <label class="filter-label">Khoảng giá</label>
                <div style="display: flex; gap: 8px; align-items: center;">
                    <input type="number" id="priceMin" oninput="applyFilters()" placeholder="Từ..." class="filter-input-number">
                    <span style="color: var(--vip-text-muted);">-</span>
                    <input type="number" id="priceMax" oninput="applyFilters()" placeholder="Đến..." class="filter-input-number">
                </div>
            </div>
            <div style="display: flex; align-items: flex-end;">
                <button onclick="document.getElementById('filter-panel').classList.remove('show-filter')" class="filter-apply-btn">Đóng</button>
            </div>
        </div>
        `;
    }
};
