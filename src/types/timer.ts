/**
 * Timer State Types
 * 
 * The timer uses a timestamp-based approach to handle iOS background limitations.
 * Instead of relying on JS intervals, we store when the phase should end
 * and recalculate remaining time on each render/resume.
 */

export type TimerPhase = 'idle' | 'work' | 'break';

export interface TimerState {
    /** Current phase of the pomodoro */
    phase: TimerPhase;
    /** Whether the timer is running */
    isRunning: boolean;
    /** Unix timestamp (ms) when current phase ends, null if idle */
    endTime: number | null;
    /** Time remaining in ms, recalculated on render */
    remainingMs: number;
    /** Number of completed work cycles in current session */
    completedCycles: number;
    /** Total cycles for current session */
    totalCycles: number;
    /** ID of the active profile */
    activeProfileId: string | null;
}

export interface TimerSession {
    id: string;
    profileId: string;
    startedAt: number;
    endedAt: number | null;
    completedCycles: number;
    /** Future: associate with projects */
    projectId?: string;
}

export type TimerAction =
    | { type: 'START'; profileId: string; endTime: number; totalCycles: number }
    | { type: 'PAUSE' }
    | { type: 'RESUME'; endTime: number }
    | { type: 'TICK'; remainingMs: number }
    | { type: 'PHASE_COMPLETE'; nextPhase: TimerPhase; endTime: number | null }
    | { type: 'RESET' };

/**
 * Initial timer state
 */
export const INITIAL_TIMER_STATE: TimerState = {
    phase: 'idle',
    isRunning: false,
    endTime: null,
    remainingMs: 0,
    completedCycles: 0,
    totalCycles: 0,
    activeProfileId: null,
};
