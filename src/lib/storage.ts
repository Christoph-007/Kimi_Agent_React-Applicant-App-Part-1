/**
 * storage.ts
 * Role-based storage key provider.
 * Guarantees isolation between applicant, employer, and admin sessions
 * when multiple roles are accessed simultaneously in the same browser.
 */

export const getAuthRole = () => {
    const path = window.location.pathname;
    if (path.startsWith('/employer')) return 'employer';
    if (path.startsWith('/admin')) return 'admin';
    if (path.startsWith('/applicant')) return 'applicant';
    return 'applicant'; // Default to applicant for public routes
};

export const getStorageKey = (baseKey: string, specificRole?: string) => {
    const role = specificRole || getAuthRole();
    return `${baseKey}_${role}`;
};

export const TOKEN_KEY = 'shiftmatch_token';
export const USER_KEY = 'shiftmatch_user';
