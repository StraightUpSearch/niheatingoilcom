export function isUnauthorizedError(error: any): boolean {
  return error?.message?.includes('401') || 
         error?.message?.includes('Unauthorized') ||
         error?.status === 401;
}

export function handleAuthError(error: any): void {
  if (isUnauthorizedError(error)) {
    // Clear any cached user data
    localStorage.removeItem('user');
    // Redirect to login
    window.location.href = '/auth';
  }
}

export function isAuthenticated(): boolean {
  // This should be used with the useAuth hook instead
  return false;
}