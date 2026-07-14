// Contact form validation: empty-field checks, email format, phone digits-only.

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  if (!form) return; // Only run on contact.html

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const messageInput = document.getElementById('message');
  const formSuccess = document.getElementById('formSuccess');

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^[0-9]{7,15}$/; // digits only, reasonable phone length

  function setError(input, errorId, message) {
    document.getElementById(errorId).textContent = message;
    input.classList.toggle('invalid', Boolean(message));
  }

  function validateName() {
    const value = nameInput.value.trim();
    if (!value) {
      setError(nameInput, 'nameError', 'Full name is required.');
      return false;
    }
    setError(nameInput, 'nameError', '');
    return true;
  }

  function validateEmail() {
    const value = emailInput.value.trim();
    if (!value) {
      setError(emailInput, 'emailError', 'Email address is required.');
      return false;
    }
    if (!emailPattern.test(value)) {
      setError(emailInput, 'emailError', 'Enter a valid email address (e.g. name@example.com).');
      return false;
    }
    setError(emailInput, 'emailError', '');
    return true;
  }

  function validatePhone() {
    const value = phoneInput.value.trim();
    if (!value) {
      setError(phoneInput, 'phoneError', 'Phone number is required.');
      return false;
    }
    if (!phonePattern.test(value)) {
      setError(phoneInput, 'phoneError', 'Phone number must contain digits only (7-15 digits).');
      return false;
    }
    setError(phoneInput, 'phoneError', '');
    return true;
  }

  function validateMessage() {
    const value = messageInput.value.trim();
    if (!value) {
      setError(messageInput, 'messageError', 'Message cannot be empty.');
      return false;
    }
    setError(messageInput, 'messageError', '');
    return true;
  }

  // Validate on blur for immediate feedback
  nameInput.addEventListener('blur', validateName);
  emailInput.addEventListener('blur', validateEmail);
  phoneInput.addEventListener('blur', validatePhone);
  messageInput.addEventListener('blur', validateMessage);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    formSuccess.textContent = '';

    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();
    const isMessageValid = validateMessage();

    if (isNameValid && isEmailValid && isPhoneValid && isMessageValid) {
      formSuccess.textContent = 'Message sent successfully! I\'ll get back to you soon.';
      form.reset();
      [nameInput, emailInput, phoneInput, messageInput].forEach(input =>
        input.classList.remove('invalid')
      );
    }
  });
});
