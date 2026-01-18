/**
 * Stats Context
 * 
 * Manages global statistics for the user (total work time, etc.).
 */

import React, {
    createContext,
    useContext,
    useReducer,
    useEffect,
    useCallback,
    type ReactNode
} from 'react';
import { storage } from '@/services/storage';

interface StatsState {
    totalWorkMs: number;
    isLoading: boolean;
}

type StatsAction =
    | { type: 'LOAD'; totalWorkMs: number }
    | { type: 'ADD_WORK_TIME'; durationMs: number };

const initialState: StatsState = {
    totalWorkMs: 0,
    isLoading: true,
};

function statsReducer(state: StatsState, action: StatsAction): StatsState {
    switch (action.type) {
        case 'LOAD':
            return {
                totalWorkMs: action.totalWorkMs,
                isLoading: false,
            };
        case 'ADD_WORK_TIME':
            return {
                ...state,
                totalWorkMs: state.totalWorkMs + action.durationMs,
            };
        default:
            return state;
    }
}

interface StatsContextValue extends StatsState {
    addWorkTime: (durationMs: number) => Promise<void>;
}

const StatsContext = createContext<StatsContextValue | null>(null);

export function StatsProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(statsReducer, initialState);

    // Load stats on mount
    useEffect(() => {
        async function load() {
            const savedStats = await storage.getStats();
            dispatch({
                type: 'LOAD',
                totalWorkMs: savedStats?.totalWorkMs ?? 0,
            });
        }
        load();
    }, []);

    const addWorkTime = useCallback(async (durationMs: number) => {
        dispatch({ type: 'ADD_WORK_TIME', durationMs });

        // Persist
        // Note: accessing state in callback (stale closure check)
        // We can't rely on `state.totalWorkMs` here because it might be old in this closure if deps are empty.
        // But if we add state.totalWorkMs to deps, it re-creates callback often.
        // Better: Use a reliable storage update mechanism.
        // We know the OLD stored value + durationMs = NEW value.
        // But storage is async.
        // Simplest: Read current from storage, add, write back. 
        // Or trust the reducer state IF we keep it in sync.

        // Let's read from storage to be safe (source of truth for persistence)
        const currentStats = await storage.getStats();
        const newTotal = (currentStats?.totalWorkMs ?? 0) + durationMs;
        await storage.setStats({ totalWorkMs: newTotal });

    }, []);

    const value: StatsContextValue = {
        ...state,
        addWorkTime,
    };

    return (
        <StatsContext.Provider value={value}>
            {children}
        </StatsContext.Provider>
    );
}

export function useStats(): StatsContextValue {
    const context = useContext(StatsContext);
    if (!context) {
        throw new Error('useStats must be used within StatsProvider');
    }
    return context;
}
