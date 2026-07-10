/**
 * Data ComboBox Component
 */
var UIControls = window.UIControls || {};

function stringToColor(str) {
  if (!str) return '#ccc';
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  var h = Math.abs(hash % 360);
  return 'hsl(' + h + ', 70%, 55%)';
}

UIControls.createDataComboBox = function (options) {
  var container = document.createElement('div');
  container.className = 'combo-box-container';

  // Input
  var input = document.createElement('input');
  input.type = 'text';
  input.className = 'ui-input';
  input.placeholder = options.placeholder || '';
  if (options.id) input.id = options.id;

  if (options.readOnly) {
    input.readOnly = true;
    input.style.cursor = 'pointer';
    input.addEventListener('click', function (e) {
      e.stopPropagation();
      dropdown.classList.contains('active') ? hideDropdown() : showDropdown();
    });
  }

  // Swatch màu sắc cho trường Màu sắc
  var swatch = null;
  if (options.id && options.id.includes('MauSac')) {
    swatch = document.createElement('div');
    swatch.className = 'combo-color-swatch';
    swatch.style.cssText = 'position: absolute; left: 12px; top: 50%; transform: translateY(-50%); width: 14px; height: 14px; border-radius: 50%; border: 1px solid rgba(0,0,0,0.15); pointer-events: none; background-color: transparent; display: none; transition: all 0.2s;';
    input.style.paddingLeft = '34px'; // Nhường chỗ cho ô tròn hiển thị màu
    container.style.position = 'relative';
    container.appendChild(swatch);
  }

  function updateSwatchColor(val) {
    if (!swatch) return;
    var cleaned = val ? val.trim() : '';
    if (cleaned && !cleaned.startsWith('-- Chọn')) {
      swatch.style.backgroundColor = stringToColor(cleaned);
      swatch.style.display = 'block';
    } else {
      swatch.style.display = 'none';
    }
  }

  // Ghi đè Property Descriptor của input.value để cập nhật màu sắc lập tức khi gán bằng JS
  if (swatch) {
    var nativeValueDesc = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
    Object.defineProperty(input, 'value', {
      get: function() {
        return nativeValueDesc.get.call(input);
      },
      set: function(val) {
        nativeValueDesc.set.call(input, val);
        updateSwatchColor(val);
      }
    });
  }

  // Actions block – chỉ giữ nút mũi tên
  var actions = document.createElement('div');
  actions.className = 'combo-box-actions';

  var btnArrow = document.createElement('button');
  btnArrow.className = 'combo-action-btn';
  btnArrow.innerHTML = '<span class="material-symbols-outlined">arrow_drop_down</span>';
  btnArrow.title = 'Mở danh sách (F4)';
  btnArrow.type = 'button';

  actions.appendChild(btnArrow);

  // ── Dropdown Panel ──────────────────────────────────────────────
  var dropdown = document.createElement('div');
  dropdown.className = 'data-dropdown-menu';

  // Search bar bên trong dropdown
  var searchWrapper = document.createElement('div');
  searchWrapper.className = 'dd-search-wrapper';

  var searchIcon = document.createElement('span');
  searchIcon.className = 'material-symbols-outlined dd-search-icon';
  searchIcon.textContent = 'search';

  var searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.className = 'dd-search-input';
  searchInput.placeholder = 'Tìm kiếm...';

  searchWrapper.appendChild(searchIcon);
  searchWrapper.appendChild(searchInput);

  // Table wrapper (scrollable)
  var tableWrapper = document.createElement('div');
  tableWrapper.className = 'dd-table-wrapper';

  // Footer "+ Thêm mới" & Phân trang
  var footer = document.createElement('div');
  footer.className = 'dd-footer';
  footer.style.display = 'flex';
  footer.style.justifyContent = 'space-between';
  footer.style.alignItems = 'center';
  footer.style.width = '100%';

  var btnAddNew = document.createElement('button');
  btnAddNew.type = 'button';
  btnAddNew.className = 'dd-footer-add-btn';
  btnAddNew.innerHTML = '<span class="material-symbols-outlined">add</span> Thêm mới';
  
  // Mặc định là ẩn, chỉ hiện khi có yêu cầu từ options
  btnAddNew.style.display = options.showAddNew ? 'flex' : 'none';

  btnAddNew.addEventListener('click', function (e) {
    e.stopPropagation();
    hideDropdown();
    if (typeof options.onF2 === 'function') {
      options.onF2();
    }
  });

  var leftFooter = document.createElement('div');
  leftFooter.appendChild(btnAddNew);

  // Pagination Elements
  var currentPage = 1;
  var currentQuery = '';
  
  var paginationWrapper = document.createElement('div');
  paginationWrapper.className = 'dd-pagination';
  paginationWrapper.style.display = 'none';
  paginationWrapper.style.gap = '12px';
  paginationWrapper.style.alignItems = 'center';
  paginationWrapper.style.padding = '2px 8px';

  var btnPrev = document.createElement('button');
  btnPrev.type = 'button';
  btnPrev.className = 'btn-icon-sm';
  btnPrev.innerHTML = '<span class="material-symbols-outlined" style="font-size:18px;">chevron_left</span>';
  btnPrev.style.cssText = 'border:1px solid var(--border); background:var(--surface); cursor:pointer; border-radius:6px; display:flex; align-items:center; justify-content:center; width:28px; height:28px; color:var(--muted); transition:all 0.2s;';

  var lblPage = document.createElement('span');
  lblPage.textContent = 'Trang 1';
  lblPage.style.cssText = 'font-size:13px; font-weight:600; color:var(--text); min-width:60px; text-align:center;';

  var btnNext = document.createElement('button');
  btnNext.type = 'button';
  btnNext.className = 'btn-icon-sm';
  btnNext.innerHTML = '<span class="material-symbols-outlined" style="font-size:18px;">chevron_right</span>';
  btnNext.style.cssText = 'border:1px solid var(--border); background:var(--surface); cursor:pointer; border-radius:6px; display:flex; align-items:center; justify-content:center; width:28px; height:28px; color:var(--muted); transition:all 0.2s;';

  // Hover effects
  [btnPrev, btnNext].forEach(function(btn) {
    btn.onmouseover = function() { this.style.borderColor = 'var(--primary)'; this.style.color = 'var(--primary)'; this.style.background = 'rgba(251, 191, 36, 0.05)'; };
    btn.onmouseout = function() { this.style.borderColor = 'var(--border)'; this.style.color = 'var(--muted)'; this.style.background = 'var(--surface)'; };
  });

  btnPrev.addEventListener('click', function(e) {
    e.stopPropagation();
    if (currentPage > 1) {
      currentPage--;
      loadData(currentQuery, currentPage);
    }
  });

  btnNext.addEventListener('click', function(e) {
    e.stopPropagation();
    currentPage++;
    loadData(currentQuery, currentPage);
  });

  paginationWrapper.appendChild(btnPrev);
  paginationWrapper.appendChild(lblPage);
  paginationWrapper.appendChild(btnNext);

  footer.appendChild(leftFooter);
  footer.appendChild(paginationWrapper);

  dropdown.appendChild(searchWrapper);
  dropdown.appendChild(tableWrapper);
  dropdown.appendChild(footer);

  // ── Data & Render ───────────────────────────────────────────────
  var fullData = options.data || [];
  var cachedInitialResults = null;

  function renderTable(displayData) {
    if (UIControls.utils) {
      tableWrapper.innerHTML = UIControls.utils.createDropdownTableHTML(
        options.headers || [], displayData, options.colHighlightIndex || 0, options.colGroupIndex
      );
      var rows = tableWrapper.querySelectorAll('tbody tr.data-row');
      var currentInputVal = input.value.trim().toLowerCase();

      rows.forEach(function (row) {
        var dataRow = displayData[row.getAttribute('data-index')];
        var cellVal = dataRow[options.colFilterIndex || 0];
        
        // Nếu là ô chọn màu sắc, chèn thêm chấm màu bên cạnh chữ
        if (options.id && options.id.includes('MauSac') && cellVal) {
          var firstTd = row.querySelector('td');
          if (firstTd) {
            var colorDot = '<span style="display:inline-block; width:10px; height:10px; border-radius:50%; margin-right:8px; vertical-align:middle; border:1px solid rgba(0,0,0,0.15); background-color:' + stringToColor(cellVal) + ';"></span>';
            firstTd.innerHTML = colorDot + firstTd.innerHTML;
          }
        }

        var rowVal = (cellVal || '').toString().toLowerCase();

        if (currentInputVal && rowVal === currentInputVal) {
          row.classList.add('active');
        }

        row.addEventListener('click', function () {
          input.value = dataRow[options.colFilterIndex || 0];
          hideDropdown();
          if (typeof options.onSelect === 'function') {
            options.onSelect(dataRow);
          }
        });
      });
    }
  }

  // ── Scroll listeners trên đúng container đang scroll ───────────
  var _scrollTargets = [];
  var _scrollHandler = null;

  function attachScrollListeners() {
    if (_scrollHandler) return;
    _scrollHandler = function () {
      if (UIControls.utils) {
        UIControls.utils.computeDropdownPosition(container, dropdown);
      }
    };
    _scrollTargets = UIControls.utils
      ? UIControls.utils.getScrollableAncestors(container)
      : [window];
    _scrollTargets.forEach(function (target) {
      target.addEventListener('scroll', _scrollHandler, { passive: true, capture: false });
    });
    window.addEventListener('resize', _scrollHandler, { passive: true });
  }

  function detachScrollListeners() {
    if (!_scrollHandler) return;
    _scrollTargets.forEach(function (target) {
      target.removeEventListener('scroll', _scrollHandler, { capture: false });
    });
    window.removeEventListener('resize', _scrollHandler);
    _scrollHandler = null;
    _scrollTargets = [];
  }

  function loadData(q, page) {
    currentQuery = q;
    currentPage = page;
    if (typeof options.onSearch === 'function') {
      if (q === '' && page === 1 && cachedInitialResults) {
        fullData = cachedInitialResults;
        renderTable(fullData);
        if (options.enablePagination) {
          paginationWrapper.style.display = 'flex';
          lblPage.textContent = 'Trang 1 (' + fullData.length + ')';
          btnPrev.disabled = true;
          btnPrev.style.opacity = '0.5';
          btnNext.disabled = (fullData.length < 200);
          btnNext.style.opacity = (fullData.length < 200) ? '0.5' : '1';
        }
        if (UIControls.utils) {
          UIControls.utils.computeDropdownPosition(container, dropdown);
        }
        return;
      }

      var hasTable = tableWrapper.querySelector('table');
      if (hasTable) {
        var overlay = tableWrapper.querySelector('.dd-loading-overlay');
        if (!overlay) {
          overlay = document.createElement('div');
          overlay.className = 'dd-loading-overlay';
          overlay.innerHTML = '<span class="material-symbols-outlined spinner-icon">sync</span><span>Đang tải...</span>';
          tableWrapper.style.position = 'relative';
          tableWrapper.appendChild(overlay);
        } else {
          overlay.querySelector('span:not(.spinner-icon)').textContent = 'Đang tải...';
        }
      } else {
        tableWrapper.style.minHeight = '180px';
        tableWrapper.innerHTML = '<div style="padding:12px;text-align:center;color:var(--muted,#94a3b8);font-size:13px">Đang tải...</div>';
      }

      Promise.resolve(options.onSearch(q, page)).then(function (result) {
        var overlay = tableWrapper.querySelector('.dd-loading-overlay');
        if (overlay) overlay.remove();
        tableWrapper.style.minHeight = '';

        if (Array.isArray(result)) {
          if (q === '' && page === 1) {
            cachedInitialResults = result;
          }
          fullData = result;
          renderTable(fullData);
          if (options.enablePagination) {
            paginationWrapper.style.display = 'flex';
            lblPage.textContent = 'Trang ' + page + ' (' + result.length + ')';
            btnPrev.disabled = (page <= 1);
            btnPrev.style.opacity = (page <= 1) ? '0.5' : '1';
            btnNext.disabled = (result.length < 200);
            btnNext.style.opacity = (result.length < 200) ? '0.5' : '1';
          }
          if (UIControls.utils) {
            UIControls.utils.computeDropdownPosition(container, dropdown);
          }
        }
      }).catch(function () {
        var overlay = tableWrapper.querySelector('.dd-loading-overlay');
        if (overlay) overlay.remove();
        tableWrapper.style.minHeight = '';
        tableWrapper.innerHTML = '<div style="padding:12px;text-align:center;color:#ef4444;font-size:13px">Lỗi tải dữ liệu</div>';
      });
    } else {
      var lval = q.toLowerCase();
      var filtered = lval ? fullData.filter(function (row) {
        return (row[options.colFilterIndex || 0] || '').toString().toLowerCase().includes(lval);
      }) : fullData;
      renderTable(filtered);
      if (UIControls.utils) {
        UIControls.utils.computeDropdownPosition(container, dropdown);
      }
    }
  }

  function showDropdown() {
    // Đóng các dropdown khác trước khi mở
    document.dispatchEvent(new CustomEvent('close-other-comboboxes', { detail: dropdown }));

    if (dropdown.parentNode !== document.body) {
      document.body.appendChild(dropdown);
    }
    searchInput.value = '';

    loadData('', 1);

    if (UIControls.utils) {
      UIControls.utils.computeDropdownPosition(container, dropdown);
    }
    dropdown.classList.add('active');
    attachScrollListeners();
    setTimeout(function () { 
      if (document.activeElement !== input) {
        searchInput.focus(); 
      }
    }, 50);
  }

  function hideDropdown() {
    detachScrollListeners();
    dropdown.classList.remove('active');
    if (dropdown.parentNode) dropdown.parentNode.removeChild(dropdown);
  }

  // ── Search bên trong dropdown ───────────────────────────────────
  var _searchDebounce = null;

  searchInput.addEventListener('input', function () {
    var val = searchInput.value;

    if (typeof options.onSearch === 'function') {
      clearTimeout(_searchDebounce);
      
      var hasTable = tableWrapper.querySelector('table');
      if (hasTable) {
        var overlay = tableWrapper.querySelector('.dd-loading-overlay');
        if (!overlay) {
          overlay = document.createElement('div');
          overlay.className = 'dd-loading-overlay';
          overlay.innerHTML = '<span class="material-symbols-outlined spinner-icon">sync</span><span>Đang tìm...</span>';
          tableWrapper.style.position = 'relative';
          tableWrapper.appendChild(overlay);
        } else {
          overlay.querySelector('span:not(.spinner-icon)').textContent = 'Đang tìm...';
        }
      } else {
        tableWrapper.style.minHeight = '180px';
        tableWrapper.innerHTML = '<div style="padding:12px;text-align:center;color:var(--muted,#94a3b8);font-size:13px">Đang tìm...</div>';
      }

      _searchDebounce = setTimeout(function () {
        loadData(val, 1);
      }, 300);
    } else {
      // Client-side: filter local fullData
      var lval = val.toLowerCase();
      if (!lval) { renderTable(fullData); return; }
      var filtered = fullData.filter(function (row) {
        return (row[options.colFilterIndex || 0] || '').toString().toLowerCase().includes(lval);
      });
      renderTable(filtered);
    }
  });

  searchInput.addEventListener('click', function (e) { e.stopPropagation(); });

  searchInput.addEventListener('keydown', function (e) {
    if (e.key === 'F2') {
      e.preventDefault();
      hideDropdown();
      if (typeof options.onF2 === 'function') {
        options.onF2();
      }
    }
  });

  // ── Events ──────────────────────────────────────────────────────
  btnArrow.addEventListener('click', function (e) {
    e.preventDefault();
    dropdown.classList.contains('active') ? hideDropdown() : showDropdown();
  });

  input.addEventListener('input', function (e) {
    var val = e.target.value;
    if (typeof options.onChange === 'function') {
      options.onChange(val);
    }

    if (!options.hideDropdownOnInput && !dropdown.classList.contains('active')) {
      showDropdown();
    }
    // Ghi chú: Đã bỏ logic filter và onSearch ở đây theo yêu cầu của user. 
    // Chỉ ô tìm kiếm bên trong dropdown (searchInput) mới thực hiện filter.
  });

  input.addEventListener('keydown', function (e) {
    if (e.key === 'F2') {
      e.preventDefault();
      hideDropdown();
      if (typeof options.onF2 === 'function') {
        options.onF2();
      }
    }
  });

  function _onDocClick(e) {
    if (!document.body.contains(container)) {
      _cleanupListeners();
      return;
    }
    if (!container.contains(e.target) && !dropdown.contains(e.target)) hideDropdown();
  }

  function _onCloseOthers(e) {
    if (!document.body.contains(container)) {
      _cleanupListeners();
      return;
    }
    if (e.detail !== dropdown) hideDropdown();
  }

  function _cleanupListeners() {
    document.removeEventListener('click', _onDocClick);
    document.removeEventListener('close-other-comboboxes', _onCloseOthers);
    hideDropdown();
  }

  document.addEventListener('click', _onDocClick);
  document.addEventListener('close-other-comboboxes', _onCloseOthers);


  input.addEventListener('blur', function () {
    var val = input.value.trim().toLowerCase();
    if (val && fullData.length > 0) {
      var exactMatch = fullData.find(function (row) {
        return (row[options.colFilterIndex || 0] || '').toString().toLowerCase() === val;
      });
      if (exactMatch) {
        input.value = exactMatch[options.colFilterIndex || 0];
        if (typeof options.onSelect === 'function') {
          options.onSelect(exactMatch);
        }
      }
    }
  });

  input.addEventListener('kb:open', function () { dropdown.classList.contains('active') ? hideDropdown() : showDropdown(); });
  input.addEventListener('kb:new', function () { if (options.onF2) options.onF2(); });
  input.addEventListener('kb:close', function () { hideDropdown(); });

  container.appendChild(input);
  container.appendChild(actions);

  container.clearCache = function () {
    cachedInitialResults = null;
  };

  // Xóa cache VÀ reload lại ngay nếu dropdown đang mở
  // Dùng khi NPP thay đổi → danh sách đại lý phải làm mới theo NPP mới
  container.reload = function () {
    cachedInitialResults = null;
    if (dropdown.classList.contains('active')) {
      searchInput.value = '';
      loadData('', 1);
    }
  };

  return container;
};
