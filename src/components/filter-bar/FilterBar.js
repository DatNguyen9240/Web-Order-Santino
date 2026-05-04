const FilterBar = {
    render: function() {
        const lang = localStorage.getItem('santino_lang') || 'vi';
        const t = (typeof translations !== 'undefined' && translations[lang]) ? translations[lang] : {};
        const getT = (key, defaultText) => t[key] || defaultText;

        return `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h2 style="font-family: var(--font-display); font-size: 20px;">${getT("filter.title", "Sản Phẩm Nổi Bật")}</h2>
            
            <div style="display: flex; gap: 12px; align-items: center;">
                <!-- Compact Search -->
                <div style="position: relative;">
                    <span class="material-symbols-outlined" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); font-size: 16px; color: var(--vip-text-muted);">search</span>
                    <input type="text" id="searchInput" oninput="applyFilters()" placeholder="${getT("filter.search", "Tìm SKU...")}" class="filter-search" onfocus="this.style.width='200px'" onblur="if(!this.value) this.style.width='120px'">
                </div>

                <button onclick="document.getElementById('filter-panel').classList.toggle('show-filter')" class="filter-btn">
                    <span class="material-symbols-outlined" style="font-size: 16px;">tune</span> ${getT("filter.btn", "Lọc")}
                </button>

                <div style="width: 1px; height: 16px; background: var(--vip-border);"></div>

                <div style="display: flex; gap: 8px;">
                    <span class="filter-pill active" onclick="setCategory('Tất cả', this)">${getT("filter.cat.all", "Tất cả")}</span>
                    <span class="filter-pill" onclick="setCategory('Sơ mi', this)">${getT("filter.cat.shirt", "Sơ mi")}</span>
                    <span class="filter-pill" onclick="setCategory('Quần âu', this)">${getT("filter.cat.pants", "Quần âu")}</span>
                </div>
            </div>
        </div>
        
        <!-- INLINE FILTER PANEL -->
        <div id="filter-panel" class="filter-panel-dropdown">
            <div style="display: flex; flex-direction: column; gap: 8px; flex: 1;">
                <label class="filter-label">${getT("filter.sort.label", "Sắp xếp theo")}</label>
                <select id="sortSelect" onchange="applyFilters()" class="filter-select">
                    <option value="newest">${getT("filter.sort.newest", "Mới nhất")}</option>
                    <option value="price_asc">${getT("filter.sort.price_asc", "Giá tăng dần")}</option>
                    <option value="price_desc">${getT("filter.sort.price_desc", "Giá giảm dần")}</option>
                    <option value="stock_desc">${getT("filter.sort.stock", "Tồn kho nhiều nhất")}</option>
                </select>
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px; flex: 1;">
                <label class="filter-label">${getT("filter.color.label", "Màu sắc")}</label>
                <select id="colorSelect" onchange="applyFilters()" class="filter-select">
                    <option value="all">${getT("filter.color.all", "Tất cả màu")}</option>
                    <option value="Trắng">${getT("filter.color.white", "Trắng")}</option>
                    <option value="Đen">${getT("filter.color.black", "Đen")}</option>
                    <option value="Xanh Navy">${getT("filter.color.navy", "Xanh Navy")}</option>
                    <option value="Xám">${getT("filter.color.gray", "Xám")}</option>
                    <option value="Đỏ đô">${getT("filter.color.red", "Đỏ đô")}</option>
                </select>
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px; flex: 1;">
                <label class="filter-label">${getT("filter.price.label", "Khoảng giá")}</label>
                <div style="display: flex; gap: 8px; align-items: center;">
                    <input type="number" id="priceMin" oninput="applyFilters()" placeholder="${getT("filter.price.min", "Từ...")}" class="filter-input-number">
                    <span style="color: var(--vip-text-muted);">-</span>
                    <input type="number" id="priceMax" oninput="applyFilters()" placeholder="${getT("filter.price.max", "Đến...")}" class="filter-input-number">
                </div>
            </div>
            <div style="display: flex; align-items: flex-end;">
                <button onclick="document.getElementById('filter-panel').classList.remove('show-filter')" class="filter-apply-btn">${getT("filter.close", "Đóng")}</button>
            </div>
        </div>
        `;
    }
};
