import { calendarFile, normalizeRegistration, reservePlace } from './registration.mjs';

const form = document.querySelector('#registration');
const name = form.elements.name;
const email = form.elements.email;
const receipt = document.querySelector('#receipt');
const receiptTitle = document.querySelector('#receipt-title');
const saveError = document.querySelector('#save-error');

function showFieldError(field, invalid) {
  document.querySelector(`#${field.id}-error`).hidden = !invalid;
  if (invalid) field.setAttribute('aria-invalid', 'true');
  else field.removeAttribute('aria-invalid');
}

for (const field of [name, email]) {
  field.addEventListener('input', () => showFieldError(field, false));
}

form.addEventListener('submit', event => {
  event.preventDefault();
  receipt.hidden = true;
  saveError.hidden = true;
  const details = normalizeRegistration({ name: name.value, email: email.value });
  email.value = details.email;
  const invalidName = !details.name || details.name.length > name.maxLength;
  const invalidEmail = !email.validity.valid || details.email.length > email.maxLength;
  showFieldError(name, invalidName);
  showFieldError(email, invalidEmail);
  if (invalidName || invalidEmail) {
    (invalidName ? name : email).focus();
    return;
  }

  try {
    const { entry, duplicate } = reservePlace(
      localStorage,
      details,
      () => `FN-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
    );
    receiptTitle.textContent = duplicate ? 'Already registered' : 'Place reserved';
    document.querySelector('#receipt-note').textContent = duplicate
      ? 'This email already has a reservation on this device.'
      : `Thanks, ${entry.name}. Your demo reservation is saved on this device.`;
    document.querySelector('#booking-reference').textContent = entry.reference;
    receipt.hidden = false;
    receiptTitle.focus();
  } catch {
    saveError.hidden = false;
  }
});

document.querySelector('#calendar').href =
  `data:text/calendar;charset=utf-8,${encodeURIComponent(calendarFile())}`;
