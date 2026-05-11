/**
 * Shared UI Utilities for Components
 */
var UIControls = window.UIControls || {};

UIControls.utils = (function () {
  /**
   * Tính toán vị trí Dropdown thông minh (Tránh tràn màn hình, tránh navbar)
   */
  function computeDropdownPosition(inputElement, dropdownElement) {
    var rect = inputElement.getBoundingClientRect();

    // Navbar/header: giới hạn top khi mở lên trên
    var navbarBottom = 0;
    var navbar = document.querySelector('.app-navbar, .navbar, header, .top-bar');
    if (navbar) navbarBottom = navbar.getBoundingClientRect().bottom;

    // position:fixed — tọa độ viewport, không bị ảnh hưởng bởi overflow:hidden
    dropdownElement.style.position = 'fixed';
    dropdownElement.style.zIndex = '1000';
    dropdownElement.style.transition = 'opacity 0.15s ease, visibility 0.15s ease';
    dropdownElement.style.minWidth = rect.width + 'px';
    dropdownElement.style.maxWidth = Math.max(rect.width, window.innerWidth > 600 ? 600 : window.innerWidth - 20) + 'px';

    var isActive = dropdownElement.classList.contains('active');
    if (!isActive) {
      dropdownElement.style.maxHeight = '300px';
      dropdownElement.style.visibility = 'hidden';
      dropdownElement.classList.add('active');
    }

    var dropWidth = dropdownElement.offsetWidth;
    var dropHeight = dropdownElement.offsetHeight;

    // --- Tính toán Left ---
    var leftPos = rect.left;
    if (leftPos + dropWidth > window.innerWidth - 10) {
      // Nếu tràn phải -> Căn lề phải với input
      leftPos = rect.right - dropWidth;
    }
    // Đảm bảo không tràn trái
    leftPos = Math.max(10, leftPos);
    dropdownElement.style.left = leftPos + 'px';

    // --- Tính toán Top ---
    var spaceBelow = window.innerHeight - rect.bottom;
    var spaceAbove = rect.top - navbarBottom;

    if (spaceBelow < dropHeight && spaceAbove > spaceBelow) {
      if (spaceAbove < dropHeight) {
        dropdownElement.style.maxHeight = (spaceAbove - 4) + 'px';
        dropHeight = dropdownElement.offsetHeight;
      }
      var topPos = Math.max(rect.top - dropHeight, navbarBottom + 4);
      dropdownElement.style.top = topPos + 'px';
    } else {
      if (spaceBelow < dropHeight) {
        dropdownElement.style.maxHeight = (spaceBelow - 4) + 'px';
      }
      dropdownElement.style.top = rect.bottom + 'px';
    }

    if (!isActive) {
      dropdownElement.classList.remove('active');
      dropdownElement.style.visibility = '';
    }
  }

  /**
   * Tìm tất cả scrollable ancestors từ một element
   */
  function getScrollableAncestors(el) {
    var ancestors = [];
    var node = el.parentElement;
    while (node && node !== document.documentElement) {
      var style = window.getComputedStyle(node);
      var ov = style.overflow + style.overflowY + style.overflowX;
      if (/auto|scroll/.test(ov)) {
        ancestors.push(node);
      }
      node = node.parentElement;
    }
    ancestors.push(window);
    return ancestors;
  }

  /**
   * Sinh HTML cho Dropdown Table List
   */
  function createDropdownTableHTML(headers, data, colHighlightIndex, colGroupIndex) {
    var theadHTML = headers.map(function(h) { return '<th>' + h + '</th>'; }).join('');
    var tbodyHTML = '';

    if (colGroupIndex !== undefined && colGroupIndex >= 0) {
      var groups = {};
      data.forEach(function(row, rIdx) {
        var g = row[colGroupIndex] || 'Khác';
        if (!groups[g]) groups[g] = [];
        groups[g].push({ row: row, index: rIdx });
      });
      
      var colSpan = headers.length;
      Object.keys(groups).sort().forEach(function(g) {
         var items = groups[g];
         tbodyHTML += '<tr class="group-header" style="color:#0f172a; font-weight:700; cursor:default; border-top:1px solid #e2e8f0; border-bottom:1px solid #e2e8f0;"><td colspan="' + colSpan + '" style="padding: 6px 10px; background:#f1f5f9 !important;">' + g + ' (' + items.length + ')</td></tr>';
         items.forEach(function(item) {
            var row = item.row;
            var rIdx = item.index;
            var cells = headers.map(function(_, cIdx) {
              var cell = row[cIdx];
              var cls = (cIdx === colHighlightIndex) ? 'highlight-col' : '';
              return '<td class="' + cls + '">' + (cell != null ? cell : '') + '</td>';
            }).join('');
            tbodyHTML += '<tr data-index="' + rIdx + '" class="data-row">' + cells + '</tr>';
         });
      });
    } else {
      tbodyHTML = data.map(function(row, rIdx) {
        var cells = headers.map(function(_, cIdx) {
          var cell = row[cIdx];
          var cls = (cIdx === colHighlightIndex) ? 'highlight-col' : '';
          return '<td class="' + cls + '">' + (cell != null ? cell : '') + '</td>';
        }).join('');
        return '<tr data-index="' + rIdx + '" class="data-row">' + cells + '</tr>';
      }).join('');
    }

    return '<table class="dropdown-table"><thead><tr>' + theadHTML + '</tr></thead><tbody>' + tbodyHTML + '</tbody></table>';
  }

  return {
    computeDropdownPosition: computeDropdownPosition,
    getScrollableAncestors: getScrollableAncestors,
    createDropdownTableHTML: createDropdownTableHTML,
    setupTableSelection: function (tableBody, onSelect) {
      if (!tableBody) return;
      tableBody.addEventListener('click', function (e) {
        var tr = e.target.closest('tr');
        if (!tr) return;
        var isAlreadyActive = tr.classList.contains('active');
        Array.from(tableBody.querySelectorAll('tr')).forEach(function (r) { r.classList.remove('active'); });
        if (!isAlreadyActive) {
          tr.classList.add('active');
          if (typeof onSelect === 'function') onSelect(tr);
        } else {
          if (typeof onSelect === 'function') onSelect(null);
        }
      });
    }
  };
})();
