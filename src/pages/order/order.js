var OrderPage = (function () {
  var orderRows = [];
  var multiSelectedCodes = [];
  var cachedProds = {};
  var cachedSizes = [];

  // Load script động nếu chưa có trong bundle
  function _dynScript(src) {
    return new Promise(function (resolve) {
      if (document.querySelector('script[src*="' + src.split('/').pop() + '"]')) {
        resolve(); return;
      }
      var el = document.createElement('script');
      el.src = src + '?v=' + Date.now();
      el.onload = resolve;
      el.onerror = function () { console.warn('Could not load:', src); resolve(); };
      document.body.appendChild(el);
    });
  }

  function _dynCss(src) {
    var id = 'dyn-css-' + src.split('/').pop().replace('.', '-');
    if (document.getElementById(id)) return;
    var el = document.createElement('link');
    el.id = id;
    el.rel = 'stylesheet';
    el.href = src + '?v=' + Date.now();
    document.head.appendChild(el);
  }

  async function _ensureComponents() {
    if (window.UIControls && UIControls.createDataComboBox) return; // Đã có trong bundle
    // Load CSS trước
    _dynCss('src/components/ui-utils/shared-dropdown.css');
    _dynCss('src/components/data-combobox/combobox.css');
    // Load JS theo thứ tự
    await _dynScript('src/components/ui-utils/UIUtils.js');
    await _dynScript('src/components/data-combobox/DataComboBox.js');
  }

  function render($el) {
    return Router.fetchTemplate('src/pages/order/order.html')
      .then(function (html) {
        $el.innerHTML = html;
        _init();
      });
  }

  async function _init() {
    // 1. Lấy bảng size và thông tin cơ bản
    var resSizes = await ProductService.getSizes();
    if (Array.isArray(resSizes) && resSizes.length > 0) {
      cachedSizes = resSizes;
    }
    document.getElementById('o-so-ct').value = Utils.genOrderNo();
    document.getElementById('o-ngay').value = Utils.today();
    document.getElementById('o-kh-ten').value = '';
    document.getElementById('o-ma-kh').value = '';
    document.getElementById('o-ma-dl').value = '';
    document.getElementById('o-ngay-tt').value = Utils.today();
    document.getElementById('o-kh-dc').value = '';

    // 2. Đảm bảo component đã load, rồi mới inject danh mục
    await _ensureComponents();
    _loadCategories();

    var sel = document.getElementById('o-ctbh');
    if (sel) {
      sel.innerHTML = '<option value="">-- Không áp dụng CTKM --</option>';
      if (sel.options.length > 0) sel.selectedIndex = 0;
    }

    renderMatrix();
    document.addEventListener('click', function (e) {
      // In default multi-mode, user must explicitly click "Hủy" or "Thêm đã chọn"
    });
  }

  // Tìm kiếm danh mục server-side — gọi Http trực tiếp,
  // tránh dùng CategoryService cũ có thể đang trong bundle cũ.
  function _searchCategory(loai, timKiem) {
    var q = { Loai: loai };
    if (timKiem && timKiem.trim()) q.TimKiem = timKiem.trim();
    var params = { q: JSON.stringify(q) };
    if (timKiem && timKiem.trim()) params._t = Date.now();
    return Http.get(API_CONFIG.ENDPOINTS.CATEGORIES.LIST, params)
      .then(function (res) {
        var data = res.records || res;
        if (!Array.isArray(data)) return [];
        return data.map(function (item) {
          return {
            id: item.id || item.Id || '',
            name: item.name || item.Name || '',
            address: item.address || '',
            phone: item.phone || '',
            department: item.department || '',
            due_days: item.due_days != null ? item.due_days : null,
            is_default: item.is_default || false
          };
        });
      })
      .catch(function () { return []; });
  }

  var _catValues = {
    khach_hang: { id: '', name: '' },
    chi_nhanh: { id: '', name: '' },
    nvkd: { id: '', name: '' },
    dieu_khoan: { id: '', name: '' },
    ht_tt: { id: '', name: '' }
  };

  var _combos = {};

  async function _loadCategories() {
    try {
      const [branches, employees, payTypes, payTerms, customers, promotions] = await Promise.all([
        CategoryService.getCategories('Branch'),
        CategoryService.getCategories('Employee'),
        CategoryService.getCategories('PaymentType'),
        CategoryService.getCategories('PaymentTerm'),
        CategoryService.getCategories('Customer'),
        CategoryService.getCategories('Promotion')
      ]);

      // ── Khách hàng (MỚI) ──────────────────────────────────────────
      var wrapKH = document.getElementById('wrap-khach-hang');
      if (wrapKH && UIControls && UIControls.createDataComboBox) {
        _combos.kh = UIControls.createDataComboBox({
          id: 'o-ma-kh-search',
          placeholder: '-- Tìm khách hàng --',
          headers: ['Khách hàng', 'Tên kh/hàng', 'Địa chỉ', 'Mã NV', 'Chi nhánh'],
          data: customers.map(function (c) { return [c.id, c.name, c.address || '', c.employee_id || '', c.branch_id || '']; }),
          colFilterIndex: 1,
          colHighlightIndex: 1,
          onSearch: function (q) {
            return _searchCategory('Customer', q).then(function (list) {
              return list.map(function (c) { return [c.id, c.name, c.address || '', c.employee_id || '', c.branch_id || '']; });
            });
          },
          onSelect: function (row) {
            var id = row[0], name = row[1], addr = row[2], empId = row[3], branchId = row[4];
            document.getElementById('o-ma-kh').value = id;
            document.getElementById('o-kh-ten').value = name;
            document.getElementById('o-kh-dc').value = addr;
            _catValues.khach_hang = { id: id, name: name };
            
            // Tự động tìm và set cho Chi nhánh
            if (branchId && _combos.branch) {
              var b = branches.find(x => x.id === branchId);
              if (b) {
                _combos.branch.querySelector('input').value = b.name;
                _catValues.chi_nhanh = { id: b.id, name: b.name };
              }
            }
            // Tự động tìm và set cho Nhân viên
            if (empId && _combos.nvkd) {
              var e = employees.find(x => x.id === empId);
              if (e) {
                _combos.nvkd.querySelector('input').value = e.name;
                _catValues.nvkd = { id: e.id, name: e.name };
              }
            }
            updateInfoSummary();
          },
          onF2: function() {
            openModal('modal-create-customer');
          }
        });
        wrapKH.appendChild(_combos.kh);
      }

      // ── Mã đại lý (Dùng chung danh mục Customer) ──────────────
      var wrapMaDL = document.getElementById('wrap-ma-dl');
      if (wrapMaDL && UIControls && UIControls.createDataComboBox) {
        _combos.ma_dl = UIControls.createDataComboBox({
          id: 'o-ma-dl-search',
          placeholder: '-- Tìm đại lý --',
          headers: ['Khách hàng', 'Tên khách hàng', 'Địa chỉ'],
          data: customers.map(function (c) { return [c.id, c.name, c.address || '']; }),
          colFilterIndex: 1,
          colHighlightIndex: 1,
          onSearch: function (q) {
            return _searchCategory('Customer', q).then(function (list) {
              return list.map(function (c) { return [c.id, c.name, c.address || '']; });
            });
          },
          onSelect: function (row) {
            document.getElementById('o-ma-dl').value = row[0];
          }
        });
        wrapMaDL.appendChild(_combos.ma_dl);
      }

      // ── Chi nhánh ─────────────────────────────────────────────
      var wrapBranch = document.getElementById('wrap-chi-nhanh');
      if (wrapBranch && UIControls && UIControls.createDataComboBox) {
        var defaultBranch = branches.find(function (b) { return b.is_default; }) || branches[0] || {};
        _catValues.chi_nhanh = { id: defaultBranch.id || '', name: defaultBranch.name || '' };

        _combos.branch = UIControls.createDataComboBox({
          id: 'o-chi-nhanh',
          placeholder: '-- Chọn chi nhánh --',
          headers: ['Tên chi nhánh', 'Chi nhánh', 'STT'],
          data: branches.map(function (b) { return [b.name, b.id, b.stt]; }),
          colFilterIndex: 0,
          colHighlightIndex: 0,
          onSearch: function (q) {
            return _searchCategory('Branch', q).then(function (list) {
              return list.map(function (b) { return [b.name, b.id, b.stt]; });
            });
          },
          onSelect: function (row) {
            _catValues.chi_nhanh = { id: row[1], name: row[0] };
          }
        });
        _combos.branch.querySelector('input').value = defaultBranch.name || '';
        wrapBranch.appendChild(_combos.branch);
      }

      // ── Nhân viên KD ──────────────────────────────────────────
      var wrapNvkd = document.getElementById('wrap-nvkd');
      if (wrapNvkd && UIControls && UIControls.createDataComboBox) {
        _combos.nvkd = UIControls.createDataComboBox({
          id: 'o-nvkd',
          placeholder: '-- Chọn nhân viên --',
          headers: ['Tên nhân viên', 'Mã NV'],
          data: employees.map(function (e) { return [e.name, e.id]; }),
          colFilterIndex: 0,
          colHighlightIndex: 0,
          onSearch: function (q) {
            return _searchCategory('Employee', q).then(function (list) {
              return list.map(function (e) { return [e.name, e.id]; });
            });
          },
          onSelect: function (row) {
            _catValues.nvkd = { id: row[1], name: row[0] };
          }
        });
        wrapNvkd.appendChild(_combos.nvkd);
      }

      // ── Điều khoản TT ─────────────────────────────────────────
      var wrapDK = document.getElementById('wrap-dieu-khoan');
      if (wrapDK && UIControls && UIControls.createDataComboBox) {
        _combos.dk = UIControls.createDataComboBox({
          id: 'o-dieu-khoan',
          placeholder: '-- Chọn điều khoản --',
          headers: ['Mã', 'Điều khoản', 'Số ngày'],
          data: payTerms.map(function (p) { return [p.id, p.name, p.due_days != null ? p.due_days + ' ngày' : '']; }),
          colFilterIndex: 1,
          colHighlightIndex: 1,
          onSearch: function (q) {
            return _searchCategory('PaymentTerm', q).then(function (list) {
              return list.map(function (p) { return [p.id, p.name, p.due_days != null ? p.due_days + ' ngày' : '']; });
            });
          },
          onSelect: function (row) {
            _catValues.dieu_khoan = { id: row[0], name: row[1] };
          }
        });
        wrapDK.appendChild(_combos.dk);
      }

      // ── Hình thức thanh toán ───────────────────────────────────
      var wrapHT = document.getElementById('wrap-ht-thanh-toan');
      if (wrapHT && UIControls && UIControls.createDataComboBox) {
        var defaultPay = payTypes.find(function (p) { return /tiền mặt/i.test(p.name); }) || payTypes[0] || {};
        _catValues.ht_tt = { id: defaultPay.id || '', name: defaultPay.name || '' };

        _combos.ht = UIControls.createDataComboBox({
          id: 'o-ht-thanh-toan',
          placeholder: '-- Chọn hình thức --',
          headers: ['Mã', 'Hình thức'],
          data: payTypes.map(function (p) { return [p.id, p.name]; }),
          colFilterIndex: 1,
          colHighlightIndex: 1,
          onSearch: function (q) {
            return _searchCategory('PaymentType', q).then(function (list) {
              return list.map(function (p) { return [p.id, p.name]; });
            });
          },
          onSelect: function (row) {
            _catValues.ht_tt = { id: row[0], name: row[1] };
          }
        });
        _combos.ht.querySelector('input').value = defaultPay.name || '';
        wrapHT.appendChild(_combos.ht);
      }

      // ── CTKM ──────────────────────────────────────────────────
      var wrapKM = document.getElementById('wrap-ctkm');
      if (wrapKM && UIControls && UIControls.createDataComboBox) {
        _combos.ctkm = UIControls.createDataComboBox({
          id: 'o-ctkm-search',
          placeholder: '-- Chọn CTKM --',
          headers: ['Tên chiết khấu', 'Chiết khấu'],
          data: promotions.map(function (p) { return [p.name, p.id]; }),
          colFilterIndex: 0,
          colHighlightIndex: 0,
          onSearch: function (q) {
            return _searchCategory('Promotion', q).then(function (list) {
              return list.map(function (p) { return [p.name, p.id]; });
            });
          },
          onSelect: function (row) {
            document.getElementById('o-ctbh').value = row[1];
            updateInfoSummary();
          }
        });
        wrapKM.appendChild(_combos.ctkm);
      }
    } catch (err) {
      console.warn('[OrderPage] Lỗi load danh mục:', err);
    }
  }


  function updateInfoSummary() {
    var name = document.getElementById('o-kh-ten').value.trim();
    var maKH = document.getElementById('o-ma-kh').value.trim();
    var ptGiao = document.getElementById('o-pt-giao').value;
    var summary = document.getElementById('info-summary-display');
    if (!summary) return;

    if (!name && !maKH) {
      summary.innerHTML = 'Chạm để khai báo thông tin...';
      summary.style.color = 'var(--text)';
    } else {
      var displayName = (maKH ? maKH + ' - ' : '') + (name || 'Khách lẻ');
      var parts = [displayName];
      if (ptGiao) parts.push(ptGiao);
      summary.innerHTML = parts.join(' | ');
      summary.style.color = 'var(--primary)';
    }
  }

  async function acSearch(val) {
    var btnClear = document.getElementById('ac-clear');
    if (btnClear) btnClear.style.display = val ? 'block' : 'none';

    var list = document.getElementById('ac-list');
    if (!val || val.length < 2) { list.classList.remove('show'); return; }

    // Gọi API qua Service lấy sản phẩm
    var prods = await ProductService.getProducts(val);
    prods.forEach(function (p) { cachedProds[p.ten_hang_2] = p; });

    if (!prods.length) {
      list.innerHTML = '<div class="ac-item"><small>Không tìm thấy sản phẩm</small></div>';
      list.classList.add('show');
      return;
    }

    var html = '<div class="ac-header"><div style="width:24px; margin-right:12px; flex-shrink:0"></div><div class="ac-col-1">SẢN PHẨM</div><div class="ac-col-2" style="min-width:45px">FORM</div><div class="ac-col-3" style="min-width:26px; text-align:center">TỒN</div><div class="ac-col-3" style="min-width:75px">ĐƠN GIÁ</div></div>';

    html += prods.slice(0, 8).map(function (p) {
      var pos = multiSelectedCodes.indexOf(p.ten_hang_2);
      var isChecked = pos !== -1 ? 'checked' : '';
      var numDisplay = pos !== -1 ? 'flex' : 'none';
      var numVal = pos !== -1 ? (pos + 1) : '';
      var brand = p.ten_hang_2.match(/^[A-Z]+/); brand = brand ? brand[0] : '';
      var stock = p.ton_kho !== undefined ? p.ton_kho : (Math.floor(Math.random() * 50) + 10);
      var stockColor = stock > 20 ? 'var(--success)' : 'var(--accent)';
      return '<div class="ac-table-row" onclick="OrderPage.toggleAcSelect(event, \'' + p.ten_hang_2 + '\')">' +
        '<div style="position:relative; margin-right:12px; width:18px; height:18px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">' +
        '<input type="checkbox" class="chk-code" ' + isChecked + ' id="chk-' + p.ten_hang_2 + '" value="' + p.ten_hang_2 + '" onclick="event.stopPropagation(); OrderPage.toggleAcSelect(event, \'' + p.ten_hang_2 + '\')" style="margin:0; width:16px; height:16px; cursor:pointer;">' +
        '<div class="chk-num" id="chk-num-' + p.ten_hang_2 + '" style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); pointer-events:none; display:' + numDisplay + '; align-items:center; justify-content:center; width:18px; height:18px; background:var(--primary); color:white; font-size:11px; font-weight:bold; border-radius:4px;">' + numVal + '</div>' +
        '</div>' +
        '<div class="ac-col-1" style="padding-right:4px;"><strong>' + p.ten_hang_2 + '</strong><div style="font-size:calc(12px * var(--text-scale,1)); color:var(--muted); white-space:normal; line-height:1.2"><span class="ac-desc">' + p.ten_hang_hoa + '</span> - <small>' + p.mau + '</small></div></div>' +
        '<div class="ac-col-2" style="min-width:45px"><span class="ac-form-badge">' + brand + '</span></div>' +
        '<div class="ac-col-3" style="min-width:26px; text-align:center; font-weight:700; color:' + stockColor + '">' + stock + '</div>' +
        '<div class="ac-col-3" style="min-width:75px">' + Utils.formatMoney(p.don_gia) + '</div>' +
        '</div>';
    }).join('');

    html += '<div class="ac-actions" style="display:flex;gap:8px;padding:12px;border-top:1px solid var(--border);background:var(--surface);position:sticky;bottom:-8px;margin:0 -8px -8px -8px;z-index:10;border-radius:0 0 12px 12px">' +
      '<button class="btn btn-ghost btn-sm" style="flex:1" onclick="OrderPage.closeAc()">Hủy</button>' +
      '<button id="btn-add-multi" class="btn btn-primary btn-sm" style="flex:1" onclick="OrderPage.addSelectedProds()">Thêm đã chọn</button>' +
      '</div>';
    list.innerHTML = html;
    list.classList.add('show');
  }

  function selectAcSingle(code) {
    document.getElementById('ac-input').value = code;
    document.getElementById('ac-list').classList.remove('show');
    addProductRow();
  }

  function toggleAcSelect(e, code) {
    if (e && e.target.tagName !== 'INPUT') {
      var chk = document.getElementById('chk-' + code);
      if (chk) chk.checked = !chk.checked;
    }

    var chk = document.getElementById('chk-' + code);
    if (chk) {
      var idx = multiSelectedCodes.indexOf(code);
      if (chk.checked && idx === -1) {
        multiSelectedCodes.push(code);
      } else if (!chk.checked && idx !== -1) {
        multiSelectedCodes.splice(idx, 1);
      }
    }

    document.querySelectorAll('.ac-table-row').forEach(function (row) {
      var cCode = row.querySelector('.chk-code');
      if (cCode) {
        var cVal = cCode.value;
        var numB = document.getElementById('chk-num-' + cVal);
        var pos = multiSelectedCodes.indexOf(cVal);
        if (pos !== -1) {
          cCode.checked = true;
          if (numB) { numB.textContent = (pos + 1); numB.style.display = 'flex'; }
        } else {
          cCode.checked = false;
          if (numB) { numB.style.display = 'none'; }
        }
      }
    });

    _updateMultiAddButton();
  }

  function _updateMultiAddButton() {
    var count = multiSelectedCodes.length;
    var btn = document.getElementById('btn-add-multi');
    if (btn) {
      btn.innerHTML = count > 0 ? ('Thêm ' + count + ' sản phẩm') : 'Thêm đã chọn';
    }
  }

  function closeAc() {
    multiSelectedCodes = [];
    document.getElementById('ac-list').classList.remove('show');
  }

  function addSelectedProds() {
    var codes = multiSelectedCodes;
    if (codes.length === 0) {
      showToast('Vui lòng chọn sản phẩm', false);
      return;
    }
    var added = 0;
    for (var i = codes.length - 1; i >= 0; i--) {
      var code = codes[i];
      var prod = cachedProds[code];
      if (prod && !orderRows.find(function (r) { return r.ten_hang_2 === code; })) {
        var nhomSize = prod.nhom_size || prod.nhom_hang || prod.Nhom_hang || prod.NhomHang || 'Nhóm 1';
        // Map tự động từ CategoryID (nhom_hang) sang NhomSize nếu API thiếu trường nhom_size
        var mapNhom = { 'TL': 'Nhóm 1', 'QA': 'Nhóm 2', 'SKU101': 'Nhóm 1', 'SKU102': 'Nhóm 3' };
        var mappedNhomSize = mapNhom[nhomSize] || mapNhom[nhomSize.toUpperCase()] || 'Nhóm 1';

        var sizes = cachedSizes.filter(function (s) {
          var ns = s.nhom_size || s.Nhom_size || s.NhomSize || s.nhomSize;
          return ns === nhomSize || ns === mappedNhomSize;
        }).sort(function (a, b) { return (a.stt || a.STT || 0) - (b.stt || b.STT || 0); });

        orderRows.unshift({ ten_hang_2: code, product: prod, sizes: sizes, quantities: {} });
        added++;
      }
    }
    if (added > 0) { renderMatrix(); showToast('Đã thêm ' + added + ' sản phẩm'); }
    else { showToast('Sản phẩm đã có trong đơn', false); }
    document.getElementById('ac-input').value = '';
    acSearch('');
    closeAc();
  }

  function addProductRow() {
    var code = document.getElementById('ac-input').value.trim();
    if (!code) { showToast('Vui lòng nhập sản phẩm', false); return; }
    var prod = cachedProds[code];
    if (!prod) { showToast('Không tìm thấy sản phẩm ' + code, false); return; }
    if (orderRows.find(function (r) { return r.ten_hang_2 === code; })) { showToast('Sản phẩm đã có trong đơn', false); return; }
    var nhomSize = prod.nhom_size || prod.nhom_hang || prod.Nhom_hang || prod.NhomHang || 'Nhóm 1';
    var mapNhom = { 'TL': 'Nhóm 1', 'QA': 'Nhóm 2', 'SKU101': 'Nhóm 1', 'SKU102': 'Nhóm 3' };
    var mappedNhomSize = mapNhom[nhomSize] || mapNhom[nhomSize.toUpperCase()] || 'Nhóm 1';

    var sizes = cachedSizes.filter(function (s) {
      var ns = s.nhom_size || s.Nhom_size || s.NhomSize || s.nhomSize;
      return ns === nhomSize || ns === mappedNhomSize;
    }).sort(function (a, b) { return (a.stt || a.STT || 0) - (b.stt || b.STT || 0); });

    orderRows.unshift({ ten_hang_2: code, product: prod, sizes: sizes, quantities: {} });
    document.getElementById('ac-input').value = '';
    acSearch('');
    renderMatrix();
    showToast('Đã thêm ' + code);
  }

  function renderMatrix() {
    var container = document.getElementById('matrix-container');
    if (!orderRows.length) {
      container.innerHTML = '<div class="empty-state" style="background:var(--surface); border-radius:12px; padding:32px; border:1px solid var(--border);"><span class="material-symbols-outlined">table_chart</span><span>Tìm và thêm sản phẩm để bắt đầu nhập số lượng</span></div>';
      _updateTotal(); return;
    }

    container.innerHTML = orderRows.map(function (row, ri) {
      var badgeHtml = '';
      var ctbh = document.getElementById('o-ctbh') ? document.getElementById('o-ctbh').value : '';
      if (ctbh) badgeHtml = '<span class="badge-success"><span class="material-symbols-outlined" style="font-size:12px">check</span> Đã áp CTKM</span>';

      var sizeRowsHtml = '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(72px, 1fr)); gap: 12px; margin-top: 16px;">';
      sizeRowsHtml += row.sizes.map(function (s) {
        var sz = s.size || s.Size || s.ten_size || s.Ten_size || s.TenSize || s.tenSize || '?';
        var qty = row.quantities[sz] || '';
        var isFilled = qty > 0;
        var boxClass = isFilled ? 'size-box filled' : 'size-box';
        return '<div class="' + boxClass + '">' +
          '<div class="size-box-lbl">' + sz + '</div>' +
          '<input type="number" inputmode="numeric" min="0" placeholder="0" value="' + qty + '" oninput="OrderPage.updateQty(' + ri + ',\'' + sz + '\',this)">' +
          '</div>';
      }).join('');
      sizeRowsHtml += '</div>';

      return '<div class="card product-card">' +
        '<div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom:1px solid var(--border-light); padding-bottom:12px; gap:8px;">' +
        '<div style="flex:1; min-width:0;">' +
        '<div style="display:flex; flex-wrap:wrap; align-items:center; gap:6px 8px; margin-bottom:4px;">' +
        '<div style="font-size: 18px; font-weight:800; color:var(--primary); word-break: break-word;">' + row.ten_hang_2 + '</div>' +
        badgeHtml +
        '</div>' +
        '<div style="font-size: 14px; color:var(--muted);">' + (row.product.nhom_size || row.product.nhom_hang || 'TL') + ' | ' + (row.product.mau || 'Không màu') + ' | ' + Utils.formatMoney(row.product.don_gia || 0) + '</div>' +
        '</div>' +
        '<div style="display:flex; gap:8px;">' +
        '<button class="btn-icon" onclick="OrderPage.removeRow(' + ri + ')" title="Xóa sản phẩm" style="color:var(--danger)"><span class="material-symbols-outlined">delete</span></button>' +
        '</div>' +
        '</div>' +
        sizeRowsHtml +
        '</div>';
    }).join('');
    _updateTotal();
  }

  function updateQty(ri, size, inputEl) {
    var val = parseInt(inputEl.value) || 0;
    orderRows[ri].quantities[size] = val;
    if (val > 0) {
      inputEl.parentElement.classList.add('filled');
    } else {
      inputEl.parentElement.classList.remove('filled');
    }
    _updateTotal();
  }


  function removeRow(ri) { orderRows.splice(ri, 1); renderMatrix(); }

  function _updateTotal() {
    var qty = 0, money = 0;
    orderRows.forEach(function (r) { Object.entries(r.quantities).forEach(function (e) { if (e[1] > 0) { qty += e[1]; money += e[1] * r.product.don_gia; } }); });
    document.getElementById('total-qty').textContent = qty;
    document.getElementById('total-money').textContent = Utils.formatMoney(money);
    var oTongTien = document.getElementById('o-tong-tien');
    if (oTongTien) {
      oTongTien.value = Utils.formatMoney(money);
      oTongTien.dataset.value = money;
      calcChange();
    }
  }

  function calcChange() {
    var total = parseInt(document.getElementById('o-tong-tien').dataset.value || 0);
    var givenStr = document.getElementById('o-khach-dua').value;
    var given = givenStr ? parseInt(givenStr) : 0;
    var change = given - total;
    document.getElementById('o-tra-lai').value = Utils.formatMoney(change > 0 ? change : 0);
  }

  function _buildLines() {
    var ma_ctbh = document.getElementById('o-ctbh').value;
    var note = document.getElementById('o-note').value;
    var lines = [];
    orderRows.forEach(function (row) {
      Object.entries(row.quantities).forEach(function (e) {
        var size = e[0], qty = parseInt(e[1]) || 0;
        if (qty > 0) lines.push({
          ten_hang_2: row.ten_hang_2, sku: Utils.buildSKU(row.ten_hang_2, size),
          ten_hang: row.product.ten_hang_hoa, nhom_size: row.product.nhom_size,
          mau: row.product.mau,
          size: parseInt(size), so_luong: qty, don_gia: row.product.don_gia,
          thanh_tien: qty * row.product.don_gia, ma_ctbh: ma_ctbh, ghi_chu: note
        });
      });
    });
    return lines;
  }

  function previewOrder() {
    if (!orderRows.length) { showToast('Vui lòng chọn sản phẩm và nhập số lượng', false); return; }

    // 1. Thu thập tất cả các size có số lượng > 0
    var uniqueSizes = [];
    var sizeMap = {};
    var totalQtyAll = 0;

    orderRows.forEach(function (row) {
      Object.entries(row.quantities).forEach(function (e) {
        var sz = e[0], q = parseInt(e[1]) || 0;
        if (q > 0) {
          totalQtyAll += q;
          if (!sizeMap[sz]) {
            sizeMap[sz] = true;
            uniqueSizes.push(sz);
          }
        }
      });
    });

    if (totalQtyAll === 0) { showToast('Vui lòng nhập số lượng', false); return; }

    // 2. Sắp xếp uniqueSizes theo thứ tự trong cachedSizes
    var allSizeNames = cachedSizes.map(function (s) {
      return s.size || s.Size || s.ten_size || s.Ten_size || s.TenSize || s.tenSize;
    });
    uniqueSizes.sort(function (a, b) {
      var idxA = allSizeNames.indexOf(a);
      var idxB = allSizeNames.indexOf(b);
      return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB);
    });

    // 3. Xây dựng Header
    var headHtml = '<tr><th style="min-width:120px">Sản phẩm</th><th>Màu</th>';
    uniqueSizes.forEach(function (sz) {
      headHtml += '<th style="text-align:center; min-width:40px">' + sz + '</th>';
    });
    headHtml += '<th style="text-align:center">Tổng</th><th style="text-align:right">Thành tiền</th></tr>';

    // 4. Xây dựng Body
    var totalMoneyAll = 0;
    var sizeTotals = {};
    uniqueSizes.forEach(function (sz) { sizeTotals[sz] = 0; });

    var bodyHtml = orderRows.map(function (row) {
      var rowQty = 0;
      var hasQty = false;

      var rowCells = uniqueSizes.map(function (sz) {
        var q = row.quantities[sz] || 0;
        if (q > 0) {
          rowQty += q;
          sizeTotals[sz] += q;
          hasQty = true;
        }
        return '<td style="text-align:center">' + (q > 0 ? '<strong>' + q + '</strong>' : '-') + '</td>';
      }).join('');

      if (!hasQty) return ''; // Bỏ qua sản phẩm không có số lượng

      var rowMoney = rowQty * (row.product.don_gia || 0);
      totalMoneyAll += rowMoney;

      return '<tr>' +
        '<td><div style="font-weight:800; color:var(--primary)">' + row.ten_hang_2 + '</div><div style="font-size:11px; color:var(--muted); white-space:normal">' + row.product.ten_hang_hoa + '</div></td>' +
        '<td><small>' + (row.product.mau || '—') + '</small></td>' +
        rowCells +
        '<td style="text-align:center; background:var(--bg); font-weight:bold">' + rowQty + '</td>' +
        '<td style="text-align:right; font-weight:bold">' + Utils.formatMoney(rowMoney) + '</td>' +
        '</tr>';
    }).join('');

    // 5. Xây dựng Footer
    var footHtml = '<tr style="font-weight:700; background:var(--bg)"><td colspan="2" style="text-align:right">Tổng cộng:</td>';
    uniqueSizes.forEach(function (sz) {
      footHtml += '<td style="text-align:center">' + sizeTotals[sz] + '</td>';
    });
    footHtml += '<td style="text-align:center; color:var(--primary)">' + totalQtyAll + '</td><td style="text-align:right; color:var(--accent)">' + Utils.formatMoney(totalMoneyAll) + '</td></tr>';

    // Cập nhật Modal
    document.getElementById('preview-head').innerHTML = headHtml;
    document.getElementById('preview-body').innerHTML = bodyHtml;
    document.getElementById('preview-foot').innerHTML = footHtml;

    var info = document.getElementById('preview-info');
    info.innerHTML = [
      '<div><strong>Người nhận:</strong> ' + (document.getElementById('o-kh-ten')?.value || '—') + '</div>',
      '<div><strong>Mã KH:</strong> ' + (document.getElementById('o-ma-kh')?.value || '—') + '</div>',
      '<div><strong>Địa chỉ:</strong> ' + (document.getElementById('o-kh-dc')?.value || '—') + '</div>',
    ].join('');

    openModal('modal-preview');
  }

  async function saveOrder() {
    var lines = _buildLines();
    var kh_ten = document.getElementById('o-kh-ten').value.trim();
    var ma_kh = document.getElementById('o-ma-kh').value.trim();
    if (!ma_kh) { showToast('Vui lòng nhập mã khách hàng', false); return; }

    var order = {
      id: Utils.uuid(), // Generate ID
      so_ct: document.getElementById('o-so-ct').value,
      ngay_ct: document.getElementById('o-ngay').value,
      chi_nhanh: _catValues.chi_nhanh.name || _catValues.chi_nhanh.id,
      nvkd: _catValues.nvkd.name || _catValues.nvkd.id,
      nguoi_tao: document.getElementById('o-nguoi-tao').value,
      ma_kh: ma_kh,
      ma_dl: document.getElementById('o-ma-dl').value,
      kh_ten: document.getElementById('o-kh-ten').value.trim(),
      kh_dc: document.getElementById('o-kh-dc').value,
      nguon_don: document.getElementById('o-nguon-don').value,
      dien_giai: document.getElementById('o-dien-giai').value,
      ghi_chu: document.getElementById('o-note').value,
      pt_giao: document.getElementById('o-pt-giao').value,
      nguoi_giao: document.getElementById('o-nguoi-giao').value,
      dieu_khoan: _catValues.dieu_khoan.name || _catValues.dieu_khoan.id,
      ht_thanh_toan: _catValues.ht_tt.name || _catValues.ht_tt.id,
      ngay_tt: document.getElementById('o-ngay-tt').value,
      khach_dua: document.getElementById('o-khach-dua').value,
      ma_ctbh: document.getElementById('o-ctbh').value,
      total_qty: lines.reduce(function (s, l) { return s + l.so_luong; }, 0),
      total_money: lines.reduce(function (s, l) { return s + l.thanh_tien; }, 0),
      lines: lines, created_at: new Date().toISOString()
    };

    if (!API_CONFIG.BASE_URL) {
      showToast('Hệ thống đang chạy offline, không thể lưu đơn.', false);
      return;
    }

    try {
      await OrderService.createOrder(order);
      closeModal('modal-preview');
      showToast('Đã lưu đơn: ' + order.so_ct, true);
      orderRows = []; _init();
    } catch (err) {
      console.warn('[OrderService] Lỗi tạo đơn qua API:', err);
      showToast('Lỗi tạo đơn qua API. Vui lòng thử lại.', false);
    }
  }

  function clearOrder() {
    ConfirmModal.show({
      title: 'Hủy đơn hàng',
      message: 'Bạn có chắc muốn xóa toàn bộ sản phẩm đã chọn?',
      confirmText: 'Xác nhận xóa',
      confirmClass: 'btn-danger',
      onConfirm: function () { orderRows = []; _init(); }
    });
  }

  function clearSearch() {
    var inp = document.getElementById('ac-input');
    if (inp) { inp.value = ''; inp.focus(); acSearch(''); }
  }

  return {
    render: render, acSearch: acSearch, toggleAcSelect: toggleAcSelect, closeAc: closeAc,
    addSelectedProds: addSelectedProds, addProductRow: addProductRow, selectAcSingle: selectAcSingle,
    updateQty: updateQty, removeRow: removeRow, previewOrder: previewOrder,
    saveOrder: saveOrder, clearOrder: clearOrder, clearSearch: clearSearch,
    updateInfoSummary: updateInfoSummary, calcChange: calcChange,
    createNewCustomer: createNewCustomer
  };

  async function createNewCustomer() {
    var form = document.getElementById('form-create-customer');
    if (!form) return;

    var data = {};
    var inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(function(el) {
      if (!el.name) return;
      if (el.type === 'checkbox') {
        data[el.name] = el.checked;
      } else if (el.type === 'number' || el.step) {
        data[el.name] = parseFloat(el.value) || 0;
      } else {
        data[el.name] = el.value.trim();
      }
    });

    if (!data.ObjectID || !data.ObjectName) {
      showToast('Vui lòng nhập Mã và Tên khách hàng', false);
      return;
    }

    try {
      showToast('Đang lưu khách hàng...');
      var res = await CategoryService.saveCustomer(data);
      if (res) {
        showToast('Đã tạo khách hàng: ' + data.ObjectName, true);
        
        // Tự động chọn khách hàng này cho đơn hàng
        document.getElementById('o-ma-kh').value = data.ObjectID;
        document.getElementById('o-kh-ten').value = data.ObjectName;
        document.getElementById('o-kh-dc').value = data.Address || '';
        
        if (_combos.kh) {
           _combos.kh.querySelector('input').value = data.ObjectName;
        }

        closeModal('modal-create-customer');
        updateInfoSummary();
        
        // Clear form
        inputs.forEach(el => { if(el.type==='checkbox') el.checked=false; else el.value=''; });
      }
    } catch (err) {
      showToast('Lỗi khi lưu khách hàng: ' + err.message, false);
    }
  }
})();
