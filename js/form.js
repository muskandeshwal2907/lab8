/**
 * form.js - Form validation and localStorage persistence for UserPortal
 * Handles real-time validation (on blur & input), form submission,
 * and storing user data safely in browser localStorage.
 */

(function () {
  'use strict';

  // --- DOM Element References ---
  const form = document.getElementById('registrationForm');
  const fullNameInput = document.getElementById('fullName');
  const mobileInput = document.getElementById('mobile');
  const emailInput = document.getElementById('email');
  const cityInput = document.getElementById('city');
  const stateSelect = document.getElementById('state');
  const countrySelect = document.getElementById('country');
  const genderRadios = document.querySelectorAll('input[name="gender"]');

  if (!form) return;

  // --- Validation Helper Rules ---
  // 1. Full Name: letters and spaces only, at least 3 characters
  const NAME_REGEX = /^[A-Za-z\s]{3,}$/;
  // 2. Mobile Number: exactly 10 digits starting with 6, 7, 8, or 9
  const MOBILE_REGEX = /^[6-9]\d{9}$/;
  // 3. Email: standard RFC 5322 compatible regex
  const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;

  /**
   * Display an error message and apply invalid styling to an input.
   * @param {HTMLElement} element - The form control element
   * @param {string} errorElementId - ID of the error message container
   * @param {string} message - Validation error description
   */
  function showError(element, errorElementId, message) {
    const errorBox = document.getElementById(errorElementId);
    if (element && element.classList) {
      element.classList.add('is-invalid');
      element.classList.remove('is-valid');
    }
    if (errorBox) {
      errorBox.textContent = message;
      errorBox.classList.add('visible');
    }
  }

  /**
   * Clear error message and apply valid styling to an input.
   * @param {HTMLElement} element - The form control element
   * @param {string} errorElementId - ID of the error message container
   */
  function clearError(element, errorElementId) {
    const errorBox = document.getElementById(errorElementId);
    if (element && element.classList) {
      element.classList.remove('is-invalid');
      element.classList.add('is-valid');
    }
    if (errorBox) {
      errorBox.textContent = '';
      errorBox.classList.remove('visible');
    }
  }

  // --- Field Validator Functions ---

  function validateFullName() {
    const val = fullNameInput.value.trim();
    if (!val) {
      showError(fullNameInput, 'error-fullName', 'Full name is required.');
      return false;
    }
    if (val.length < 3) {
      showError(fullNameInput, 'error-fullName', 'Full name must be at least 3 characters.');
      return false;
    }
    if (!NAME_REGEX.test(val)) {
      showError(fullNameInput, 'error-fullName', 'Full name must contain letters and spaces only.');
      return false;
    }
    clearError(fullNameInput, 'error-fullName');
    return true;
  }

  function validateGender() {
    const selected = document.querySelector('input[name="gender"]:checked');
    const genderContainer = document.getElementById('genderGroup');
    if (!selected) {
      showError(genderContainer, 'error-gender', 'Please select your gender.');
      return false;
    }
    clearError(genderContainer, 'error-gender');
    return true;
  }

  function validateMobile() {
    const val = mobileInput.value.trim();
    if (!val) {
      showError(mobileInput, 'error-mobile', 'Mobile number is required.');
      return false;
    }
    if (!MOBILE_REGEX.test(val)) {
      showError(mobileInput, 'error-mobile', 'Enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.');
      return false;
    }
    clearError(mobileInput, 'error-mobile');
    return true;
  }

  function validateEmail() {
    const val = emailInput.value.trim();
    if (!val) {
      showError(emailInput, 'error-email', 'Email ID is required.');
      return false;
    }
    if (!EMAIL_REGEX.test(val)) {
      showError(emailInput, 'error-email', 'Please enter a valid email address (e.g. name@example.com).');
      return false;
    }
    clearError(emailInput, 'error-email');
    return true;
  }

  function validateCity() {
    const val = cityInput.value.trim();
    if (!val) {
      showError(cityInput, 'error-city', 'City name is required.');
      return false;
    }
    if (val.length < 2) {
      showError(cityInput, 'error-city', 'City must be at least 2 characters.');
      return false;
    }
    clearError(cityInput, 'error-city');
    return true;
  }

  function validateState() {
    const val = stateSelect.value;
    if (!val) {
      showError(stateSelect, 'error-state', 'Please select a state or union territory.');
      return false;
    }
    clearError(stateSelect, 'error-state');
    return true;
  }

  function validateCountry() {
    const val = countrySelect.value;
    if (!val) {
      showError(countrySelect, 'error-country', 'Please select a country.');
      return false;
    }
    clearError(countrySelect, 'error-country');
    return true;
  }

  // --- Attach Blur & Input Event Listeners for Live Feedback ---

  fullNameInput.addEventListener('blur', validateFullName);
  fullNameInput.addEventListener('input', function () {
    if (fullNameInput.classList.contains('is-invalid')) {
      validateFullName();
    }
  });

  mobileInput.addEventListener('blur', validateMobile);
  mobileInput.addEventListener('input', function (e) {
    // Restrict typing to digits only
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
    if (mobileInput.classList.contains('is-invalid')) {
      validateMobile();
    }
  });

  emailInput.addEventListener('blur', validateEmail);
  emailInput.addEventListener('input', function () {
    if (emailInput.classList.contains('is-invalid')) {
      validateEmail();
    }
  });

  cityInput.addEventListener('blur', validateCity);
  cityInput.addEventListener('input', function () {
    if (cityInput.classList.contains('is-invalid')) {
      validateCity();
    }
  });

  stateSelect.addEventListener('change', validateState);
  stateSelect.addEventListener('blur', validateState);

  countrySelect.addEventListener('change', validateCountry);
  countrySelect.addEventListener('blur', validateCountry);

  genderRadios.forEach(function (radio) {
    radio.addEventListener('change', function () {
      validateGender();
      // Update visual active state on radio labels
      document.querySelectorAll('.radio-label').forEach(lbl => lbl.classList.remove('selected'));
      if (radio.parentElement) {
        radio.parentElement.classList.add('selected');
      }
    });
  });

  // --- Form Reset Handler ---
  form.addEventListener('reset', function () {
    // Clear validation classes and messages after reset tick
    setTimeout(function () {
      const controls = form.querySelectorAll('.form-control, #genderGroup');
      controls.forEach(ctrl => {
        ctrl.classList.remove('is-valid', 'is-invalid');
      });
      const errors = form.querySelectorAll('.error-message');
      errors.forEach(err => {
        err.textContent = '';
        err.classList.remove('visible');
      });
      document.querySelectorAll('.radio-label').forEach(lbl => lbl.classList.remove('selected'));
    }, 10);
  });

  // --- Form Submit Handler ---
  form.addEventListener('submit', function (event) {
    event.preventDefault();

    // Validate all fields
    const isNameValid = validateFullName();
    const isGenderValid = validateGender();
    const isMobileValid = validateMobile();
    const isEmailValid = validateEmail();
    const isCityValid = validateCity();
    const isStateValid = validateState();
    const isCountryValid = validateCountry();

    const isFormValid =
      isNameValid &&
      isGenderValid &&
      isMobileValid &&
      isEmailValid &&
      isCityValid &&
      isStateValid &&
      isCountryValid;

    // Focus the first invalid field
    if (!isFormValid) {
      const firstInvalid = form.querySelector('.is-invalid');
      if (firstInvalid) {
        if (typeof firstInvalid.focus === 'function') {
          firstInvalid.focus();
        } else {
          // If gender group container is invalid, focus first radio
          const firstRadio = document.querySelector('input[name="gender"]');
          if (firstRadio) firstRadio.focus();
        }
      }
      return;
    }

    // Collect sanitized values into user record object
    const selectedGender = document.querySelector('input[name="gender"]:checked').value;
    const userData = {
      id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      fullName: fullNameInput.value.trim(),
      gender: selectedGender,
      mobile: mobileInput.value.trim(),
      email: emailInput.value.trim().toLowerCase(),
      city: cityInput.value.trim(),
      state: stateSelect.value,
      country: countrySelect.value,
      submittedAt: new Date().toISOString()
    };

    // Save to localStorage with error handling
    try {
      // 1. Save currentUser
      localStorage.setItem('currentUser', JSON.stringify(userData));

      // 2. Append to allUsers array
      let allUsers = [];
      const storedUsers = localStorage.getItem('allUsers');
      if (storedUsers) {
        try {
          const parsed = JSON.parse(storedUsers);
          if (Array.isArray(parsed)) {
            allUsers = parsed;
          }
        } catch (parseError) {
          console.warn('Could not parse existing allUsers array, initializing new one:', parseError);
        }
      }

      allUsers.push(userData);
      localStorage.setItem('allUsers', JSON.stringify(allUsers));

      // 3. Redirect to display.html
      window.location.href = 'display.html';

    } catch (storageError) {
      console.error('Failed to save user data to localStorage:', storageError);
      // Fallback inline banner in case quota is exceeded or storage is disabled
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-message visible';
      errorDiv.style.marginTop = '1rem';
      errorDiv.textContent = 'Unable to save to local storage. Please ensure cookies/storage are enabled.';
      form.appendChild(errorDiv);
    }
  });

})();
