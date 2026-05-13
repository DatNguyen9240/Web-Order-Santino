/**
 * UserMenu Component
 * Manages the top-right user dropdown
 */
const UserMenu = (() => {
  function render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const userRaw = localStorage.getItem('santino_user');
    let user = { name: 'Administrator', role: 'Quản trị viên', id: 'admin' };
    let initials = '??';

    if (userRaw) {
      try {
        user = JSON.parse(userRaw);
        if (typeof Utils !== 'undefined' && Utils.getUserInitials) {
          initials = Utils.getUserInitials();
        }
      } catch (e) {
        console.error('[UserMenu] Error parsing user data', e);
      }
    }

    const triggerId = `user-menu-trigger-${containerId}`;
    container.innerHTML = `
      <div class="navbar-user" id="${triggerId}">
        <div class="user-avatar-nav">
          <div class="avatar-text">${initials}</div>
        </div>
        <div class="user-info-nav">
          <span class="user-name-nav">${user.name}</span>
          <span class="user-role-nav">${user.role}</span>
        </div>
        <span class="material-symbols-outlined expand-icon">expand_more</span>

        <div class="user-dropdown">
          <a href="#/settings" class="user-dropdown-item">
            <span class="material-symbols-outlined">settings</span>
            <span data-i18n="nav.settings">Cài đặt</span>
          </a>
          <div class="dropdown-divider"></div>
          <a href="login.html" class="user-dropdown-item danger" onclick="UserMenu.logout(event)">
            <span class="material-symbols-outlined">logout</span>
            <span data-i18n="nav.logout">Đăng xuất</span>
          </a>
        </div>
      </div>
    `;

    // Bind events - dùng container để tìm đúng trigger bên trong nó
    const trigger = container.querySelector('.navbar-user');
    if (trigger) {
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        // Đóng các menu khác trước khi mở menu này (nếu cần)
        document.querySelectorAll('.navbar-user').forEach(el => {
           if(el !== trigger) el.classList.remove('open');
        });
        trigger.classList.toggle('open');
      });
    }

    // Đóng khi click ngoài
    if (!window._userMenuGlobalEventSet) {
      document.addEventListener('click', () => {
        document.querySelectorAll('.navbar-user').forEach(el => el.classList.remove('open'));
      });
      window._userMenuGlobalEventSet = true;
    }
  }

  function logout(e) {
    if (e) e.preventDefault();
    // Clear tokens from cookies
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    localStorage.removeItem('santino_user');
    window.location.href = 'login.html';
  }

  return { render, logout };
})();
