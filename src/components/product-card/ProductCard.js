/**
 * ProductCard Component
 * Render thẻ sản phẩm chuẩn VIP B2B E-commerce
 */
var ProductCard = (function() {
    
    /**
     * @param {Object} product - Object chứa thông tin sản phẩm {sku, name, price, img, stock}
     * @param {Number} index - Vị trí của sản phẩm trong mảng để gọi hàm addToCart
     * @param {Function} formatMoneyFn - Hàm format tiền tệ (Ví dụ: 450000 -> 450.000đ)
     * @param {String} addToCartFnName - Tên hàm JS sẽ gọi khi click (Mặc định: 'addToCart')
     */
    function render(product, index, formatMoneyFn, addToCartFnName = 'addToCart') {
        const isOutOfStock = product.stock === 0;
        const stockBadge = isOutOfStock 
            ? '<div class="stock-badge" style="color:#ef4444;">Hết hàng</div>' 
            : `<div class="stock-badge">Còn ${product.stock}</div>`;
        
        const btnState = isOutOfStock ? 'disabled' : `onclick="${addToCartFnName}(${index})"`;
        const formattedPrice = typeof formatMoneyFn === 'function' ? formatMoneyFn(product.price) : product.price + 'đ';

        return `
            <div class="product-card">
                <div class="product-img-wrap">
                    ${stockBadge}
                    <img src="${product.img}" class="product-img" alt="${product.name}" loading="lazy">
                </div>
                <div class="product-info">
                    <div class="product-sku">SKU: ${product.sku}</div>
                    <div class="product-name" title="${product.name}">${product.name}</div>
                    <div class="product-price">${formattedPrice}</div>
                    <button class="btn-add" ${btnState} aria-label="Thêm vào giỏ">
                        <span class="material-symbols-outlined" style="font-size: 20px;">add_shopping_cart</span>
                    </button>
                </div>
            </div>
        `;
    }

    return {
        render: render
    };
})();
