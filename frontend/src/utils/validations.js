export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateRequired = (value) => {
  return value && value.toString().trim().length > 0;
};

export const validateNumber = (value) => {
  return !isNaN(value) && value >= 0;
};

export const validateDate = (date) => {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d);
};