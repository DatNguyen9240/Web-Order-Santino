var DynamicPage = (function () {
  var currentRoute = '';
  var formName = '';
  var primaryKey = 'id';
  var apiSearch = '';
  var apiSave = '';
  var apiDelete = '';
  var schemaFields = [];
  var allData = [];
  var filteredData = [];
  var currentPage = 1;
  var itemsPerPage = 20;
  var gridApi = null;
  var searchVal = '';
  var copySourceData = null;

  function render($el, route) {
    gridApi = null;
    allData = [];
    filteredData = [];
    currentPage = 1;
    searchVal = '';
    schemaFields = [];

    currentRoute = route ? route.path : '';
    formName = route ? route.formName : '';

    $el.classList.add('is-full-width');

    if (!formName) {
      $el.innerHTML = '<div class="empty-state"><p>Không tìm thấy FormName được truyền từ Router cho đường dẫn: ' + currentRoute + '</p></div>';
      return Promise.resolve();
    }

    return Router.fetchTemplate('src/pages/dynamic/dynamic.html').then(async function (html) {
      $el.innerHTML = html;

      if (window.LoadingSpinner) LoadingSpinner.show('Đang tải cấu hình...');

      try {
        // 1. Gọi API lấy cấu hình trường (metadata) từ bảng WA_FormatFields và WA_FrmLstTbl trong SQL
        var resConfig = await Http.post('/API_LayCacTruongGiaoDien', { FormName: formName });
        var rawFields = resConfig.records || resConfig.list || resConfig || [];
        schemaFields = rawFields.map(function(f) {
          f.required = (f.required === true || f.required === 1 || String(f.required) === '1' || String(f.required) === 'true');
          f.showInAdd = !(f.showInAdd === false || f.showInAdd === 0 || String(f.showInAdd) === '0' || String(f.showInAdd) === 'false');
          f.showInEdit = !(f.showInEdit === false || f.showInEdit === 0 || String(f.showInEdit) === '0' || String(f.showInEdit) === 'false');
          f.showInGrid = !(f.showInGrid === false || f.showInGrid === 0 || String(f.showInGrid) === '0' || String(f.showInGrid) === 'false');
          f.isReadOnlyEdit = (f.isReadOnlyEdit === true || f.isReadOnlyEdit === 1 || String(f.isReadOnlyEdit) === '1' || String(f.isReadOnlyEdit) === 'true');
          f.isReadOnlyAdd = (f.isReadOnlyAdd === true || f.isReadOnlyAdd === 1 || String(f.isReadOnlyAdd) === '1' || String(f.isReadOnlyAdd) === 'true');
          return f;
        });

        if (schemaFields.length === 0) {
          throw new Error('Không nhận được cấu hình trường từ API_LayCacTruongGiaoDien cho FormName: ' + formName);
        }

        // 2. Phân tích các thông tin cấu hình dùng chung
        var firstField = schemaFields[0];
        primaryKey = firstField.primaryKey || 'id';
        apiSearch = firstField.apiSearch || '';
        apiSave = firstField.apiSave || '';
        apiDelete = firstField.apiDelete || '';

        // Tự động dịch tiêu đề dựa trên key dịch thuật
        var titleEl = document.getElementById('dynamic-title');
        var descEl = document.getElementById('dynamic-desc');
        var transTitleKey = 'nav.' + currentRoute.replace('/', '');
        var transDescKey = 'hdr.' + currentRoute.replace('/', '') + '.desc';

        if (titleEl) {
          titleEl.textContent = typeof t === 'function' ? t(transTitleKey) : transTitleKey;
        }
        if (descEl) {
          descEl.textContent = typeof t === 'function' ? t(transDescKey) : transDescKey;
        }

        // 3. Tự động sinh các ô nhập liệu của Form trong Modal
        _renderFormFields();

        // Inject động các nút thao tác mở rộng của từng màn hình bằng Component
        var extraActionsEl = document.getElementById('dynamic-extra-actions');
        if (extraActionsEl) {
          extraActionsEl.innerHTML = '';
          if ((formName === 'frmProduct' || formName === 'WA_Product') && window.UIProductWebSync) {
            var syncToolbar = UIProductWebSync.create({
              onSync: function () {
                updateProductWebStatus(1);
              },
              onUnsync: function () {
                updateProductWebStatus(0);
              }
            });
            extraActionsEl.appendChild(syncToolbar);
          }
        }

        // 4. Lấy dữ liệu và hiển thị lên Grid
        await _fetchAndRender();

      } catch (err) {
        console.error('Lỗi khởi tạo Dynamic Page:', err);
        $el.innerHTML = `<div class="card" style="color:var(--danger)">
          <h4><span class="material-symbols-outlined" style="vertical-align:middle">error</span> Lỗi khởi tạo trang động</h4>
          <p>${err.message}</p>
          <p style="font-size: 12px; margin-top: 8px;">Vui lòng chạy file script SQL <code>sql/API_LayCacTruongGiaoDien.sql</code> để tạo bảng <code>WA_FormatFields</code>, <code>WA_FrmLstTbl</code> và SP <code>API_LayCacTruongGiaoDien</code>.</p>
        </div>`;
      } finally {
        if (window.LoadingSpinner) LoadingSpinner.hide();
      }
    });
  }

  function _parseStaticOptions(dataSource) {
    if (!dataSource || !dataSource.startsWith('STATIC:')) return [];
    return dataSource.substring(7).split(',').map(function (p) {
      var kv = p.split('|');
      return { value: kv[0], label: kv[1] || kv[0] };
    });
  }

  function _renderFormFields() {
    var formFieldsContainer = document.getElementById('dynamic-form-fields');
    if (!formFieldsContainer) return;

    formFieldsContainer.innerHTML = '';

    schemaFields
      .filter(f => f.showInAdd || f.showInEdit)
      .forEach(function (f) {
        var requiredAttr = f.required ? 'required' : '';
        var groupClass = f.renderRule === 'textarea' ? 'form-group span2' : 'form-group';
        var labelText = f.label + (f.required ? ' *' : '');

        var fieldWrapper = document.createElement('div');
        fieldWrapper.className = groupClass;

        var label = document.createElement('label');
        label.textContent = labelText;
        fieldWrapper.appendChild(label);

        if (f.renderRule === 'select') {
          if (window.UIControls && typeof UIControls.createDataComboBox === 'function') {
            var comboId = 'field-' + f.name;
            var comboContainer = UIControls.createDataComboBox({
              id: comboId,
              placeholder: '-- Chọn ' + f.label + ' --',
              readOnly: true,
              headers: ['Mã/Giá trị', 'Tên hiển thị'],
              colFilterIndex: 0,
              colHighlightIndex: 1,
              enablePagination: false,
              onSearch: async function (q, page) {
                try {
                  var options = [];
                  if (f.dataSource && f.dataSource.startsWith('STATIC:')) {
                    options = _parseStaticOptions(f.dataSource);
                  } else if (f.dataSource) {
                    var endpoint = f.dataSource;
                    var params = { _t: Date.now() };
                    
                    if (endpoint.includes('/API_DanhMuc')) {
                      var queryObj = {};
                      if (f.dataSource.includes('?')) {
                        var parts = f.dataSource.split('?');
                        endpoint = parts[0];
                        var searchParams = new URLSearchParams(parts[1]);
                        searchParams.forEach(function (v, k) {
                          queryObj[k] = v;
                        });
                      }
                      if (q) {
                        queryObj.TimKiem = q;
                      }
                      
                      var user = JSON.parse(localStorage.getItem('santino_user') || '{}');
                      queryObj.UserRole = user.role || user.Group || '';
                      queryObj.UserEmployeeID = user.EmployeeID || '';
                      queryObj.UserManagerID = user.ManagerID || '';
                      queryObj.UserObjectID = user.ObjectID || '';
                      
                      params.q = JSON.stringify(queryObj);
                    } else {
                      if (f.dataSource.includes('?')) {
                        var parts = f.dataSource.split('?');
                        endpoint = parts[0];
                        var searchParams = new URLSearchParams(parts[1]);
                        searchParams.forEach(function (v, k) {
                          params[k] = v;
                        });
                      }
                      if (q) {
                        params.TimKiem = q;
                      }
                    }
                    var res = await Http.get(endpoint, params);
                    var records = res.records || res.list || res.data || res;
                    if (Array.isArray(records)) {
                      options = records.map(function (r) {
                        if (typeof r === 'object' && r !== null) {
                          var valKey = Object.keys(r).find(k => /id|value|val|ma/i.test(k));
                          var lblKey = Object.keys(r).find(k => /name|ten|label|desc|title|caption/i.test(k));
                          var val = valKey ? r[valKey] : Object.values(r)[0];
                          var lbl = lblKey ? r[lblKey] : (valKey ? r[valKey] : Object.values(r)[0]);
                          return { value: val, label: lbl };
                        }
                        return { value: r, label: r };
                      });
                    }
                  }
                  
                  if (q && f.dataSource && f.dataSource.startsWith('STATIC:')) {
                    var lq = q.toLowerCase();
                    options = options.filter(opt => 
                      String(opt.value).toLowerCase().includes(lq) || 
                      String(opt.label).toLowerCase().includes(lq)
                    );
                  }

                  return options.map(opt => [opt.value, opt.label]);
                } catch (err) {
                  console.warn('Lỗi tải dữ liệu cho combobox ' + f.name, err);
                  return [];
                }
              },
              onSelect: function (row) {
                var innerInput = document.getElementById(comboId);
                if (innerInput) {
                  innerInput.value = row[0];
                  innerInput.dispatchEvent(new Event('change'));
                }
              }
            });

            var innerInput = comboContainer.querySelector('input');
            if (innerInput) {
              innerInput.name = f.name;
              if (f.required) innerInput.required = true;
            }

            fieldWrapper.appendChild(comboContainer);
          } else {
            var select = document.createElement('select');
            select.id = 'field-' + f.name;
            select.name = f.name;
            if (f.required) select.required = true;
            select.innerHTML = '<option value="">-- Chọn --</option>';
            fieldWrapper.appendChild(select);
          }
        } else if (f.renderRule === 'sw') {
          var select = document.createElement('select');
          select.id = 'field-' + f.name;
          select.name = f.name;
          if (f.required) select.required = true;

          var options = _parseStaticOptions(f.dataSource);
          if (options.length === 0) {
            options = [{ value: 'true', label: 'Có' }, { value: 'false', label: 'Không' }];
          }
          select.innerHTML = options
            .map(opt => `<option value="${opt.value}">${opt.label}</option>`)
            .join('');
          fieldWrapper.appendChild(select);
        } else if (f.renderRule === 'mn') {
          var input = document.createElement('input');
          input.id = 'field-' + f.name;
          input.name = f.name;
          input.type = 'text';
          input.setAttribute('inputmode', 'numeric');
          input.placeholder = f.label;
          if (f.required) input.required = true;
          fieldWrapper.appendChild(input);

          var wordEl = document.createElement('div');
          wordEl.className = 'money-words-text';
          wordEl.style.cssText = 'font-size: 11px; color: var(--success); margin-top: 4px; min-height: 16px; font-style: italic;';
          fieldWrapper.appendChild(wordEl);

          if (window.UIInput && typeof UIInput.setupMoneyInput === 'function') {
            UIInput.setupMoneyInput(input, wordEl);
          }
        } else {
          var type = 'text';
          if (f.renderRule === 'number') type = 'number';
          var input = document.createElement('input');
          input.id = 'field-' + f.name;
          input.name = f.name;
          input.type = type;
          if (type === 'number') input.step = 'any';
          input.placeholder = f.label;
          if (f.required) input.required = true;
          fieldWrapper.appendChild(input);
        }

        formFieldsContainer.appendChild(fieldWrapper);
      });
  }

  async function _fetchAndRender() {
    if (gridApi) {
      gridApi.showLoadingOverlay();
    }

    try {
      if (!apiSearch) {
        throw new Error('Chưa cấu hình ApiSearch trong database cho Form: ' + formName);
      }

      // 1. Chuẩn bị params cho API (phân trang server-side theo API.md)
      var params = {
        page: currentPage,
        limit: itemsPerPage,
        _t: Date.now() // Cache-buster chặn cache client-side
      };

      // Tách query params có sẵn từ database (ví dụ: ?Loai=SKU)
      var endpoint = apiSearch;
      var queryObj = {};
      var hasQueryParams = false;

      if (apiSearch.includes('?')) {
        var parts = apiSearch.split('?');
        endpoint = parts[0];
        var searchParams = new URLSearchParams(parts[1]);
        searchParams.forEach(function (v, k) {
          queryObj[k] = v;
          hasQueryParams = true;
        });
      }

      // 2. Thêm điều kiện lọc tìm kiếm server-side ($lk) hoặc TimKiem
      var hasSearch = searchVal.trim() !== '';

      if (endpoint.includes('/API_DanhMuc')) {
        // Với API_DanhMuc, tất cả các tham số lọc phải đưa vào params.q dạng JSON
        if (hasSearch) {
          queryObj.TimKiem = searchVal.trim();
        }
        
        var user = JSON.parse(localStorage.getItem('santino_user') || '{}');
        queryObj.UserRole = user.role || user.Group || '';
        queryObj.UserEmployeeID = user.EmployeeID || '';
        queryObj.UserManagerID = user.ManagerID || '';
        queryObj.UserObjectID = user.ObjectID || '';
        
        params.q = JSON.stringify(queryObj);
      } else {
        // Với các API khác, đưa queryParams trực tiếp vào params chính
        if (hasQueryParams) {
          Object.assign(params, queryObj);
        }
        if (hasSearch) {
          var filterField = schemaFields.find(f => f.showInFilter) || schemaFields[0];
          if (filterField) {
            var qObj = {};
            qObj[filterField.name + '$lk'] = '%' + searchVal.trim() + '%';
            
            // Đóng gói lồng nhau để Gateway nhận diện key "q" và gán vào tham số @q của Store
            var gatewayObj = {
              q: JSON.stringify(qObj)
            };
            params.q = JSON.stringify(gatewayObj);
          }
        }
      }

      // Xóa cache HTTP trước khi gọi để chắc chắn lấy dữ liệu mới từ SQL
      if (typeof Http !== 'undefined' && Http.clearCache) {
        Http.clearCache();
      }

      // 3. Gọi API
      var res = await Http.get(endpoint, params);
      
      // Xử lý dữ liệu mảng an toàn
      allData = res.records || res.list || res.data || res;
      if (!Array.isArray(allData)) {
        if (res && typeof res === 'object') {
          var foundArr = Object.values(res).find(v => Array.isArray(v));
          allData = foundArr || [];
        } else {
          allData = [];
        }
      }

      // Chuẩn hóa key của từng bản ghi để khớp với định dạng chữ hoa/thường và đồng nghĩa của schemaFields
      if (Array.isArray(allData)) {
        allData = allData.map(function (row) {
          if (!row || typeof row !== 'object') return row;
          var newRow = Object.assign({}, row);
          var rowKeys = Object.keys(row);
          
          schemaFields.forEach(function (f) {
            var fName = f.name;
            var fNameClean = fName.toLowerCase().replace(/_/g, '');
            
            // 1. Tìm khớp trực tiếp (bỏ qua viết hoa/thường và gạch dưới)
            var matchedKey = rowKeys.find(function (k) {
              var kClean = k.toLowerCase().replace(/_/g, '');
              return kClean === fNameClean;
            });
            
            // 2. Nếu không khớp trực tiếp, sử dụng từ điển đồng nghĩa phổ biến
            if (!matchedKey) {
              var fL = fName.toLowerCase();
              matchedKey = rowKeys.find(function (k) {
                var kL = k.toLowerCase();
                
                // Đồng nghĩa ID / Mã chính
                if ((fL === 'id' || fL === 'itemid' || fL === 'chietkhau' || fL === 'size') && 
                    (kL === 'id' || kL === 'itemid' || kL === 'size' || kL === 'chietkhau')) return true;
                
                // Đồng nghĩa Tên / Nhãn
                if ((fL === 'name' || fL === 'itemname' || fL === 'ctkm' || fL === 'tensize') && 
                    (kL === 'name' || kL === 'itemname' || kL === 'ctkm' || kL === 'ten_size')) return true;
                
                // Đồng nghĩa Giá / Đơn giá
                if ((fL === 'price' || fL === 'unitprice') && 
                    (kL === 'price' || kL === 'unitprice' || kL === 'don_gia')) return true;
                
                // Đồng nghĩa Nhóm size
                if (fL === 'nhomsize' && kL === 'nhom_size') return true;
                
                return false;
              });
            }
            
            // 3. Dự phòng theo thứ tự cột nếu là danh mục chung (Promotion / SKU)
            if (!matchedKey && rowKeys.length >= 2) {
              var showGridFields = schemaFields.filter(function (sf) { return sf.showInGrid; });
              var fIndex = showGridFields.indexOf(f);
              if (fIndex === 0 && rowKeys.includes('id')) matchedKey = 'id';
              else if (fIndex === 1 && rowKeys.includes('name')) matchedKey = 'name';
              else if (fIndex === 2 && rowKeys.includes('price')) matchedKey = 'price';
            }
            
            if (matchedKey) {
              newRow[fName] = row[matchedKey];
            }
          });
          return newRow;
        });
      }

      var totalItems = 0;
      if (res._recordtotal !== undefined) {
        totalItems = Number(res._recordtotal);
      } else {
        totalItems = allData.length;
      }

      _renderGridPage(allData, totalItems);
    } catch (err) {
      console.warn('Lỗi tải danh sách từ API:', err);
      allData = [];
      _renderGridPage([], 0);
    }
  }

  function _renderGridPage(pageRows, totalItems) {
    var container = document.getElementById('dynamic-grid-container');
    if (!container) return;

    // Xây dựng ColumnDefs động từ schema của SQL
    var gridColumns = schemaFields
      .filter(f => f.showInGrid)
      .map(function (f, index) {
        var col = {
          field: f.name,
          headerName: f.label
        };

        if (index === 0) {
          col.checkboxSelection = true;
          col.headerCheckboxSelection = true;
          col.cellStyle = { fontWeight: '700' };
        }

        if (f.renderRule === 'mn') {
          col.cellStyle = Object.assign({}, col.cellStyle, { color: 'var(--accent, #4F46E5)', fontWeight: '700', textAlign: 'right' });
          col.valueFormatter = function (params) {
            if (params.value && typeof Utils !== 'undefined') return Utils.formatMoney(params.value);
            return params.value || '0đ';
          };
        } else if (f.renderRule === 'sw') {
          col.cellRenderer = function (params) {
            var isTrue = !!params.value && String(params.value) !== 'false' && String(params.value) !== '0';
            var badgeClass = isTrue ? 'badge-blue' : 'badge-gray';
            var badgeText = isTrue ? 'Có' : 'Không';
            
            if (f.dataSource && f.dataSource.startsWith('STATIC:')) {
              var options = _parseStaticOptions(f.dataSource);
              var matched = options.find(opt => {
                var optBool = opt.value === 'true' || opt.value === 1 || opt.value === '1';
                return optBool === isTrue;
              });
              if (matched) {
                badgeText = matched.label;
              }
            }

            // Gán màu sắc đặc trưng
            if (isTrue) {
              badgeClass = 'badge-blue';
              if (f.name === 'isDisable') badgeClass = 'badge-red'; // Đỏ nếu ngừng bán
              else if (f.name === 'isWeb') badgeClass = 'badge-blue';
            } else {
              badgeClass = 'badge-gray';
              if (f.name === 'isDisable') badgeClass = 'badge-green'; // Xanh lá nếu đang bán
            }

            return `<span class="badge ${badgeClass}">${badgeText}</span>`;
          };
        }

        return col;
      });

    // Thêm cột Thao tác
    gridColumns.push({
      headerName: 'Thao tác',
      sortable: false,
      filter: false,
      floatingFilter: false,
      cellRenderer: function (params) {
        var p = params.data;
        var val = p[primaryKey];
        var wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.gap = '6px';
        wrapper.style.alignItems = 'center';
        wrapper.innerHTML = `
          <button class="btn-icon" onclick="DynamicPage.openModal('${val}')">
            <span class="material-symbols-outlined" style="font-size: calc(16px * var(--text-scale, 1))">edit</span>
          </button>
          <button class="btn-icon" onclick="DynamicPage.del('${val}')">
            <span class="material-symbols-outlined" style="font-size: calc(16px * var(--text-scale, 1));color:var(--danger)">delete</span>
          </button>
        `;
        return wrapper;
      }
    });

    if (!gridApi) {
      var gridOptions = {
        pagination: false,
        columnDefs: gridColumns,
        rowData: pageRows,
        rowSelection: 'multiple'
      };
      gridApi = AppGrid.create(container, gridOptions);
    } else {
      gridApi.setGridOption('columnDefs', gridColumns);
      gridApi.setGridOption('rowData', pageRows);
      if (pageRows.length === 0) {
        gridApi.showNoRowsOverlay();
      } else {
        gridApi.hideOverlay();
      }
    }

    var paginationContainer = document.getElementById('dynamic-pagination');
    if (paginationContainer) {
      paginationContainer.innerHTML = '';
      if (totalItems > 0 && typeof Pagination !== 'undefined') {
        var pag = Pagination.create({
          totalItems: totalItems,
          itemsPerPage: itemsPerPage,
          currentPage: currentPage,
          onPageChange: function (page) {
            currentPage = page;
            _fetchAndRender();
          },
          onRefresh: function () {
            _fetchAndRender();
          }
        });
        paginationContainer.appendChild(pag);
      }
    }
  }

  function onSearch(val) {
    searchVal = val;
    currentPage = 1;
    _fetchAndRender();
  }

  function openModal(primaryKeyValue, isCopy) {
    if (!isCopy) {
      copySourceData = null;
    }
    var p = allData.find(item => String(item[primaryKey]) === String(primaryKeyValue));
    document.getElementById('dm-title').textContent = p ? 'Chỉnh Sửa' : 'Thêm Mới';
    document.getElementById('dm-id-hidden').value = p ? primaryKeyValue : '';

    schemaFields.forEach(function (f) {
      var input = document.getElementById('field-' + f.name);
      if (input) {
        if (p) {
          var val = p[f.name];
          if (f.renderRule === 'sw') {
            var isTrue = !!val && String(val) !== 'false' && String(val) !== '0';
            input.value = isTrue ? 'true' : 'false';
          } else {
            input.value = val !== undefined && val !== null ? String(val) : '';
            if (f.renderRule === 'mn') {
              input.dispatchEvent(new Event('change'));
            }
          }
          if (f.readonlyOnEdit) {
            input.disabled = true;
          }
        } else {
          if (f.renderRule === 'sw') {
            var options = _parseStaticOptions(f.dataSource);
            input.value = options.length > 0 ? options[0].value : 'false';
          } else {
            input.value = '';
            if (f.renderRule === 'mn') {
              input.dispatchEvent(new Event('change'));
            }
          }
          input.disabled = false;
        }
      }
    });

    window.openModal('modal-dynamic');
  }

  function copyItem() {
    if (!gridApi) return;
    var selectedRows = gridApi.getSelectedRows();
    if (!selectedRows || selectedRows.length === 0) {
      showToast('Vui lòng chọn một dòng để sao chép!', 'error');
      return;
    }
    if (selectedRows.length > 1) {
      showToast('Vui lòng chỉ chọn duy nhất một dòng để sao chép!', 'error');
      return;
    }
    var p = selectedRows[0];
    copySourceData = p;
    openModal('', true);

    schemaFields.forEach(function (f) {
      var input = document.getElementById('field-' + f.name);
      if (input) {
        input.disabled = false;
        if (f.name === primaryKey) {
          input.value = p[f.name] || '';
        } else {
          var val = p[f.name];
          if (f.renderRule === 'sw') {
            var isTrue = !!val && String(val) !== 'false' && String(val) !== '0';
            input.value = isTrue ? 'true' : 'false';
          } else {
            input.value = val !== undefined && val !== null ? String(val) : '';
            input.dispatchEvent(new Event('change'));
          }
        }
      }
    });
  }

  async function save() {
    var idHidden = document.getElementById('dm-id-hidden').value;
    var formInputData = {};
    var isInvalid = false;

    schemaFields.forEach(function (f) {
      var input = document.getElementById('field-' + f.name);
      if (input) {
        var val = input.value.trim();
        if (f.required && !val) {
          showToast('Vui lòng nhập đầy đủ: ' + f.label, 'error');
          isInvalid = true;
        }
        
        if (f.renderRule === 'mn') {
          var cleanVal = val.replace(/\D/g, '');
          formInputData[f.name] = cleanVal === '' ? 0 : Number(cleanVal);
        } else if (f.renderRule === 'number') {
          formInputData[f.name] = val === '' ? 0 : Number(val);
        } else if (val === 'true') {
          formInputData[f.name] = true;
        } else if (val === 'false') {
          formInputData[f.name] = false;
        } else {
          formInputData[f.name] = val;
        }
      }
    });

    if (isInvalid) return;

    if (copySourceData) {
      Object.keys(copySourceData).forEach(function (key) {
        if (copySourceData[key] !== undefined && copySourceData[key] !== null) {
          formInputData['CopyFrom_' + key] = copySourceData[key];
        }
      });
      copySourceData = null; // Reset trạng thái copy sau khi đã lấy dữ liệu
    }

    var endpoint = apiSave ? apiSave.split('?')[0] : apiSearch.split('?')[0];

    // Trích xuất query params (Loai=SKU, Loai=Promotion...) để gửi kèm lên body
    if (apiSave && apiSave.includes('?')) {
      var parts = apiSave.split('?');
      var searchParams = new URLSearchParams(parts[1]);
      searchParams.forEach(function (v, k) {
        formInputData[k] = v;
      });
    } else if (apiSearch.includes('?')) {
      var parts = apiSearch.split('?');
      var searchParams = new URLSearchParams(parts[1]);
      searchParams.forEach(function (v, k) {
        formInputData[k] = v;
      });
    }

    try {
      var isSP = endpoint.toLowerCase().includes('/api_');
      var payload = isSP ? { q: JSON.stringify(formInputData) } : formInputData;

      if (isSP) {
        // Nếu là Stored Procedure, luôn dùng POST (Store tự xử lý INSERT hoặc UPDATE)
        await Http.post(endpoint, payload);
        showToast(idHidden ? 'Đã lưu thay đổi thành công' : 'Đã thêm mới thành công');
      } else {
        if (idHidden) {
          var updateUrl = endpoint + '/' + encodeURIComponent(idHidden);
          await Http.post(updateUrl, payload);
          showToast('Đã lưu thay đổi thành công');
        } else {
          await Http.put(endpoint, payload);
          showToast('Đã thêm mới thành công');
        }
      }

      closeModal('modal-dynamic');
      _fetchAndRender();
    } catch (err) {
      console.warn('Lưu API thất bại, chuyển sang chế độ Lưu tạm:', err);
      _saveLocalFallback(idHidden, formInputData);
    }
  }

  function _saveLocalFallback(idHidden, formInputData) {
    var pkValue = formInputData[primaryKey];
    if (idHidden) {
      var idx = allData.findIndex(item => String(item[primaryKey]) === String(idHidden));
      if (idx !== -1) {
        allData[idx] = Object.assign({}, allData[idx], formInputData);
      }
    } else {
      var exists = allData.some(item => String(item[primaryKey]).toLowerCase() === String(pkValue).toLowerCase());
      if (exists) {
        showToast('Mã khóa chính này đã tồn tại!', 'error');
        return;
      }
      allData.push(formInputData);
    }
    localStorage.setItem('Santino_CRUD_' + currentRoute, JSON.stringify(allData));
    closeModal('modal-dynamic');
    _fetchAndRender();
    showToast('Đã lưu tạm dữ liệu thành công');
  }

  function del(primaryKeyValue) {
    ConfirmModal.show({
      title: 'Xác nhận xóa',
      message: 'Bạn có chắc muốn xóa dòng dữ liệu này không?',
      confirmText: 'Xóa',
      confirmClass: 'btn-danger',
      onConfirm: async function () {
        var endpoint = apiSearch.split('?')[0];
        try {
          // Xóa (DELETE /api/{endpoint}/{id})
          var deleteUrl = endpoint + '/' + encodeURIComponent(primaryKeyValue);
          await Http.del(deleteUrl);
          showToast('Đã xóa dữ liệu thành công');
          _fetchAndRender();
        } catch (err) {
          console.warn('Xóa API thất bại, chuyển sang chế độ Xóa tạm:', err);
          allData = allData.filter(item => String(item[primaryKey]) !== String(primaryKeyValue));
          localStorage.setItem('Santino_CRUD_' + currentRoute, JSON.stringify(allData));
          _fetchAndRender();
          showToast('Đã xóa tạm dữ liệu thành công');
        }
      }
    });
  }

  function updateProductWebStatus(isWeb) {
    if (!gridApi) return;
    var selectedRows = gridApi.getSelectedRows();
    if (!selectedRows || selectedRows.length === 0) {
      showToast('Vui lòng chọn ít nhất một sản phẩm bằng cách tích chọn ô đầu dòng!', 'error');
      return;
    }

    var items = selectedRows.map(function (row) {
      return {
        ten_hang_2: row.ten_hang_2,
        mau: row.mau
      };
    });

    var statusText = isWeb === 1 ? 'lấy sang Web' : 'hủy lấy sang Web';
    
    var payload = {
      q: JSON.stringify({
        Items: JSON.stringify(items),
        IsWeb: isWeb
      })
    };

    if (window.LoadingSpinner) LoadingSpinner.show('Đang cập nhật...');
    Http.post('/API_CapNhatWebSanPham', payload).then(function () {
      showToast('Đã ' + statusText + ' thành công cho ' + items.length + ' sản phẩm!');
      _fetchAndRender();
    }).catch(function (err) {
      console.error('Cập nhật trạng thái Web thất bại:', err);
      showToast('Lỗi cập nhật trạng thái Web: ' + err.message, 'error');
    }).finally(function () {
      if (window.LoadingSpinner) LoadingSpinner.hide();
    });
  }

  return {
    render: render,
    onSearch: onSearch,
    openModal: openModal,
    copyItem: copyItem,
    save: save,
    del: del,
    updateProductWebStatus: updateProductWebStatus
  };
})();
