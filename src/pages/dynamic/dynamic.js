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
  var searchDebounceTimer = null;
  var fetchRequestId = 0;
  var SEARCH_DEBOUNCE_MS = 350;

  // Danh sách các FormatID số trong CSDL chuẩn
  var NUMERIC_FORMATS = ['B', 'U', 'Q', 'N', '1D', '2D', '3D', '4D', '5D', '6D', 'N3', 'N4', 'N5', 'N6', 'P', 'P1', 'P2', 'PN', 'Y'];

  function _isNumericField(field) {
    return String(field.formatType || '').toUpperCase() === 'N' ||
      NUMERIC_FORMATS.includes(String(field.renderRule || '').toUpperCase());
  }

  function _getPrimaryKeyNames() {
    return String(primaryKey || '')
      .split(';')
      .map(function (keyName) { return keyName.trim(); })
      .filter(Boolean);
  }

  function _formatDateForInput(value) {
    var raw = String(value === undefined || value === null ? '' : value).trim();
    if (!raw) return '';

    var isoMatch = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) return isoMatch[3] + '/' + isoMatch[2] + '/' + isoMatch[1];
    return raw;
  }

  function _parseDateFromInput(value) {
    var raw = String(value || '').trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;

    var match = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!match) return null;

    var day = Number(match[1]);
    var month = Number(match[2]);
    var year = Number(match[3]);
    var date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
      return null;
    }
    return year + '-' + String(month).padStart(2, '0') + '-' + String(day).padStart(2, '0');
  }

  function _formatDateInputs() {
    document.querySelectorAll('input[data-dynamic-date="true"]').forEach(function (input) {
      input.value = _formatDateForInput(input.value);
    });
    document.querySelectorAll('input[data-dynamic-date-picker="true"]').forEach(function (input) {
      input.dispatchEvent(new Event('change'));
    });
  }

  function _numberOptions(field) {
    var format = String(field.formatString || '');
    var decimalPart = format.indexOf('.') >= 0
      ? format.substring(format.indexOf('.') + 1).replace(/[^0#]/g, '')
      : '';
    var fixedDecimals = (decimalPart.match(/0/g) || []).length;
    var optionalDecimals = (decimalPart.match(/#/g) || []).length;
    var configuredDecimals = Number(field.numberDecimal);
    var minimumFractionDigits = fixedDecimals;
    var maximumFractionDigits = fixedDecimals + optionalDecimals;

    if (!decimalPart && Number.isFinite(configuredDecimals)) {
      maximumFractionDigits = configuredDecimals;
    }
    if (!Number.isFinite(maximumFractionDigits) || maximumFractionDigits < 0) {
      maximumFractionDigits = 0;
    }

    return {
      minimumFractionDigits: minimumFractionDigits,
      maximumFractionDigits: Math.max(minimumFractionDigits, maximumFractionDigits),
      suffix: format.includes('%') ? '%' : ''
    };
  }

  function _parseFormattedNumber(value) {
    var raw = String(value === undefined || value === null ? '' : value)
      .trim()
      .replace(/\s/g, '')
      .replace(/%/g, '');
    if (raw === '') return null;

    if (raw.includes(',')) {
      raw = raw.replace(/\./g, '').replace(',', '.');
    } else if (raw.includes('.')) {
      var parts = raw.split('.');
      if (parts.length > 2 || (parts.length === 2 && parts[1].length === 3)) {
        raw = raw.replace(/\./g, '');
      }
    }

    var parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : NaN;
  }

  function _formatNumber(value, field) {
    var numericValue = _parseFormattedNumber(value);
    if (numericValue === null || Number.isNaN(numericValue)) return '';

    var options = _numberOptions(field);
    var formatted = new Intl.NumberFormat('vi-VN', {
      minimumFractionDigits: options.minimumFractionDigits,
      maximumFractionDigits: options.maximumFractionDigits
    }).format(numericValue);
    return formatted + options.suffix;
  }

  function _formatNumericInputs() {
    document.querySelectorAll('input[data-dynamic-number="true"]').forEach(function (input) {
      if (input.value !== '') input.dispatchEvent(new Event('blur'));
    });
  }

  function _readVietnameseThreeDigits(number, readFull) {
    var hundreds = Math.floor(number / 100);
    var tens = Math.floor((number % 100) / 10);
    var units = number % 10;
    var digits = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
    var result = [];

    if (hundreds > 0 || readFull) {
      result.push(digits[hundreds] + ' trăm');
    }
    if (tens > 1) {
      result.push(digits[tens] + ' mươi');
      if (units === 1) result.push('mốt');
      else if (units === 5) result.push('lăm');
      else if (units > 0) result.push(digits[units]);
    } else if (tens === 1) {
      result.push('mười');
      if (units === 5) result.push('lăm');
      else if (units > 0) result.push(digits[units]);
    } else if (units > 0) {
      if (hundreds > 0 || readFull) result.push('lẻ');
      result.push(units === 5 && (hundreds > 0 || readFull) ? 'năm' : digits[units]);
    }

    return result.join(' ');
  }

  function _readVietnameseNumber(value) {
    var number = Math.floor(Math.abs(Number(value)));
    if (!Number.isFinite(number)) return '';
    if (number === 0) return 'Không';

    var groupNames = ['', 'nghìn', 'triệu', 'tỷ', 'nghìn tỷ', 'triệu tỷ'];
    var groups = [];
    while (number > 0) {
      groups.push(number % 1000);
      number = Math.floor(number / 1000);
    }

    var words = [];
    for (var index = groups.length - 1; index >= 0; index--) {
      if (groups[index] === 0) continue;
      var readFull = index < groups.length - 1 && groups[index] < 100;
      words.push(_readVietnameseThreeDigits(groups[index], readFull));
      if (groupNames[index]) words.push(groupNames[index]);
    }

    var result = words.join(' ').replace(/\s+/g, ' ').trim();
    return result.charAt(0).toUpperCase() + result.slice(1);
  }

  function _isMoneyField(field) {
    var formatId = String(field.renderRule || '').toUpperCase();
    return formatId === 'B' || formatId === 'U';
  }

  function render($el, route) {
    if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
    fetchRequestId++;
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
        var rawFields = Array.isArray(resConfig)
          ? resConfig
          : (resConfig && (resConfig.data || resConfig.records || resConfig.list || resConfig.result)) || [];
        if (!Array.isArray(rawFields)) rawFields = [];
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
            var numberWords = null;
            var dateControl = null;
            input.id = 'field-' + f.name;
            input.name = f.name;
            input.placeholder = f.label;
            if (f.required) input.required = true;

            if (f.renderRule === 'D') {
              if (window.UIInput && typeof UIInput.createDate === 'function') {
                dateControl = UIInput.createDate({
                  id: input.id,
                  name: f.name,
                  placeholder: 'dd/MM/yyyy',
                  required: f.required
                });
                var hiddenDateInput = dateControl.querySelector('input[type="hidden"]');
                if (hiddenDateInput) hiddenDateInput.dataset.dynamicDatePicker = 'true';
              } else {
                input.type = 'text';
                input.inputMode = 'numeric';
                input.placeholder = 'dd/MM/yyyy';
                input.dataset.dynamicDate = 'true';
                input.maxLength = 10;
                input.addEventListener('input', function () {
                  var digits = this.value.replace(/\D/g, '').slice(0, 8);
                  var parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean);
                  this.value = parts.join('/');
                });
              }
            } else if (f.renderRule === 'DT') {
              input.type = 'datetime-local';
            } else if (f.renderRule === 'H') {
              input.type = 'time';
            } else if (_isNumericField(f)) {
              // input[type=number] không hỗ trợ dấu phân cách hàng nghìn.
              // Dùng text + inputMode để hiển thị đúng FormatString của ERP.
              input.type = 'text';
              input.inputMode = 'decimal';
              input.dataset.dynamicNumber = 'true';
              input.addEventListener('beforeinput', function (event) {
                // Chỉ nhận số, dấu phân cách thập phân và dấu âm đầu chuỗi.
                if (event.data && !/^[0-9.,-]+$/.test(event.data)) {
                  event.preventDefault();
                }
              });
              input.addEventListener('input', function () {
                // Fallback cho paste/IME: lọc lại nếu trình duyệt không hỗ trợ beforeinput.
                var cleanValue = this.value
                  .replace(/[^0-9.,-]/g, '')
                  .replace(/(?!^)-/g, '');
                if (cleanValue !== this.value) this.value = cleanValue;
              });
              input.addEventListener('focus', function () {
                // Giữ dấu phân cách đang hiển thị; chọn toàn bộ để người dùng
                // gõ đè nhanh mà không gặp vấn đề vị trí con trỏ giữa các dấu.
                this.select();
              });
              input.addEventListener('blur', function () {
                this.value = _formatNumber(this.value, f);
              });

              if (_isMoneyField(f)) {
                numberWords = document.createElement('small');
                numberWords.className = 'dynamic-number-words';
                var updateWords = function () {
                  var numericValue = _parseFormattedNumber(input.value);
                  numberWords.textContent = numericValue === null || Number.isNaN(numericValue)
                    ? ''
                    : _readVietnameseNumber(numericValue) + ' đồng';
                };
                input.addEventListener('input', updateWords);
                input.addEventListener('blur', updateWords);
              }
            } else {
              input.type = 'text';
            }

            if (dateControl) fieldWrapper.appendChild(dateControl);
            else fieldWrapper.appendChild(input);
            if (numberWords) fieldWrapper.appendChild(numberWords);
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
    var requestId = ++fetchRequestId;
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
      // Bỏ qua response cũ nếu người dùng đã đổi từ khóa hoặc chuyển trang.
      if (requestId !== fetchRequestId) return;
      
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
      if (requestId !== fetchRequestId) return;
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
        var isNumeric = _isNumericField(f);
        var hasDataSource = f.dataSource && f.dataSource.length > 0;
        var dsType = (f.dropdownType || '').toLowerCase().trim();

        var isDynamicLookup = hasDataSource && (
          ['dropdown', 'dropselect', 'combo'].includes(dsType) ||
          (dsType === '' && _isQueryOrApi(f.dataSource))
        );
        var isStaticSelect = hasDataSource && (dsType === 'valuelist' || (dsType === '' && !isDynamicLookup));

        if (isNumeric) {
          col.cellStyle = Object.assign({}, col.cellStyle, { textAlign: 'right' });
          col.valueFormatter = function (params) { return _formatNumber(params.value, f); };
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
    var clearButton = document.getElementById('dynamic-search-clear');
    if (clearButton) clearButton.hidden = searchVal.trim() === '';
    if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(function () {
      searchDebounceTimer = null;
      _fetchAndRender();
    }, SEARCH_DEBOUNCE_MS);
  }

  function clearSearch() {
    var searchInput = document.getElementById('dynamic-search');
    if (searchInput) {
      searchInput.value = '';
      searchInput.focus();
    }
    onSearch('');
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

    _formatNumericInputs();
    _formatDateInputs();

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

    _formatNumericInputs();
    _formatDateInputs();
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
        
        var isNumeric = _isNumericField(f);
        if (input.type === 'checkbox') {
          formInputData[f.name] = val;
        } else if (isNumeric) {
          var numericValue = _parseFormattedNumber(val);
          if (val !== '' && Number.isNaN(numericValue)) {
            showToast('Giá trị số không hợp lệ: ' + f.label, 'error');
            isInvalid = true;
          } else {
            formInputData[f.name] = numericValue === null ? 0 : numericValue;
          }
        } else if (f.renderRule === 'D') {
          var normalizedDate = val === '' ? '' : _parseDateFromInput(val);
          if (val !== '' && !normalizedDate) {
            showToast('Ngày không hợp lệ: ' + f.label + ' (dd/MM/yyyy)', 'error');
            isInvalid = true;
          } else {
            formInputData[f.name] = normalizedDate || '';
          }
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
      var isCommonCreate = !idHidden && endpoint.toLowerCase().includes('/api_themdulieuchung');

      if (isCommonUpdate) {
        endpoint = '/API_CapNhatDuLieuChung';
      }

      var isSP = endpoint.toLowerCase().includes('/api_');
      var payload;

      if (isCommonUpdate) {
        var originalKeys = {};
        var primaryKeyNames = _getPrimaryKeyNames();

        primaryKeyNames.forEach(function (keyName) {
          if (!editOriginalData || !Object.prototype.hasOwnProperty.call(editOriginalData, keyName)) {
            throw new Error('Không tìm thấy giá trị khóa chính gốc: ' + keyName);
          }
          originalKeys[keyName] = editOriginalData[keyName];
        });

        var updateValues = Object.assign({}, formInputData);
        primaryKeyNames.forEach(function (keyName) {
          delete updateValues[keyName];
        });

        payload = {
          q: JSON.stringify({
            FormName: formName,
            OriginalKeys: originalKeys,
            Values: updateValues
          })
        };
      } else if (isCommonCreate) {
        var createValues = {};
        Object.keys(formInputData).forEach(function (key) {
          // CopyFrom_* chỉ dành cho API nghiệp vụ; API chung chỉ nhận cột thật của bảng.
          if (!key.startsWith('CopyFrom_')) createValues[key] = formInputData[key];
        });
        payload = {
          q: JSON.stringify({
            FormName: formName,
            Values: createValues
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
        var endpoint = apiDelete || '/API_XoaDuLieuChung';
        try {
          // Chỉ gửi khóa chính. API chung và API nghiệp vụ đều nhận cùng payload,
          // còn endpoint được quyết định bởi metadata của form.
          var keys = {};
          var record = rowData && typeof rowData === 'object'
            ? rowData
            : { [primaryKey]: rowData };

          var keyNames = _getPrimaryKeyNames();

          if (keyNames.length === 0) {
            throw new Error('Form chưa cấu hình khóa chính để xóa dữ liệu.');
          }

          keyNames.forEach(function (keyName) {
            if (!Object.prototype.hasOwnProperty.call(record, keyName)) {
              throw new Error('Không tìm thấy giá trị khóa chính: ' + keyName);
            }
            keys[keyName] = record[keyName];
          });

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
    clearSearch: clearSearch,
    openModal: openModal,
    copyItem: copyItem,
    save: save,
    del: del,
    updateProductWebStatus: updateProductWebStatus
  };
})();
