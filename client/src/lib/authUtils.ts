export function isUnauthorizedError(error: any): boolean {
  return error?.message?.includes('401') || 
         error?.message?.includes('Unauthorized') ||
         error?.status === 401;
}

export function redirectToLogin() {
  window.location.href = "/api/login";
}