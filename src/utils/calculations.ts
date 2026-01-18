/**
 * Calculation Utilities
 */

import type { Profile } from '@/types/profile';

/**
 * Calculate total cycles that fit in a session
 */
export function calculateTotalCycles(profile: Pick<Profile, 'workDurationMs' | 'breakDurationMs' | 'sessionDurationMs'>): number {
    const cycleMs = profile.workDurationMs + profile.breakDurationMs;
    return Math.floor(profile.sessionDurationMs / cycleMs);
}

/**
 * Calculate actual session duration based on complete cycles
 */
export function calculateActualSessionDuration(
    workMin: number,
    breakMin: number,
    sessionHours: number
): { cycles: number; actualMinutes: number } {
    const workMs = workMin * 60 * 1000;
    const breakMs = breakMin * 60 * 1000;
    const sessionMs = sessionHours * 60 * 60 * 1000;

    const cycleMs = workMs + breakMs;
    const cycles = Math.floor(sessionMs / cycleMs);
    const actualMs = cycles * cycleMs;

    return {
        cycles,
        actualMinutes: Math.round(actualMs / (60 * 1000)),
    };
}

/**
 * Format profile summary for display
 * e.g., "25 / 5 – 4h (8 cycles)"
 */
export function formatProfileSummary(profile: Profile): string {
    const workMin = Math.round(profile.workDurationMs / (60 * 1000));
    const breakMin = Math.round(profile.breakDurationMs / (60 * 1000));
    const sessionHours = profile.sessionDurationMs / (60 * 60 * 1000);

    const sessionStr = `${sessionHours}h`;

    return `${workMin} / ${breakMin} – ${sessionStr}`;
}
