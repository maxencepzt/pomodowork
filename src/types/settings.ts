/**
 * Settings Types
 * 
 * User preferences for notifications and app behavior.
 */

export type NotificationMode = 'sound' | 'vibration' | 'repeatingVibration' | 'none';

export interface NotificationPreferences {
    /** Notify when break starts */
    notifyBreakStart: boolean;
    /** Notify when work resumes */
    notifyWorkResume: boolean;
    /** Sound/vibration mode */
    mode: NotificationMode;
}

export interface Settings {
    notifications: NotificationPreferences;
    /** Future: theme preference */
    // theme: 'light' | 'dark' | 'system';
}

export const DEFAULT_SETTINGS: Settings = {
    notifications: {
        notifyBreakStart: true,
        notifyWorkResume: true,
        mode: 'vibration',
    },
};
