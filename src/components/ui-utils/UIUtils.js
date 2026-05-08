/**
 * Shared UI Utilities for Components
 */
var UIControls = window.UIControls || {};

UIControls.utils = (function() {
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
    dropdownElement.style.position   = 'fixed';
    dropdownElement.style.zIndex     = '10001';
    dropdownElement.style.left       = rect.left + 'px';
    dropdownElement.style.minWidth   = rect.width + 'px';
    dropdownElement.style.transition = 'opacity 0.15s ease, visibility 0.15s ease';

    var isActive = dropdownElement.classList.contains('active');
    if (!isActive) {
      dropdownElement.style.maxHeight  = '300px';
      dropdownElement.style.visibility = 'hidden';
      dropdownElement.classList.add('active');
    }

    var dropHeight = dropdownElement.offsetHeight;
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
  function createDropdownTableHTML(headers, data, colHighlightIndex) {
    var theadHTML = headers.map(function(h) { return '<th>' + h + '</th>'; }).join('');
    var tbodyHTML = data.map(function(row, rIdx) {
      var cells = row.map(function(cell, cIdx) {
        var cls = (cIdx === colHighlightIndex) ? 'highlight-col' : '';
        return '<td class="' + cls + '">' + (cell != null ? cell : '') + '</td>';
      }).join('');
      return '<tr data-index="' + rIdx + '">' + cells + '</tr>';
    }).join('');

    return '<table class="dropdown-table"><thead><tr>' + theadHTML + '</tr></thead><tbody>' + tbodyHTML + '</tbody></table>';
  }

  return {
    computeDropdownPosition: computeDropdownPosition,
    getScrollableAncestors: getScrollableAncestors,
    createDropdownTableHTML: createDropdownTableHTML,
    setupTableSelection: function(tableBody, onSelect) {
      if (!tableBody) return;
      tableBody.addEventListener('click', function(e) {
        var tr = e.target.closest('tr');
        if (!tr) return;
        var isAlreadyActive = tr.classList.contains('active');
        Array.from(tableBody.querySelectorAll('tr')).forEach(function(r) { r.classList.remove('active'); });
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
