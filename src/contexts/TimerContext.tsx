/**
 * Timer Context
 * 
 * Core timer logic using timestamp-based approach for iOS background handling.
 * The timer stores when the phase should end, not how much time has passed.
 * This allows correct time calculation on app resume from background.
 */

import React, {
    createContext,
    useContext,
    useReducer,
    useEffect,
    useCallback,
    useRef,
    type ReactNode
} from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import { TimerState, TimerAction, INITIAL_TIMER_STATE } from '@/types/timer';
import { Profile, calculateCycleCount } from '@/types/profile';
import { notifications } from '@/services/notifications';
import { haptics } from '@/services/haptics';
import { useSettings } from './SettingsContext';

function timerReducer(state: TimerState, action: TimerAction): TimerState {
    switch (action.type) {
        case 'START':
            return {
                ...state,
                phase: 'work',
                isRunning: true,
                endTime: action.endTime,
                remainingMs: action.endTime - Date.now(),
                completedCycles: 0,
                totalCycles: action.totalCycles,
                activeProfileId: action.profileId,
            };
        case 'PAUSE':
            return {
                ...state,
                isRunning: false,
                // Store remaining time when pausing
                remainingMs: state.endTime ? Math.max(0, state.endTime - Date.now()) : state.remainingMs,
                endTime: null,
            };
        case 'RESUME':
            return {
                ...state,
                isRunning: true,
                endTime: action.endTime,
            };
        case 'TICK':
            return {
                ...state,
                remainingMs: action.remainingMs,
            };
        case 'PHASE_COMPLETE':
            return {
                ...state,
                phase: action.nextPhase,
                endTime: action.endTime,
                completedCycles: action.nextPhase === 'break'
                    ? state.completedCycles + 1
                    : state.completedCycles,
                remainingMs: action.endTime ? action.endTime - Date.now() : 0,
            };
        case 'RESET':
            return INITIAL_TIMER_STATE;
        default:
            return state;
    }
}

interface TimerContextValue extends TimerState {
    start: (profile: Profile) => void;
    pause: () => void;
    resume: () => void;
    reset: () => void;
    /** Progress from 0 to 1 for the current phase */
    progress: number;
    /** Formatted time string (MM:SS) */
    timeDisplay: string;
}

const TimerContext = createContext<TimerContextValue | null>(null);

