/**
 * users.js - Renders and manages the directory of all registered users
 * Reads 'allUsers' from localStorage, renders a responsive table,
 * and allows row deletion and clearing all records safely.
 */

(function () {
  'use strict';

  const container = document.getElementById('usersContainer');
  const countBadge = document.getElementById('userCountBadge');
  const toastContainer = document.getElementById('toastContainer');

  if (!container) return;

  /**
   * Display a non-intrusive toast notification.
   * @param {string} message 
   * @param {string} type - 'success' | 'danger'
   */
  function showToast(message, type = 'success') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  /**
   * Safely load allUsers array from localStorage.
   * @returns {Array}
   */
  function getAllUsers() {
    try {
      const data = localStorage.getItem('allUsers');
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.error('Error reading allUsers from localStorage:', err);
      return [];
    }
  }

  /**
   * Safely write updated allUsers array back to localStorage.
   * @param {Array} users 
   */
  function saveAllUsers(users) {
    try {
      localStorage.setItem('allUsers', JSON.stringify(users));
      // If no users left, clear currentUser as well
      if (users.length === 0) {
        localStorage.removeItem('currentUser');
      } else {
        // Keep currentUser in sync with the latest remaining entry
        const latestUser = users[users.length - 1];
        localStorage.setItem('currentUser', JSON.stringify(latestUser));
      }
      return true;
    } catch (err) {
      console.error('Error saving allUsers to localStorage:', err);
      showToast('Storage error: Unable to update records', 'danger');
      return false;
    }
  }

  /**
   * Format ISO date string into readable short format.
   * @param {string} isoString 
   * @returns {string}
   */
  function formatDate(isoString) {
    if (!isoString) return '—';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return '—';
    }
  }

  /**
   * Update the badge counter in navbar.
   * @param {number} count 
   */
  function updateNavBadge(count) {
    if (!countBadge) return;
    if (count > 0) {
      countBadge.textContent = count;
      countBadge.style.display = 'inline-block';
    } else {
      countBadge.style.display = 'none';
    }
  }

  /**
   * Render the empty-state view when no users exist.
   */
  function renderEmptyState() {
    updateNavBadge(0);
    container.innerHTML = '';

    const card = document.createElement('div');
    card.className = 'card';

    const emptyBox = document.createElement('div');
    emptyBox.className = 'empty-state';

    const iconDiv = document.createElement('div');
    iconDiv.className = 'empty-icon';
    iconDiv.innerHTML = `
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    `;

    const title = document.createElement('h2');
    title.className = 'empty-title';
    title.textContent = 'No Users Registered Yet';

    const desc = document.createElement('p');
    desc.className = 'empty-description';
    desc.textContent = 'The user database is currently empty. Click below to add your first user through the registration form.';

    const link = document.createElement('a');
    link.href = 'index.html';
    link.className = 'btn btn-primary';
    link.innerHTML = `
      <svg class="btn-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"/>
      </svg>
      <span>Register First User</span>
    `;

    emptyBox.appendChild(iconDiv);
    emptyBox.appendChild(title);
    emptyBox.appendChild(desc);
    emptyBox.appendChild(link);

    card.appendChild(emptyBox);
    container.appendChild(card);
  }

  /**
   * Delete an individual user at a specific index.
   * @param {number} index 
   * @param {string} userName 
   */
  function deleteUser(index, userName) {
    const users = getAllUsers();
    if (index < 0 || index >= users.length) return;

    // Confirm deletion
    const confirmed = window.confirm(`Are you sure you want to delete the record for "${userName}"?`);
    if (!confirmed) return;

    users.splice(index, 1);
    saveAllUsers(users);
    showToast(`Deleted "${userName}" successfully.`, 'danger');
    renderTable();
  }

  /**
   * Clear all records from database.
   */
  function clearAllUsers() {
    const users = getAllUsers();
    if (users.length === 0) return;

    const confirmed = window.confirm(`Are you sure you want to remove ALL ${users.length} registered user(s)? This action cannot be undone.`);
    if (!confirmed) return;

    saveAllUsers([]);
    showToast('All registered user records have been cleared.', 'danger');
    renderTable();
  }

  /**
   * Render the users table and action controls.
   */
  function renderTable() {
    const users = getAllUsers();

    if (users.length === 0) {
      renderEmptyState();
      return;
    }

    updateNavBadge(users.length);
    container.innerHTML = '';

    // Action Header Bar: count info + buttons
    const headerBar = document.createElement('div');
    headerBar.className = 'table-header-bar';

    const stats = document.createElement('div');
    stats.className = 'table-stats';
    stats.textContent = `Showing all ${users.length} registered user${users.length === 1 ? '' : 's'}`;

    const btnGroup = document.createElement('div');
    btnGroup.style.display = 'flex';
    btnGroup.style.gap = '0.75rem';

    const addMoreBtn = document.createElement('a');
    addMoreBtn.href = 'index.html';
    addMoreBtn.className = 'btn btn-secondary btn-sm';
    addMoreBtn.innerHTML = `
      <svg class="btn-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"/>
      </svg>
      <span>Add New</span>
    `;

    const clearAllBtn = document.createElement('button');
    clearAllBtn.type = 'button';
    clearAllBtn.className = 'btn btn-danger-outline btn-sm';
    clearAllBtn.innerHTML = `
      <svg class="btn-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
      </svg>
      <span>Clear All Records</span>
    `;
    clearAllBtn.addEventListener('click', clearAllUsers);

    btnGroup.appendChild(addMoreBtn);
    btnGroup.appendChild(clearAllBtn);

    headerBar.appendChild(stats);
    headerBar.appendChild(btnGroup);

    // Responsive Table Wrapper
    const tableWrapper = document.createElement('div');
    tableWrapper.className = 'table-wrapper';

    const table = document.createElement('table');
    table.className = 'data-table';
    table.setAttribute('aria-label', 'Registered Users Table');

    // Thead
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    const columns = [
      'S.No',
      'Full Name',
      'Gender',
      'Mobile Number',
      'Email ID',
      'Location (City, State, Country)',
      'Registered',
      'Action'
    ];

    columns.forEach(colText => {
      const th = document.createElement('th');
      th.scope = 'col';
      th.textContent = colText;
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Tbody
    const tbody = document.createElement('tbody');

    users.forEach((user, index) => {
      const row = document.createElement('tr');

      // 1. S.No
      const snoCell = document.createElement('td');
      snoCell.className = 'sno-cell';
      snoCell.textContent = String(index + 1);
      row.appendChild(snoCell);

      // 2. Full Name
      const nameCell = document.createElement('td');
      nameCell.className = 'name-cell';
      nameCell.textContent = user.fullName || '—'; // textContent avoids XSS
      row.appendChild(nameCell);

      // 3. Gender (with styled badge)
      const genderCell = document.createElement('td');
      const badge = document.createElement('span');
      const gClass = user.gender ? 'badge-gender-' + user.gender.toLowerCase() : 'badge-primary';
      badge.className = `badge ${gClass}`;
      badge.textContent = user.gender || '—';
      genderCell.appendChild(badge);
      row.appendChild(genderCell);

      // 4. Mobile
      const mobileCell = document.createElement('td');
      mobileCell.textContent = user.mobile || '—';
      row.appendChild(mobileCell);

      // 5. Email
      const emailCell = document.createElement('td');
      emailCell.textContent = user.email || '—';
      row.appendChild(emailCell);

      // 6. Location
      const locationCell = document.createElement('td');
      const locParts = [user.city, user.state, user.country].filter(Boolean);
      locationCell.textContent = locParts.length > 0 ? locParts.join(', ') : '—';
      row.appendChild(locationCell);

      // 7. Registered Date
      const dateCell = document.createElement('td');
      dateCell.textContent = formatDate(user.submittedAt);
      row.appendChild(dateCell);

      // 8. Action (Delete Button)
      const actionCell = document.createElement('td');
      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.className = 'btn btn-danger-outline btn-sm';
      deleteBtn.setAttribute('aria-label', `Delete ${user.fullName}`);
      deleteBtn.innerHTML = `
        <svg class="btn-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
        </svg>
        <span>Delete</span>
      `;
      deleteBtn.addEventListener('click', () => deleteUser(index, user.fullName));
      actionCell.appendChild(deleteBtn);
      row.appendChild(actionCell);

      tbody.appendChild(row);
    });

    table.appendChild(tbody);
    tableWrapper.appendChild(table);

    container.appendChild(headerBar);
    container.appendChild(tableWrapper);
  }

  // Initial render
  renderTable();

})();
