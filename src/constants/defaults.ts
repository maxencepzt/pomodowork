/**
 * Default values and constants
 */

import { Profile, DEFAULT_PROFILES } from '@/types/profile';

export const DEFAULTS = {
    /** Default profile ID on first launch */
    defaultProfileId: DEFAULT_PROFILES[0].id,

    /** Min/max values for profile form */
    workDuration: {
        min: 5,
        max: 120,
        step: 5,
        default: 25,
    },

    breakDuration: {
        min: 1,
        max: 30,
        step: 1,
        default: 5,
    },

    sessionDuration: {
        min: 1,
        max: 12,
        step: 0.5,
        default: 4,
    },
} as const;

export { DEFAULT_PROFILES };
