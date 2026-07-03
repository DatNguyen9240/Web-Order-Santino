(function () {
  const usernameInput = document.getElementById('login-username');
  const passwordInput = document.getElementById('login-password');
  const rememberCheckbox = document.getElementById('remember-me');
  const errEl = document.getElementById('login-error');
  const btnText = document.getElementById('btn-login-text');
  const btnSpinner = document.getElementById('login-spinner');
  const btn = document.getElementById('btn-login');

  const b64Encode = (str) => btoa(unescape(encodeURIComponent(str)));
  const b64Decode = (str) => { try { return decodeURIComponent(escape(atob(str))); } catch (e) { return ''; } };

  setTimeout(() => {
    const rememberedUser = localStorage.getItem('santino_remember_user');
    const rememberedPw = localStorage.getItem('santino_remember_pw');
    if (rememberedUser && rememberedPw) {
      usernameInput.value = rememberedUser;
      passwordInput.value = b64Decode(rememberedPw);
      rememberCheckbox.checked = true;
    }
  }, 100);

  document.getElementById('login-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    var user = usernameInput.value.trim();
    var pass = passwordInput.value;

    errEl.style.display = 'none';

    if (user && pass) {
      btnText.innerText = 'Đang xác thực...';
      btnSpinner.style.display = 'block';
      btn.disabled = true;

      try {
        // Lấy API BASE và Endpoint từ env.js
        const API_BASE = API_CONFIG.BASE_URL;
        const loginEndpoint = API_CONFIG.ENDPOINTS.AUTH.LOGIN;

        const url = API_BASE + loginEndpoint;

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: user,
            password: pass
          })
        });

        const data = await response.json();

        if (data.code === 0 && data.access_token) {
          const { access_token, refresh_token, code, msg, ...userInfo } = data;

          // Giá trị ObjectID mới sẽ được lấy từ DB
          localStorage.setItem('santino_user', JSON.stringify({
            name: data.DisplayName || user,
            id: data.UserName || user,
            role: data.UserGroupID || data.Group || '',
            ...userInfo,
          }));

          // Lưu access_token và refresh_token vào Cookie (hạn 7 ngày)
          document.cookie = `auth_token=${data.access_token}; path=/; max-age=${7 * 24 * 60 * 60}`;
          if (data.refresh_token) {
            document.cookie = `refresh_token=${data.refresh_token}; path=/; max-age=${7 * 24 * 60 * 60}`;
          }

          if (rememberCheckbox.checked) {
            localStorage.setItem('santino_remember_user', user);
            localStorage.setItem('santino_remember_pw', b64Encode(pass));
          } else {
            localStorage.removeItem('santino_remember_user');
            localStorage.removeItem('santino_remember_pw');
          }

          window.location.href = 'index.html';
        } else {
          throw new Error(data.msg || 'Thông tin đăng nhập không hợp lệ');
        }
      } catch (error) {
        errEl.innerText = error.message || 'Lỗi kết nối đến máy chủ';
        errEl.style.display = 'block';
      } finally {
        btnText.innerText = 'Đăng nhập B2B';
        btnSpinner.style.display = 'none';
        btn.disabled = false;
      }
    }
  });
})();
