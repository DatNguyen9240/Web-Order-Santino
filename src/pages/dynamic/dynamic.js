var DynamicPage = (function () {
  var currentRoute = '';
  var formName = '';
  var primaryKey = 'id';
  var apiSearch = '';
  var apiSave = '';
  var apiCreate = '';
  var apiUpdate = '';
  var apiDelete = '';
  var schemaFields = [];
  var allData = [];
  var currentPage = 1;
  var itemsPerPage = 20;
  var gridApi = null;
  var searchVal = '';
  var copySourceData = null;
  var editOriginalData = null;

  // Danh sách các FormatID số trong CSDL chuẩn
  var NUMERIC_FORMATS = ['B', 'U', 'Q', 'N', '1D', '2D', '3D', '4D', '5D', '6D', 'N3', 'N4', 'N5', 'N6'];

  function render($el, route) {
    gridApi = null;
    allData = [];
    currentPage = 1;
    searchVal = '';
    schemaFields = [];
    editOriginalData = null;

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
        // 1. Gọi API lấy cấu hình trường (metadata) từ các bảng hệ thống SY_FmtFldTbl, SY_FrmLstTbl, SY_FrmDrdwTbl
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
        apiCreate = firstField.apiCreate || apiSave;
        apiUpdate = firstField.apiUpdate || '';
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
          var syncComponentKey = 'UI' + formName.replace('frm', '') + 'WebSync';
          if (window[syncComponentKey]) {
            var syncToolbar = window[syncComponentKey].create({
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
          <p style="font-size: 12px; margin-top: 8px;">Vui lòng chạy file script SQL <code>sql/API_LayCacTruongGiaoDien.sql</code> để tạo cấu hình trong các bảng <code>SY_FmtFldTbl</code>, <code>SY_FrmLstTbl</code>, <code>SY_FrmDrdwTbl</code> và SP <code>API_LayCacTruongGiaoDien</code>.</p>
        </div>`;
      } finally {
        if (window.LoadingSpinner) LoadingSpinner.hide();
      }
    });
  }

  function _isQueryOrApi(source) {
    if (!source) return false;
    var src = source.toLowerCase().trim();
    if (src.startsWith('/') || src.startsWith('select ') || src.startsWith('exec ')) return true;
    if (src.includes('from ') || src.includes('where ') || src.includes('join ')) return true;
    if (src.includes('{0}') || src.includes('{1}') || src.includes('{s}')) return true;
    // Nếu có khoảng trắng nhưng không chứa dấu chấm phẩy hoặc dấu gạch đứng thì khả năng cao là SP call
    if (src.includes(' ') && !src.includes(';') && !src.includes('|')) return true;
    return false;
  }

  function _parseStaticOptions(dataSource) {
    if (!dataSource) return [];
    
    var cleanStr = dataSource.trim();
    if (cleanStr.toUpperCase().startsWith('STATIC:')) {
      cleanStr = cleanStr.substring(7);
    }
    
    // Hỗ trợ phân tách bằng dấu chấm phẩy hoặc dấu phẩy
    var separator = cleanStr.includes(';') ? ';' : ',';
    return cleanStr.split(separator).map(function (p) {
      var kv = p.split('|');
      var val = kv[0].trim();
      var lbl = kv[1] ? kv[1].trim() : val;
      var color = kv[2] ? kv[2].trim() : '';
      return { value: val, label: lbl, color: color };
    });
  }

  function _renderFormFields() {
    var formFieldsContainer = document.getElementById('dynamic-form-fields');
    if (!formFieldsContainer) return;

    formFieldsContainer.innerHTML = '';

    schemaFields
      .filter(f => f.showInAdd || f.showInEdit)
      .forEach(function (f) {
        var isTextarea = f.renderRule === 'textarea';
        var groupClass = isTextarea ? 'form-group span2' : 'form-group';
        var labelText = f.label + (f.required ? ' *' : '');

        var fieldWrapper = document.createElement('div');
        fieldWrapper.className = groupClass;

        var label = document.createElement('label');
        label.textContent = labelText;
        fieldWrapper.appendChild(label);

        // Phân tích loại điều khiển nhập liệu từ CSDL chuẩn
        var hasDataSource = f.dataSource && f.dataSource.length > 0;
        var dsType = (f.dropdownType || '').toLowerCase().trim();

        // Phân loại động (lookup) vs tĩnh (valuelist) theo Type chuẩn của DB và phân tích nội dung
        var isDynamicLookup = hasDataSource && (
          ['dropdown', 'dropselect', 'combo'].includes(dsType) ||
          (dsType === '' && _isQueryOrApi(f.dataSource))
        );
        var isStaticSelect = hasDataSource && (dsType === 'valuelist' || (dsType === '' && !isDynamicLookup));

        if (dsType === 'colorselct') {
          // Render Color Picker nếu là loại ColorSelct chuẩn
          var input = document.createElement('input');
          input.id = 'field-' + f.name;
          input.name = f.name;
          input.type = 'color';
          if (f.required) input.required = true;
          fieldWrapper.appendChild(input);
        } else if (isDynamicLookup) {
          // 1. Nếu là các loại chọn động từ API/SQL -> Render Combobox tìm kiếm động
          if (window.UIControls && typeof UIControls.createDataComboBox === 'function') {
            var comboId = 'field-' + f.name;
            var comboContainer = UIControls.createDataComboBox({
              id: comboId,
              placeholder: '-- Chọn ' + f.label + ' --',
              readOnly: true,
              enableColorSwatch: f.name.toLowerCase().includes('mau'),
              headers: ['Mã/Giá trị', 'Tên hiển thị'],
              colFilterIndex: 0,
              colHighlightIndex: 1,
              enablePagination: true,
              onSearch: async function (q, page) {
                try {
                  var options = [];
                  var endpoint = f.dataSource;
                  
                  // Tự động phân tích và thay thế các biến tham chiếu từ trường cha trên form (ví dụ: {ProvinceID})
                  var matches = endpoint.match(/\{(\w+)\}/g);
                  if (matches) {
                    matches.forEach(function (m) {
                      var parentFieldName = m.substring(1, m.length - 1);
                      var parentInput = document.getElementById('field-' + parentFieldName);
                      var parentVal = parentInput ? parentInput.value : '';
                      endpoint = endpoint.replace(m, parentVal);
                    });
                  }

                  var params = {
                    page: page || 1,
                    limit: 200,
                    top: 200,
                    _t: Date.now()
                  };
                  
                  var queryObj = {};
                  if (endpoint.includes('?')) {
                    var parts = endpoint.split('?');
                    endpoint = parts[0];
                    var searchParams = new URLSearchParams(parts[1]);
                    searchParams.forEach(function (v, k) {
                      queryObj[k] = v;
                    });
                  }
                  var isSelectSource = /^\s*select\s+/i.test(endpoint);
                  if (q && !isSelectSource) {
                    queryObj.TimKiem = q;
                    queryObj.Keyword = q;
                  }
                  
                  // Nếu ô nhập này phụ thuộc vào trường cha (LinkColumn), tự động lấy giá trị trường cha gửi lên API làm tham số lọc
                  if (f.LinkColumn) {
                    var parentInput = document.getElementById('field-' + f.LinkColumn);
                    if (parentInput) {
                      queryObj[f.LinkColumn] = parentInput.value;
                    }
                  }
                  
                  var dsL = endpoint.toLowerCase();
                  if (isSelectSource) {
                    // Route bảng generic chỉ nhận page/limit/f/q. Các tham số
                    // TimKiem/UserRole trước đây làm request lookup bị lỗi.
                    var selectColumns = [];
                    if (f.dropdownValueColumn) selectColumns.push(f.dropdownValueColumn);
                    if (f.dropdownDisplayColumn && selectColumns.indexOf(f.dropdownDisplayColumn) === -1) {
                      selectColumns.push(f.dropdownDisplayColumn);
                    }
                    if (selectColumns.length > 0) params.f = selectColumns.join(';');

                    var selectQuery = {};
                    if (q) {
                      var searchColumn = f.dropdownDisplayColumn || f.dropdownValueColumn || f.name;
                      selectQuery[searchColumn + '$lk'] = '%' + q + '%';
                    }
                    if (f.LinkColumn && queryObj[f.LinkColumn]) {
                      selectQuery[f.LinkColumn] = queryObj[f.LinkColumn];
                    }
                    if (Object.keys(selectQuery).length > 0) {
                      params.q = JSON.stringify(selectQuery);
                    }
                  } else {
                    // Context người dùng chỉ dành cho API/SP, không gửi vào route bảng.
                    var user = JSON.parse(localStorage.getItem('santino_user') || '{}');
                    queryObj.UserRole = user.role || user.Group || '';
                    queryObj.UserEmployeeID = user.EmployeeID || '';
                    queryObj.UserObjectID = user.ObjectID || '';

                    if (dsL.includes('danhmuc') || dsL.includes('gateway') || dsL.includes('router')) {
                      params.q = JSON.stringify(queryObj);
                    } else {
                      Object.assign(params, queryObj);
                    }
                  }

                  var res = await Http.get(endpoint, params);
                  var records = res.records || res.list || res.data || res;
                  if (Array.isArray(records)) {
                    options = records.map(function (r) {
                      if (typeof r === 'object' && r !== null) {
                        var keys = Object.keys(r);
                        var valKey = f.dropdownValueColumn && keys.find(k => k.toLowerCase() === f.dropdownValueColumn.toLowerCase())
                          ? keys.find(k => k.toLowerCase() === f.dropdownValueColumn.toLowerCase())
                          : keys[0];
                        var lblKey = f.dropdownDisplayColumn && keys.find(k => k.toLowerCase() === f.dropdownDisplayColumn.toLowerCase())
                          ? keys.find(k => k.toLowerCase() === f.dropdownDisplayColumn.toLowerCase())
                          : (keys[1] || valKey);
                        
                        return { value: r[valKey], label: r[lblKey], rawRecord: r };
                      }
                      return { value: r, label: r, rawRecord: r };
                    });
                  }

                  // `SELECT *` can return repeated lookup values (notably MauSac).
                  // Keep the first row for each value so the dropdown stays clean.
                  var seenValues = {};
                  return options
                    .filter(function (opt) {
                      var key = String(opt.value === undefined || opt.value === null ? '' : opt.value);
                      if (seenValues[key]) return false;
                      seenValues[key] = true;
                      return true;
                    })
                    .map(opt => [opt.value, opt.label, opt.rawRecord]);
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

                // TỰ ĐỘNG TRIGGER AUTOFILL: Tự động điền dữ liệu cho các trường khác nếu có cột trùng tên
                var rawRecord = row[2];
                if (rawRecord && typeof rawRecord === 'object') {
                  var recordKeys = Object.keys(rawRecord);
                  schemaFields.forEach(function (otherField) {
                    if (otherField.name === f.name) return; // Tránh đè lên chính nó

                    var matchedKey = recordKeys.find(k => k.toLowerCase().replace(/_/g, '') === otherField.name.toLowerCase().replace(/_/g, ''));
                    if (matchedKey) {
                      var otherInput = document.getElementById('field-' + otherField.name);
                      if (otherInput) {
                        var newVal = rawRecord[matchedKey];
                        if (otherInput.type === 'checkbox') {
                          otherInput.checked = newVal === 'true' || newVal === 1 || newVal === '1' || newVal === true;
                        } else {
                          otherInput.value = newVal !== undefined && newVal !== null ? String(newVal) : '';
                        }
                        otherInput.dispatchEvent(new Event('change'));
                      }
                    }
                  });
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
        } else if (isStaticSelect) {
          // 2. Nếu là các loại chọn tĩnh (ValueList) -> Render thẻ <select> tĩnh tiêu chuẩn
          var select = document.createElement('select');
          select.id = 'field-' + f.name;
          select.name = f.name;
          if (f.required) select.required = true;

          var options = _parseStaticOptions(f.dataSource);
          select.innerHTML = options
            .map(opt => `<option value="${opt.value}">${opt.label}</option>`)
            .join('');
          fieldWrapper.appendChild(select);
        } else {
          // 3. Các loại nhập liệu kiểu dữ liệu khác
          if (f.dataType === 'bit') {
            // Render ô checkbox chuẩn cho trường kiểu logic bit không có danh mục chọn
            var input = document.createElement('input');
            input.id = 'field-' + f.name;
            input.name = f.name;
            input.type = 'checkbox';
            input.style.width = 'auto';
            input.style.height = 'auto';
            input.style.marginRight = '8px';
            
            // Đặt checkbox lên trước label text
            label.innerHTML = '';
            label.appendChild(input);
            label.appendChild(document.createTextNode(labelText));
          } else {
            var input = document.createElement('input');
            input.id = 'field-' + f.name;
            input.name = f.name;
            input.placeholder = f.label;
            if (f.required) input.required = true;

            if (f.renderRule === 'D') {
              input.type = 'date';
            } else if (f.renderRule === 'DT') {
              input.type = 'datetime-local';
            } else if (f.renderRule === 'H') {
              input.type = 'time';
            } else if (NUMERIC_FORMATS.includes(f.renderRule)) {
              input.type = 'number';
              input.step = 'any';
            } else {
              input.type = 'text';
            }

            fieldWrapper.appendChild(input);
          }
        }

        formFieldsContainer.appendChild(fieldWrapper);
      });

      // Đăng ký sự kiện lắng nghe thay đổi của cha để tự động xóa trường con (Cascading Dropdowns)
      schemaFields.forEach(function (parentField) {
        var parentInput = document.getElementById('field-' + parentField.name);
        if (parentInput) {
          parentInput.addEventListener('change', function () {
            schemaFields.forEach(function (childField) {
              var isChild = childField.LinkColumn === parentField.name || 
                            (childField.dataSource && childField.dataSource.toLowerCase().includes('{' + parentField.name.toLowerCase() + '}'));
              if (isChild) {
                var childInput = document.getElementById('field-' + childField.name);
                if (childInput) {
                  if (childInput.value !== '') {
                    childInput.value = '';
                    childInput.dispatchEvent(new Event('change'));
                  }
                }
              }
            });
          });
        }
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
      var user = JSON.parse(localStorage.getItem('santino_user') || '{}');
      var dsLower = endpoint.toLowerCase();

      if (dsLower.includes('danhmuc') || dsLower.includes('gateway') || dsLower.includes('router')) {
        if (hasSearch) {
          queryObj.TimKiem = searchVal.trim();
        }
        queryObj.UserRole = user.role || user.Group || '';
        queryObj.UserEmployeeID = user.EmployeeID || '';
        queryObj.UserManagerID = user.ManagerID || '';
        queryObj.UserObjectID = user.ObjectID || '';
        
        params.q = JSON.stringify(queryObj);
      } else {
        if (hasQueryParams) {
          Object.assign(params, queryObj);
        }
        if (hasSearch) {
          var filterField = schemaFields.find(f => f.showInFilter) || schemaFields[0];
          if (filterField) {
            var qObj = {};
            qObj[filterField.name + '$lk'] = '%' + searchVal.trim() + '%';
            
            // Route bảng generic nhận trực tiếp object điều kiện trong tham số q.
            params.q = JSON.stringify(qObj);
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

      // Chuẩn hóa key của từng bản ghi để khớp với định dạng chữ hoa/thường của schemaFields
      if (Array.isArray(allData)) {
        allData = allData.map(function (row) {
          if (!row || typeof row !== 'object') return row;
          var newRow = Object.assign({}, row);
          var rowKeys = Object.keys(row);
          
          schemaFields.forEach(function (f) {
            var fName = f.name;
            var fNameClean = fName.toLowerCase().replace(/_/g, '');
            
            // Tìm khớp trực tiếp (bỏ qua viết hoa/thường và gạch dưới)
            var matchedKey = rowKeys.find(function (k) {
              return k.toLowerCase().replace(/_/g, '') === fNameClean;
            });
            
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

        // Định dạng cột số (Numeric) chuẩn hóa
        var isNumeric = NUMERIC_FORMATS.includes(f.renderRule);
        var hasDataSource = f.dataSource && f.dataSource.length > 0;
        var dsType = (f.dropdownType || '').toLowerCase().trim();

        var isDynamicLookup = hasDataSource && (
          ['dropdown', 'dropselect', 'combo'].includes(dsType) ||
          (dsType === '' && _isQueryOrApi(f.dataSource))
        );
        var isStaticSelect = hasDataSource && (dsType === 'valuelist' || (dsType === '' && !isDynamicLookup));

        if (isNumeric) {
          col.cellStyle = Object.assign({}, col.cellStyle, { textAlign: 'right' });
          col.valueFormatter = function (params) {
            if (params.value !== undefined && params.value !== null && params.value !== '') {
              return new Intl.NumberFormat('vi-VN').format(params.value);
            }
            return '';
          };
        } else if (isStaticSelect) {
          // Render badge hiển thị cho các cấu hình chọn tĩnh (STATIC/ValueList)
          col.cellRenderer = function (params) {
            var valStr = params.value !== undefined && params.value !== null ? String(params.value).trim() : '';
            var options = _parseStaticOptions(f.dataSource);
            var matched = options.find(opt => opt.value === valStr || (opt.value === 'true' && valStr === '1') || (opt.value === 'false' && valStr === '0'));
            
            var badgeText = matched ? matched.label : valStr;
            var color = (matched && matched.color) ? matched.color : '';
            
            var badgeClass = 'badge-gray';
            if (color) {
              badgeClass = 'badge-' + color;
            }

            return `<span class="badge ${badgeClass}">${badgeText}</span>`;
          };
        } else if (f.dataType === 'bit') {
          col.cellStyle = Object.assign({}, col.cellStyle, { textAlign: 'center' });
          col.cellRenderer = function (params) {
            var val = params.value;
            var isTrue = val === true || val === 1 || val === '1' || String(val).toLowerCase() === 'true';
            return isTrue ? '✔️' : '❌';
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

        var btnEdit = document.createElement('button');
        btnEdit.className = 'btn-icon';
        btnEdit.innerHTML = '<span class="material-symbols-outlined" style="font-size: calc(16px * var(--text-scale, 1))">edit</span>';
        btnEdit.addEventListener('click', function (e) {
          e.stopPropagation();
          DynamicPage.openModal(val);
        });

        var btnDel = document.createElement('button');
        btnDel.className = 'btn-icon';
        btnDel.innerHTML = '<span class="material-symbols-outlined" style="font-size: calc(16px * var(--text-scale, 1));color:var(--danger)">delete</span>';
        btnDel.addEventListener('click', function (e) {
          e.stopPropagation();
          DynamicPage.del(p);
        });

        wrapper.appendChild(btnEdit);
        wrapper.appendChild(btnDel);
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
    editOriginalData = p && !isCopy ? Object.assign({}, p) : null;
    document.getElementById('dm-title').textContent = p ? 'Chỉnh Sửa' : 'Thêm Mới';
    document.getElementById('dm-id-hidden').value = p ? primaryKeyValue : '';

    schemaFields.forEach(function (f) {
      var input = document.getElementById('field-' + f.name);
      if (input) {
        var hasDataSource = f.dataSource && f.dataSource.length > 0;
        var dsType = (f.dropdownType || '').toLowerCase().trim();
        var isDynamicLookup = hasDataSource && (
          ['dropdown', 'dropselect', 'combo'].includes(dsType) ||
          (dsType === '' && _isQueryOrApi(f.dataSource))
        );
        var isStaticSelect = hasDataSource && (dsType === 'valuelist' || (dsType === '' && !isDynamicLookup));

        if (p) {
          var val = p[f.name];
          if (input.type === 'checkbox') {
            input.checked = val === 'true' || val === 1 || val === '1' || val === true;
          } else if (isStaticSelect) {
            var valStr = val !== undefined && val !== null ? String(val).trim() : '';
            var isTrue = valStr === 'true' || valStr === '1';
            input.value = isTrue ? 'true' : 'false';
          } else {
            input.value = val !== undefined && val !== null ? String(val) : '';
          }
          if (f.isReadOnlyEdit) {
            input.disabled = true;
          }
        } else {
          if (input.type === 'checkbox') {
            input.checked = false;
          } else if (isStaticSelect) {
            var options = _parseStaticOptions(f.dataSource);
            input.value = options.length > 0 ? options[0].value : 'false';
          } else {
            input.value = '';
          }
          if (f.isReadOnlyAdd) {
            input.disabled = true;
          } else {
            input.disabled = false;
          }
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
          var hasDataSource = f.dataSource && f.dataSource.length > 0;
          var dsType = (f.dropdownType || '').toLowerCase().trim();
          var isDynamicLookup = hasDataSource && (
            ['dropdown', 'dropselect', 'combo'].includes(dsType) ||
            (dsType === '' && _isQueryOrApi(f.dataSource))
          );
          var isStaticSelect = hasDataSource && (dsType === 'valuelist' || (dsType === '' && !isDynamicLookup));

          if (input.type === 'checkbox') {
            input.checked = val === 'true' || val === 1 || val === '1' || val === true;
          } else if (isStaticSelect) {
            var valStr = val !== undefined && val !== null ? String(val).trim() : '';
            var isTrue = valStr === 'true' || valStr === '1';
            input.value = isTrue ? 'true' : 'false';
          } else {
            input.value = val !== undefined && val !== null ? String(val) : '';
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
        var val = input.type === 'checkbox' ? input.checked : input.value.trim();
        if (f.required && (input.type === 'checkbox' ? false : !val)) {
          showToast('Vui lòng nhập đầy đủ: ' + f.label, 'error');
          isInvalid = true;
        }
        
        var isNumeric = NUMERIC_FORMATS.includes(f.renderRule);
        if (input.type === 'checkbox') {
          formInputData[f.name] = val;
        } else if (isNumeric) {
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

    var configuredEndpoint = idHidden
      ? (apiUpdate || apiSave || apiSearch)
      : (apiCreate || apiSave || apiSearch);
    var endpoint = configuredEndpoint.split('?')[0];

    // Trích xuất query params (Loai=SKU, Loai=Promotion...) để gửi kèm lên body
    if (configuredEndpoint && configuredEndpoint.includes('?')) {
      var parts = configuredEndpoint.split('?');
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
      var isCommonUpdate = !!idHidden && (
        endpoint.toLowerCase().includes('/api_capnhatdulieuchung') ||
        !endpoint.toLowerCase().includes('/api_')
      );

      if (isCommonUpdate) {
        endpoint = '/API_CapNhatDuLieuChung';
      }

      var isSP = endpoint.toLowerCase().includes('/api_');
      var payload;

      if (isCommonUpdate) {
        var originalKeys = {};
        schemaFields.forEach(function (field) {
          if (editOriginalData && Object.prototype.hasOwnProperty.call(editOriginalData, field.name)) {
            originalKeys[field.name] = editOriginalData[field.name];
          }
        });

        var updateValues = Object.assign({}, formInputData);
        String(primaryKey || '').split(';').forEach(function (keyName) {
          keyName = keyName.trim();
          if (keyName) delete updateValues[keyName];
        });

        payload = {
          q: JSON.stringify({
            FormName: formName,
            OriginalKeys: originalKeys,
            Values: updateValues
          })
        };
      } else {
        payload = isSP ? { q: JSON.stringify(formInputData) } : formInputData;
      }

      if (isSP) {
        await Http.post(endpoint, payload);
        showToast(idHidden ? 'Đã lưu thay đổi thành công' : 'Đã thêm mới thành công');
      } else {
        if (idHidden) {
          var updateUrl = endpoint + '/' + encodeURIComponent(idHidden);
          await Http.post(updateUrl, payload);
          showToast('Đã lưu thay đổi thành công');
        } else {
          await Http.post(endpoint, payload);
          showToast('Đã thêm mới thành công');
        }
      }

      closeModal('modal-dynamic');
      editOriginalData = null;
      _fetchAndRender();
    } catch (err) {
      console.error('Lưu dữ liệu thất bại:', err);
      showToast(err.message || 'Lưu dữ liệu thất bại. Vui lòng thử lại!', 'error');
    }
  }

  function del(rowData) {
    ConfirmModal.show({
      title: 'Xác nhận xóa',
      message: 'Bạn có chắc muốn xóa dòng dữ liệu này không?',
      confirmText: 'Xóa',
      confirmClass: 'btn-danger',
      onConfirm: async function () {
        var endpoint = '/API_XoaDuLieuChung';
        try {
          // API xóa chung tự xác định bảng từ FormName. Chỉ gửi các cột thật
          // có trong schema để tạo điều kiện khóa và tránh xóa nhầm nhiều dòng.
          var keys = {};
          var record = rowData && typeof rowData === 'object'
            ? rowData
            : { [primaryKey]: rowData };

          schemaFields.forEach(function (field) {
            if (Object.prototype.hasOwnProperty.call(record, field.name)) {
              keys[field.name] = record[field.name];
            }
          });

          if (!Object.prototype.hasOwnProperty.call(keys, primaryKey)) {
            keys[primaryKey] = record[primaryKey];
          }

          await Http.post(endpoint, {
            q: JSON.stringify({
              FormName: formName,
              Keys: keys
            })
          });
          showToast('Đã xóa dữ liệu thành công');
          _fetchAndRender();
        } catch (err) {
          console.error('Xóa dữ liệu thất bại:', err);
          showToast(err.message || 'Xóa dữ liệu thất bại. Vui lòng thử lại!', 'error');
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
      var rowKeys = Object.keys(row);
      // Ánh xạ động key của Grid (ItemName2 / MauSac từ Database chuẩn) sang đúng payload ten_hang_2 và mau
      var keyItemName = rowKeys.find(k => k.toLowerCase().replace(/_/g, '') === 'itemname2' || k.toLowerCase().replace(/_/g, '') === 'tenhang2') || 'ItemName2';
      var keyMau = rowKeys.find(k => k.toLowerCase().replace(/_/g, '') === 'mausac' || k.toLowerCase().replace(/_/g, '') === 'mau') || 'MauSac';
      
      return {
        ten_hang_2: row[keyItemName],
        mau: row[keyMau]
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
