var SkuPage = (function () {
  var gridApi = null;
  var cachedProds = [];
  var cachedSizes = [];

  function render($el) {
    return Router.fetchTemplate('src/pages/sku/sku.html').then(function(html){
      $el.innerHTML = html;
      _initGrid();
    });
  }

  async function _initGrid() {
    try {
      // Load song song ca san pham va size
      var res = await Promise.all([
        ProductService.getProducts(),
        ProductService.getSizes()
      ]);
      cachedProds = res[0] || [];
      cachedSizes = res[1] || [];
    } catch (err) {
      console.warn('[SkuPage] Lỗi lấy dữ liệu từ API:', err);
    }

    // Fallback data neu khong co du lieu tu API
    if (!cachedProds.length) {
      cachedProds = [
        { id: '1', ten_hang_2: 'Áo sơ mi dài tay công sở', form: 'Slimfit', design: 'Trơn', nhom_size: 'Nhóm 1', don_gia: 350000 },
        { id: '2', ten_hang_2: 'Quần tây nam cao cấp', form: 'Regular', design: 'Kẻ sọc', nhom_size: 'Nhóm 1', don_gia: 450000 },
        { id: '3', ten_hang_2: 'Áo thun polo thể thao', form: 'Regular', design: 'Phối bo', nhom_size: 'Nhóm 2', don_gia: 280000 }
      ];
    }
    if (!cachedSizes.length) {
      cachedSizes = [
        { size: 39, nhom_size: 'Nhóm 1' },
        { size: 40, nhom_size: 'Nhóm 1' },
        { size: 41, nhom_size: 'Nhóm 2' }
      ];
    }

    // Map va sinh SKU cho moi san pham
    var rowData = cachedProds.map(function(p) {
      var tenHang = p.ten_hang_2 || p.TenHang2 || p.tenHang2 || '';
      var form = p.form || p.Form || '';
      var design = p.design || p.Design || '';
      var nhomSize = p.nhom_size || p.NhomSize || p.nhomSize || '';
      var donGia = p.don_gia || p.DonGia || p.Price || 0;

      // Loc cac size thuoc nhom size cua san pham nay
      var matchedSizes = cachedSizes.filter(function(s) {
        var sGroup = s.nhom_size || s.NhomSize || s.nhomSize || '';
        return sGroup.toString().toLowerCase() === nhomSize.toString().toLowerCase();
      });

      var skus = matchedSizes.map(function(s) {
        if (typeof Utils !== 'undefined' && Utils.buildSKU) {
          return Utils.buildSKU(tenHang, s.size);
        }
        return tenHang + '-' + s.size;
      }).join(', ');

      return {
        ten_hang_2: tenHang,
        form: form,
        design: design,
        nhom_size: nhomSize,
        don_gia: donGia,
        skus_generated: skus || '—'
      };
    });

    var container = document.getElementById('sku-grid-container');
    if (!container) return;

    var gridOptions = {
      columnDefs: [
        { field: 'ten_hang_2', headerName: 'Tên hàng 2', cellStyle: { fontWeight: '700' } },
        { 
          field: 'form', 
          headerName: 'Form',
          cellRenderer: function(params) {
            return params.value ? '<span class="badge badge-blue">' + params.value + '</span>' : '—';
          }
        },
        { field: 'design', headerName: 'Design' },
        { 
          field: 'nhom_size', 
          headerName: 'Nhóm size',
          cellRenderer: function(params) {
            return params.value ? '<span class="badge badge-green">' + params.value + '</span>' : '—';
          }
        },
        { 
          field: 'don_gia', 
          headerName: 'Đơn giá',
          cellStyle: { color: 'var(--accent, #4F46E5)', fontWeight: '700' },
          valueFormatter: function(params) {
            if (typeof Utils !== 'undefined' && Utils.formatMoney) {
              return Utils.formatMoney(params.value);
            }
            return params.value;
          }
        },
        { 
          field: 'skus_generated', 
          headerName: 'SKUs sinh ra',
          tooltipField: 'skus_generated',
          cellRenderer: function(params) {
            return '<div class="sku-preview" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="' + params.value + '">' + params.value + '</div>';
          }
        }
      ],
      rowData: rowData
    };

    gridApi = AppGrid.create(container, gridOptions);
  }

  function onSearch(val) {
    if (gridApi) {
      gridApi.setGridOption('quickFilterText', val);
    }
  }

  return { 
    render: render,
    onSearch: onSearch
  };
})();
