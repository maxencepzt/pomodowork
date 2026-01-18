/**
 * Pomodoro Profile Types
 * 
 * A profile defines the timing configuration for a pomodoro session.
 */

export interface Profile {
    id: string;
    name: string;
    workDurationMs: number;
    breakDurationMs: number;
    sessionDurationMs: number;
    createdAt: number;
    updatedAt: number;
}

export interface ProfileFormData {
    name: string;
    workDurationMinutes: number;
    breakDurationMinutes: number;
    sessionDurationHours: number;
}

/**
 * Calculate the number of complete work cycles in a session
 */
export function calculateCycleCount(profile: Pick<Profile, 'workDurationMs' | 'breakDurationMs' | 'sessionDurationMs'>): number {
    const cycleDuration = profile.workDurationMs + profile.breakDurationMs;
    return Math.floor(profile.sessionDurationMs / cycleDuration);
}

/**
 * Convert form data to Profile (with ms conversions)
 */
export function formDataToProfile(formData: ProfileFormData, existingId?: string): Profile {
    const now = Date.now();
    return {
        id: existingId ?? `profile_${now}`,
        name: formData.name,
        workDurationMs: formData.workDurationMinutes * 60 * 1000,
        breakDurationMs: formData.breakDurationMinutes * 60 * 1000,
        sessionDurationMs: formData.sessionDurationHours * 60 * 60 * 1000,
        createdAt: existingId ? now : now,
        updatedAt: now,
    };
}

/**
 * Default profiles shipped with the app
 */
export const DEFAULT_PROFILES: Profile[] = [
    {
        id: 'default_classic',
        name: 'Classic',
        workDurationMs: 25 * 60 * 1000,
        breakDurationMs: 5 * 60 * 1000,
        sessionDurationMs: 4 * 60 * 60 * 1000,
        createdAt: 0,
        updatedAt: 0,
    },
    {
        id: 'default_deep_work',
        name: 'Deep Work',
        workDurationMs: 50 * 60 * 1000,
        breakDurationMs: 10 * 60 * 1000,
        sessionDurationMs: 5 * 60 * 60 * 1000,
        createdAt: 0,
        updatedAt: 0,
    },
];
