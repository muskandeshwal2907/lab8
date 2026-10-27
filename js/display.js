/**
 * display.js - Reads and displays the most recent registered user from localStorage
 * Renders user information safely using textContent to prevent XSS.
 * Shows an empty state with a call to action if no data is found.
 */

(function () {
  'use strict';

  const container = document.getElementById('displayContainer');
  if (!container) return;

  /**
   * Safely retrieve the current user from localStorage.
   * @returns {Object|null}
   */
  function getCurrentUser() {
    try {
      const data = localStorage.getItem('currentUser');
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.error('Error reading currentUser from localStorage:', err);
      return null;
    }
  }

  /**
   * Format ISO date string into a readable local string.
   * @param {string} isoString 
   * @returns {string}
   */
  function formatDate(isoString) {
    if (!isoString) return 'Just now';
    try {
      const date = new Date(isoString);
      return date.toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short'
      });
    } catch (e) {
      return 'Recently';
    }
  }

  /**
   * Render an empty-state message if no registration data is present.
   */
  function renderEmptyState() {
    container.innerHTML = ''; // Container is trusted internal node

    const card = document.createElement('div');
    card.className = 'card';

    const emptyBox = document.createElement('div');
    emptyBox.className = 'empty-state';

    const iconDiv = document.createElement('div');
    iconDiv.className = 'empty-icon';
    iconDiv.innerHTML = `
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    `;

    const title = document.createElement('h2');
    title.className = 'empty-title';
    title.textContent = 'No Recent Submission Found';

    const desc = document.createElement('p');
    desc.className = 'empty-description';
    desc.textContent = 'It seems like no user has been registered yet or the session storage was cleared. Please complete the registration form to view details.';

    const link = document.createElement('a');
    link.href = 'index.html';
    link.className = 'btn btn-primary';
    link.textContent = 'Go to Registration Form';

    emptyBox.appendChild(iconDiv);
    emptyBox.appendChild(title);
    emptyBox.appendChild(desc);
    emptyBox.appendChild(link);

    card.appendChild(emptyBox);
    container.appendChild(card);
  }

  /**
   * Helper to build a safe detail field block.
   * @param {string} label 
   * @param {string} value 
   * @param {HTMLElement|null} customValueNode - Optional custom formatted element
   * @returns {HTMLElement}
   */
  function createDetailItem(label, value, customValueNode) {
    const item = document.createElement('div');
    item.className = 'detail-item';

    const labelElem = document.createElement('div');
    labelElem.className = 'detail-label';
    labelElem.textContent = label;

    item.appendChild(labelElem);

    if (customValueNode) {
      item.appendChild(customValueNode);
    } else {
      const valElem = document.createElement('div');
      valElem.className = 'detail-value';
      // Strictly textContent to avoid XSS
      valElem.textContent = value || '—';
      item.appendChild(valElem);
    }

    return item;
  }

  /**
   * Render the populated user profile card.
   * @param {Object} user 
   */
  function renderUserCard(user) {
    container.innerHTML = '';

    const card = document.createElement('div');
    card.className = 'card';

    // Header section: Avatar initial & primary name
    const header = document.createElement('div');
    header.className = 'display-header';

    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    const initial = (user.fullName && user.fullName.charAt(0)) ? user.fullName.charAt(0).toUpperCase() : 'U';
    avatar.textContent = initial;

    const titleBox = document.createElement('div');
    const nameHeading = document.createElement('h2');
    nameHeading.className = 'display-info-title';
    nameHeading.textContent = user.fullName || 'Registered User';

    const meta = document.createElement('div');
    meta.className = 'display-meta';

    // Gender Badge
    const genderBadge = document.createElement('span');
    const genderClass = user.gender ? 'badge-gender-' + user.gender.toLowerCase() : 'badge-primary';
    genderBadge.className = `badge ${genderClass}`;
    genderBadge.textContent = user.gender || 'Not Specified';

    // Registration Timestamp
    const timeSpan = document.createElement('span');
    timeSpan.textContent = `• Submitted on ${formatDate(user.submittedAt)}`;

    meta.appendChild(genderBadge);
    meta.appendChild(timeSpan);

    titleBox.appendChild(nameHeading);
    titleBox.appendChild(meta);

    header.appendChild(avatar);
    header.appendChild(titleBox);
    card.appendChild(header);

    // Detail Grid
    const grid = document.createElement('div');
    grid.className = 'detail-grid';

    grid.appendChild(createDetailItem('Full Name', user.fullName));
    grid.appendChild(createDetailItem('Gender', user.gender));
    grid.appendChild(createDetailItem('Mobile Number', user.mobile));
    grid.appendChild(createDetailItem('Email ID', user.email));
    grid.appendChild(createDetailItem('City', user.city));
    grid.appendChild(createDetailItem('State / UT', user.state));
    grid.appendChild(createDetailItem('Country', user.country));

    card.appendChild(grid);

    // Action buttons footer
    const actions = document.createElement('div');
    actions.className = 'form-actions';
    actions.style.marginTop = '2rem';
    actions.style.paddingTop = '1.5rem';
    actions.style.borderTop = '1px solid var(--border-color)';

    const registerAnotherBtn = document.createElement('a');
    registerAnotherBtn.href = 'index.html';
    registerAnotherBtn.className = 'btn btn-secondary';
    registerAnotherBtn.innerHTML = `
      <svg class="btn-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M10 2a4 4 0 00-4 4v1H5a2 2 0 00-2 2v7a2 2 0 002 2h10a2 2 0 002-2v-7a2 2 0 00-2-2h-1V6a4 4 0 00-4-4zm-2 5V6a2 2 0 114 0v1H8z"/>
      </svg>
      <span>Register Another User</span>
    `;

    const viewAllBtn = document.createElement('a');
    viewAllBtn.href = 'users.html';
    viewAllBtn.className = 'btn btn-primary';
    viewAllBtn.innerHTML = `
      <svg class="btn-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
      </svg>
      <span>View All Users</span>
    `;

    actions.appendChild(registerAnotherBtn);
    actions.appendChild(viewAllBtn);

    card.appendChild(actions);
    container.appendChild(card);
  }

  // --- Initial Execution ---
  const user = getCurrentUser();
  if (user && user.fullName) {
    renderUserCard(user);
  } else {
    renderEmptyState();
  }

})();
