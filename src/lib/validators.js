
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateEmail(email) {
  if (!email.trim()) return 'Email is required';
  if (!EMAIL_RE.test(email.trim())) return 'Enter a valid email address';
  return null;
}

export function validatePassword(password) {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  if (!/[A-Z]/.test(password))
    return 'Password needs at least one uppercase letter';
  if (!/[a-z]/.test(password))
    return 'Password needs at least one lowercase letter';
  return null;
}

export function validateName(name) {
  if (!name.trim()) return 'Full name is required';
  if (name.trim().length < 2) return 'Name is too short';
  return null;
}

export function validatePhone(phone) {
  if (!phone.trim()) return 'Phone number is required';
  if (!/^\+?[\d\s-]{7,15}$/.test(phone.trim()))
    return 'Enter a valid phone number';
  return null;
}
