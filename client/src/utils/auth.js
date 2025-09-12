// Simple authentication utilities for frontend-only login
export const isAuthenticated = () => {
  const user = localStorage.getItem('user');
  if (!user) return false;
  
  try {
    const userData = JSON.parse(user);
    return userData.isAuthenticated === true;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return false;
  }
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  if (!user) return null;
  
  try {
    return JSON.parse(user);
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem('user');
  window.location.href = '/login';
};

export const getAuthToken = () => {
  // For demo purposes, return a mock token
  // In a real app, this would be a JWT or similar
  return 'demo-auth-token-' + Date.now();
};
