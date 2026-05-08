/**
 * Data ComboBox Component
 */
var UIControls = window.UIControls || {};

UIControls.createDataComboBox = function(options) {
  var container = document.createElement('div');
  container.className = 'combo-box-container';

  // Input
  var input = document.createElement('input');
  input.type = 'text';
  input.className = 'ui-input';
  input.placeholder = options.placeholder || '';
  if (options.id) input.id = options.id;

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

  // Footer "+ Thêm mới"
  var footer = document.createElement('div');
  footer.className = 'dd-footer';

  var btnAddNew = document.createElement('button');
  btnAddNew.type = 'button';
  btnAddNew.className = 'dd-footer-add-btn';
  btnAddNew.innerHTML = '<span class="material-symbols-outlined">add</span> Thêm mới';

  btnAddNew.addEventListener('click', function(e) {
    e.stopPropagation();
    hideDropdown();
    if (typeof options.onF2 === 'function') options.onF2();
  });

  footer.appendChild(btnAddNew);

  dropdown.appendChild(searchWrapper);
  dropdown.appendChild(tableWrapper);
  dropdown.appendChild(footer);

  // ── Data & Render ───────────────────────────────────────────────
  var fullData = options.data || [];

  function renderTable(displayData) {
    if (UIControls.utils) {
      tableWrapper.innerHTML = UIControls.utils.createDropdownTableHTML(
        options.headers || [], displayData, options.colHighlightIndex || 0
      );
      var rows = tableWrapper.querySelectorAll('tbody tr');
      rows.forEach(function(row) {
        row.addEventListener('click', function() {
          var dataRow = displayData[row.getAttribute('data-index')];
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
    _scrollHandler = function() {
      if (UIControls.utils) {
        UIControls.utils.computeDropdownPosition(container, dropdown);
      }
    };
    _scrollTargets = UIControls.utils
      ? UIControls.utils.getScrollableAncestors(container)
      : [window];
    _scrollTargets.forEach(function(target) {
      target.addEventListener('scroll', _scrollHandler, { passive: true, capture: false });
    });
    window.addEventListener('resize', _scrollHandler, { passive: true });
  }

  function detachScrollListeners() {
    if (!_scrollHandler) return;
    _scrollTargets.forEach(function(target) {
      target.removeEventListener('scroll', _scrollHandler, { capture: false });
    });
    window.removeEventListener('resize', _scrollHandler);
    _scrollHandler = null;
    _scrollTargets = [];
  }

  function showDropdown() {
    if (dropdown.parentNode !== document.body) {
      document.body.appendChild(dropdown);
    }
    renderTable(fullData);
    searchInput.value = '';
    if (UIControls.utils) {
      UIControls.utils.computeDropdownPosition(container, dropdown);
    }
    dropdown.classList.add('active');
    attachScrollListeners();
    setTimeout(function() { searchInput.focus(); }, 50);
  }

  function hideDropdown() {
    detachScrollListeners();
    dropdown.classList.remove('active');
    if (dropdown.parentNode) dropdown.parentNode.removeChild(dropdown);
  }

  // ── Search bên trong dropdown ───────────────────────────────────
  var _searchDebounce = null;

  searchInput.addEventListener('input', function() {
    var val = searchInput.value;

    if (typeof options.onSearch === 'function') {
      // Server-side: debounce 300ms rồi gọi API
      clearTimeout(_searchDebounce);
      tableWrapper.innerHTML = '<div style="padding:12px;text-align:center;color:var(--muted,#94a3b8);font-size:13px">Đang tìm...</div>';
      _searchDebounce = setTimeout(function() {
        Promise.resolve(options.onSearch(val)).then(function(result) {
          if (Array.isArray(result)) {
            fullData = result;
            renderTable(fullData);
          }
        }).catch(function() {
          tableWrapper.innerHTML = '<div style="padding:12px;text-align:center;color:#ef4444;font-size:13px">Lỗi tìm kiếm</div>';
        });
      }, 300);
    } else {
      // Client-side: filter local fullData
      var lval = val.toLowerCase();
      if (!lval) { renderTable(fullData); return; }
      var filtered = fullData.filter(function(row) {
        return (row[options.colFilterIndex || 0] || '').toString().toLowerCase().includes(lval);
      });
      renderTable(filtered);
    }
  });

  searchInput.addEventListener('click', function(e) { e.stopPropagation(); });

  // ── Events ──────────────────────────────────────────────────────
  btnArrow.addEventListener('click', function(e) {
    e.preventDefault();
    dropdown.classList.contains('active') ? hideDropdown() : showDropdown();
  });

  input.addEventListener('input', function(e) {
    var val = e.target.value;
    if (!dropdown.classList.contains('active')) showDropdown();

    if (typeof options.onSearch === 'function') {
      // Server-side: debounce giống searchInput
      clearTimeout(_searchDebounce);
      tableWrapper.innerHTML = '<div style="padding:12px;text-align:center;color:var(--muted,#94a3b8);font-size:13px">Đang tìm...</div>';
      _searchDebounce = setTimeout(function() {
        Promise.resolve(options.onSearch(val)).then(function(result) {
          if (Array.isArray(result)) { fullData = result; renderTable(fullData); }
        }).catch(function() {
          tableWrapper.innerHTML = '<div style="padding:12px;text-align:center;color:#ef4444;font-size:13px">Lỗi tìm kiếm</div>';
        });
      }, 300);
    } else {
      // Client-side fallback
      var lval = val.toLowerCase();
      var filtered = fullData.filter(function(row) {
        return (row[options.colFilterIndex || 0] || '').toString().toLowerCase().includes(lval);
      });
      renderTable(filtered);
    }
  });

  document.addEventListener('click', function(e) {
    if (!container.contains(e.target) && !dropdown.contains(e.target)) hideDropdown();
  });

  input.addEventListener('kb:open',   function() { dropdown.classList.contains('active') ? hideDropdown() : showDropdown(); });
  input.addEventListener('kb:new',    function() { if (options.onF2) options.onF2(); });
  input.addEventListener('kb:close',  function() { hideDropdown(); });

  container.appendChild(input);
  container.appendChild(actions);

  return container;
};
