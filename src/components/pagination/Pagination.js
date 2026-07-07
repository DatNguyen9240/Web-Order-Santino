/**
 * Pagination Component
 * Trình phân trang cho DataGrid
 */
var Pagination = (function () {
  /**
   * Tạo component phân trang
   * @param {Object} options - { totalItems, itemsPerPage, currentPage, onPageChange }
   * @returns {HTMLElement} wrapper
   */
  function create(options) {
    var wrapper = document.createElement('div');
    wrapper.className = 'pagination-wrapper';

    var totalPages = Math.ceil(options.totalItems / (options.itemsPerPage || 10));
    var currentPage = options.currentPage || 1;

    var startItem = (currentPage - 1) * options.itemsPerPage + 1;
    var endItem = Math.min(currentPage * options.itemsPerPage, options.totalItems);
    if (options.totalItems === 0) { startItem = 0; endItem = 0; }

    var info = document.createElement('div');
    info.className = 'pagination-info';
    var infoTemplate = (typeof t !== 'undefined') ? t('pager.info') : 'Hiển thị {0} - {1} trong số {2} bản ghi';
    info.innerText = infoTemplate
      .replace('{0}', startItem)
      .replace('{1}', endItem)
      .replace('{2}', options.totalItems);

    var controls = document.createElement('div');
    controls.className = 'pagination-controls';

    // First Button
    var btnFirst = document.createElement('button');
    btnFirst.className = 'page-btn pager-btn-first';
    btnFirst.innerHTML = '<span class="material-symbols-outlined">first_page</span>';
    btnFirst.disabled = currentPage === 1;
    btnFirst.onclick = function () {
      if (typeof options.onPageChange === 'function') options.onPageChange(1);
    };
    controls.appendChild(btnFirst);

    // Prev Button
    var btnPrev = document.createElement('button');
    btnPrev.className = 'page-btn';
    btnPrev.innerHTML = '<span class="material-symbols-outlined">chevron_left</span>';
    btnPrev.disabled = currentPage === 1;
    btnPrev.onclick = function () {
      if (typeof options.onPageChange === 'function') options.onPageChange(currentPage - 1);
    };
    controls.appendChild(btnPrev);

    // Page numbers logic with ellipsis (...)
    var pageList = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pageList.push(i);
      }
    } else {
      if (currentPage <= 4) {
        pageList = [1, 2, 3, 4, 5, '...', totalPages];
      } else if (currentPage >= totalPages - 3) {
        pageList = [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
      } else {
        pageList = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
      }
    }

    pageList.forEach(function (item) {
      if (item === '...') {
        let span = document.createElement('span');
        span.className = 'page-ellipsis';
        span.innerText = '...';
        span.style.padding = '0 8px';
        span.style.color = 'var(--muted, #6b7280)';
        span.style.display = 'flex';
        span.style.alignItems = 'center';
        span.style.fontSize = '14px';
        controls.appendChild(span);
      } else {
        let pBtn = document.createElement('button');
        pBtn.className = 'page-btn pager-number-btn' + (item === currentPage ? ' active' : '');
        pBtn.innerText = item;
        pBtn.onclick = function () {
          if (typeof options.onPageChange === 'function' && item !== currentPage) {
            options.onPageChange(item);
          }
        };
        controls.appendChild(pBtn);
      }
    });

    // Mobile Page Indicator
    var mobileIndicator = document.createElement('span');
    mobileIndicator.className = 'pager-mobile-indicator';
    var pageLabel = (typeof t !== 'undefined') ? t('pager.page') : 'Trang';
    mobileIndicator.innerText = `${pageLabel} ${currentPage} / ${totalPages}`;
    controls.appendChild(mobileIndicator);

    // Next Button
    var btnNext = document.createElement('button');
    btnNext.className = 'page-btn';
    btnNext.innerHTML = '<span class="material-symbols-outlined">chevron_right</span>';
    btnNext.disabled = currentPage === totalPages || totalPages === 0;
    btnNext.onclick = function () {
      if (typeof options.onPageChange === 'function') options.onPageChange(currentPage + 1);
    };
    controls.appendChild(btnNext);

    // Last Button
    var btnLast = document.createElement('button');
    btnLast.className = 'page-btn pager-btn-last';
    btnLast.innerHTML = '<span class="material-symbols-outlined">last_page</span>';
    btnLast.disabled = currentPage === totalPages || totalPages === 0;
    btnLast.onclick = function () {
      if (typeof options.onPageChange === 'function') options.onPageChange(totalPages);
    };
    controls.appendChild(btnLast);

    wrapper.appendChild(info);
    wrapper.appendChild(controls);

    return wrapper;
  }

  return {
    create: create
  };
})();