export function TimerProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(timerReducer, INITIAL_TIMER_STATE);
    const { settings } = useSettings();

    // Store profile for phase transitions
    const profileRef = useRef<Profile | null>(null);
    const tickIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Calculate progress and time display
    const calculateProgress = useCallback((): number => {
        if (!state.isRunning || !state.endTime || !profileRef.current) {
            return 0;
        }

        const profile = profileRef.current;
        const phaseDuration = state.phase === 'work'
            ? profile.workDurationMs
            : profile.breakDurationMs;

        const elapsed = phaseDuration - state.remainingMs;
        return Math.min(1, Math.max(0, elapsed / phaseDuration));
    }, [state.isRunning, state.endTime, state.phase, state.remainingMs]);

    const formatTime = useCallback((): string => {
        const totalSeconds = Math.max(0, Math.ceil(state.remainingMs / 1000));
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, [state.remainingMs]);

    // Handle phase completion
    const handlePhaseComplete = useCallback(async () => {
        const profile = profileRef.current;
        if (!profile) return;

        const { notifications: notifSettings } = settings;

        // Use exact end time to maintain continuity, or current time if missing
        const phaseEndTime = state.endTime || Date.now();

        if (state.phase === 'work') {
            // Work phase complete
            if (state.completedCycles + 1 >= state.totalCycles) {
                // Session complete!
                dispatch({ type: 'RESET' });
                await haptics.triggerHaptic(notifSettings.mode);
                await notifications.cancelAllNotifications();
                return;
            }

            const breakDuration = profile.breakDurationMs;
            const breakEndTime = phaseEndTime + breakDuration;

            // Check if we missed the break entirely (e.g. app closed for long time)
            if (Date.now() > breakEndTime) {
                // Break already finished in reality. Move to next cycle ready to start.
                dispatch({
                    type: 'PHASE_COMPLETE',
                    nextPhase: 'work',
                    endTime: null // Ready to start, not running
                });
                // Increment cycles for the break we "finished"
                // Actually PHASE_COMPLETE increments on 'break' -> usually handled by reducer?
                // Reducer increments when entering 'break'. If we skip to 'work', we need to increment.
                // My reducer logic: "completedCycles: action.nextPhase === 'break' ? state.completedCycles + 1 ..."
                // This logic is flawed if we skip break.
                // I will simplify: Just start break with correct endTime. 
                // If it's in the past, TICK will catch it immediately and finish it?
                // Yes, if I set endTime in past, TICK will fire `remaining <= 0` and call `handlePhaseComplete` again (recursion).
                // Recursion is risky.

                // Let's stick to: Start Break. If in past, it will finish immediately.
            }

            // Start Break (or "resume" it if we're late)
            dispatch({ type: 'PHASE_COMPLETE', nextPhase: 'break', endTime: breakEndTime });

            if (notifSettings.notifyBreakStart) {
                await haptics.triggerHaptic(notifSettings.mode);
            }

            // Schedule notification for break end (if it's in future)
            if (notifSettings.notifyWorkResume && breakEndTime > Date.now()) {
                await notifications.schedulePhaseEndNotification('break', breakEndTime, notifSettings.mode);
            }
        } else {
            // Break phase complete, start work
            // Usually we wait for user to start work? 
            // If we want auto-start, we'd set endTime. 
            // If not, we set endTime: null (Pause/Idle start)

            // For now, let's auto-start work to keep momentum? 
            // Or typically pomodoro pauses here. 
            // "Break is over. Ready for another session?" implies pause.

            // Current implementation was: `endTime = Date.now() + workDuration`. Auto-start.
            // Let's keep auto-start but purely from NOW (user processes start of work).
            // OR should it be from breakEndTime?
            // If I take extra break, I don't want my work time eaten.
            // So Start Work should be from Date.now() (fresh start).

            const workEndTime = Date.now() + profile.workDurationMs;
            dispatch({ type: 'PHASE_COMPLETE', nextPhase: 'work', endTime: workEndTime });

            if (notifSettings.notifyWorkResume) {
                await haptics.triggerHaptic(notifSettings.mode);
            }

            // Schedule notification for work end
            if (notifSettings.notifyBreakStart) {
                await notifications.schedulePhaseEndNotification('work', workEndTime, notifSettings.mode);
            }
        }
    }, [state.phase, state.completedCycles, state.totalCycles, state.endTime, settings]);

    // Tick effect - update remaining time
    useEffect(() => {
        if (!state.isRunning || !state.endTime) {
            if (tickIntervalRef.current) {
                clearInterval(tickIntervalRef.current);
                tickIntervalRef.current = null;
            }
            return;
        }

        const tick = () => {
            const now = Date.now();
            const remaining = state.endTime! - now;

            if (remaining <= 0) {
                handlePhaseComplete();
            } else {
                dispatch({ type: 'TICK', remainingMs: remaining });
            }
        };

        // Immediate tick
        tick();

        // Set up interval
        tickIntervalRef.current = setInterval(tick, 1000);

        return () => {
            if (tickIntervalRef.current) {
                clearInterval(tickIntervalRef.current);
                tickIntervalRef.current = null;
            }
        };
    }, [state.isRunning, state.endTime, handlePhaseComplete]);

    // Handle app state changes (background/foreground)
    useEffect(() => {
        const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
            if (nextAppState === 'active' && state.isRunning && state.endTime) {
                // App came to foreground, recalculate remaining time
                const now = Date.now();
                const remaining = state.endTime - now;

                if (remaining <= 0) {
                    handlePhaseComplete();
                } else {
                    dispatch({ type: 'TICK', remainingMs: remaining });
                }
            }
        });

        return () => subscription.remove();
    }, [state.isRunning, state.endTime, handlePhaseComplete]);

    // Actions
    const start = useCallback(async (profile: Profile) => {
        profileRef.current = profile;

        const totalCycles = calculateCycleCount(profile);
        const endTime = Date.now() + profile.workDurationMs;

        dispatch({
            type: 'START',
            profileId: profile.id,
            endTime,
            totalCycles,
        });

        // Request notification permissions and schedule first notification
        await notifications.requestPermissions();

        const { notifications: notifSettings } = settings;
        if (notifSettings.notifyBreakStart) {
            await notifications.schedulePhaseEndNotification('work', endTime, notifSettings.mode);
        }

        await haptics.lightImpact();
    }, [settings]);

    const pause = useCallback(async () => {
        dispatch({ type: 'PAUSE' });
        await notifications.cancelAllNotifications();
        await haptics.lightImpact();
    }, []);

    const resume = useCallback(async () => {
        const endTime = Date.now() + state.remainingMs;
        dispatch({ type: 'RESUME', endTime });

        const { notifications: notifSettings } = settings;
        const notifyPhase = state.phase === 'work'
            ? notifSettings.notifyBreakStart
            : notifSettings.notifyWorkResume;

        if (notifyPhase) {
            await notifications.schedulePhaseEndNotification(state.phase as 'work' | 'break', endTime, notifSettings.mode);
        }

        await haptics.lightImpact();
    }, [state.remainingMs, state.phase, settings]);

    const reset = useCallback(async () => {
        profileRef.current = null;
        dispatch({ type: 'RESET' });
        await notifications.cancelAllNotifications();
        await haptics.mediumImpact();
    }, []);

    const value: TimerContextValue = {
        ...state,
        start,
        pause,
        resume,
        reset,
        progress: calculateProgress(),
        timeDisplay: formatTime(),
    };

    return (
        <TimerContext.Provider value={value}>
            {children}
        </TimerContext.Provider>
    );
}

export function useTimer(): TimerContextValue {
    const context = useContext(TimerContext);
    if (!context) {
        throw new Error('useTimer must be used within TimerProvider');
    }
    return context;
}
