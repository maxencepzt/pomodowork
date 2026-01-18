/**
 * User Types (Future)
 * 
 * Architecture placeholder for user accounts.
 * Not implemented in v1, but types are ready for later integration.
 */

export interface User {
    id: string;
    email: string;
    displayName: string | null;
    createdAt: number;
}

export interface UserStats {
    userId: string;
    totalWorkMs: number;
    totalSessions: number;
    streak: number;
}

/**
 * Auth state for future implementation
 */
export interface AuthState {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
}
