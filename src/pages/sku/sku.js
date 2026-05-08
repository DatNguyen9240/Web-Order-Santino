var SkuPage = (function () {
  function render($el) {
    return Router.fetchTemplate('src/pages/sku/sku.html').then(function(html){
      $el.innerHTML = html; _render();
    });
  }
  function _render() {
    var q=(document.getElementById('sku-search')||{}).value||'';
    var prods=[];
    var tbody=document.getElementById('sku-body');
    if(!prods.length){tbody.innerHTML='<tr><td colspan="6" class="empty-state"><span class="material-symbols-outlined">qr_code</span><span data-i18n="table.empty">' + t('table.empty') + '</span></td></tr>';return;}
    tbody.innerHTML=prods.map(function(p){
      var sizes=[];
      var skus=sizes.map(function(s){return Utils.buildSKU(p.ten_hang_2,s.size);}).join(', ');
      return '<tr><td><strong>'+p.ten_hang_2+'</strong></td>'+
        '<td><span class="badge badge-blue">'+p.form+'</span></td>'+
        '<td>'+p.design+'</td>'+
        '<td><span class="badge badge-green">'+p.nhom_size+'</span></td>'+
        '<td style="color:var(--accent);font-weight:700">'+Utils.formatMoney(p.don_gia)+'</td>'+
        '<td><div class="sku-preview" title="'+skus+'">'+(skus||'—')+'</div></td></tr>';
    }).join('');
  }
  return { render:render };
})();
