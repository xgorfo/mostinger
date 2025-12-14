export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validateUsername = (username) => {
  if (username.length < 3) return 'Username must be at least 3 characters';
  if (username.length > 50) return 'Username must be less than 50 characters';
  return null;
};

export const validatePassword = (password) => {
  if (password.length < 6) return 'Password must be at least 6 characters';
  return null;
};

export const validatePostTitle = (title) => {
  if (!title.trim()) return 'Title is required';
  if (title.length > 255) return 'Title must be less than 255 characters';
  return null;
};

export const validatePostContent = (content) => {
  if (content.length < 10) return 'Content must be at least 10 characters';
  return null;
};