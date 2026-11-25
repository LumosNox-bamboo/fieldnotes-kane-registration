const storageKey = 'fieldnotes-workshop-v1';

export function normalizeRegistration({ name, email }) {
  return { name: name.trim(), email: email.trim().toLowerCase() };
}

export function reservePlace(storage, registration, makeReference) {
  const details = normalizeRegistration(registration);
  const records = JSON.parse(storage.getItem(storageKey) ?? '[]');
  const existing = records.find(entry => entry.email === details.email);
  if (existing) return { entry: existing, duplicate: true };

  const entry = { ...details, reference: makeReference() };
  storage.setItem(storageKey, JSON.stringify([...records, entry]));
  return { entry, duplicate: false };
}

export function calendarFile() {
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Fieldnotes//Workshop Demo//EN',
    'BEGIN:VEVENT',
    'UID:fieldnotes-workshop-20261203@fieldnotes.invalid',
    'DTSTAMP:20261125T150000Z',
    'DTSTART:20261203T163000Z',
    'DTEND:20261203T180000Z',
    'SUMMARY:Fieldnotes Workshop (demo)',
    'LOCATION:Heidelberg',
    'END:VEVENT',
    'END:VCALENDAR',
    '',
  ].join('\r\n');
}
