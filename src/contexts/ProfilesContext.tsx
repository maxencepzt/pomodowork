/**
 * Profiles Context
 * 
 * Manages the list of pomodoro profiles and active selection.
 */

import React, { createContext, useContext, useReducer, useEffect, useCallback, type ReactNode } from 'react';
import { Profile, DEFAULT_PROFILES } from '@/types/profile';
import { storage } from '@/services/storage';

interface ProfilesState {
    profiles: Profile[];
    activeProfileId: string | null;
    isLoading: boolean;
}

type ProfilesAction =
    | { type: 'LOAD'; profiles: Profile[]; activeProfileId: string | null }
    | { type: 'ADD'; profile: Profile }
    | { type: 'UPDATE'; profile: Profile }
    | { type: 'DELETE'; id: string }
    | { type: 'SET_ACTIVE'; id: string };

const initialState: ProfilesState = {
    profiles: [],
    activeProfileId: null,
    isLoading: true,
};

function profilesReducer(state: ProfilesState, action: ProfilesAction): ProfilesState {
    switch (action.type) {
        case 'LOAD':
            return {
                profiles: action.profiles,
                activeProfileId: action.activeProfileId,
                isLoading: false,
            };
        case 'ADD':
            return {
                ...state,
                profiles: [...state.profiles, action.profile],
            };
        case 'UPDATE':
            return {
                ...state,
                profiles: state.profiles.map(p =>
                    p.id === action.profile.id ? action.profile : p
                ),
            };
        case 'DELETE':
            return {
                ...state,
                profiles: state.profiles.filter(p => p.id !== action.id),
                activeProfileId: state.activeProfileId === action.id
                    ? state.profiles[0]?.id ?? null
                    : state.activeProfileId,
            };
        case 'SET_ACTIVE':
            return {
                ...state,
                activeProfileId: action.id,
            };
        default:
            return state;
    }
}

interface ProfilesContextValue extends ProfilesState {
    activeProfile: Profile | null;
    addProfile: (profile: Profile) => Promise<void>;
    updateProfile: (profile: Profile) => Promise<void>;
    deleteProfile: (id: string) => Promise<void>;
    setActiveProfile: (id: string) => Promise<void>;
}

const ProfilesContext = createContext<ProfilesContextValue | null>(null);

export function ProfilesProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(profilesReducer, initialState);

    // Load profiles on mount
    useEffect(() => {
        async function load() {
            const [savedProfiles, activeId] = await Promise.all([
                storage.getProfiles(),
                storage.getActiveProfileId(),
            ]);

            // Merge default profiles with saved ones
            const allProfiles = savedProfiles.length > 0
                ? savedProfiles
                : DEFAULT_PROFILES;

            dispatch({
                type: 'LOAD',
                profiles: allProfiles,
                activeProfileId: activeId ?? allProfiles[0]?.id ?? null,
            });
        }
        load();
    }, []);

    const addProfile = useCallback(async (profile: Profile) => {
        dispatch({ type: 'ADD', profile });
        const newProfiles = [...state.profiles, profile];
        await storage.setProfiles(newProfiles);
    }, [state.profiles]);

    const updateProfile = useCallback(async (profile: Profile) => {
        dispatch({ type: 'UPDATE', profile });
        const newProfiles = state.profiles.map(p =>
            p.id === profile.id ? profile : p
        );
        await storage.setProfiles(newProfiles);
    }, [state.profiles]);

    const deleteProfile = useCallback(async (id: string) => {
        // Don't allow deleting default profiles
        if (id.startsWith('default_')) {
            return;
        }
        dispatch({ type: 'DELETE', id });
        const newProfiles = state.profiles.filter(p => p.id !== id);
        await storage.setProfiles(newProfiles);
    }, [state.profiles]);

    const setActiveProfile = useCallback(async (id: string) => {
        dispatch({ type: 'SET_ACTIVE', id });
        await storage.setActiveProfileId(id);
    }, []);

    const activeProfile = state.profiles.find(p => p.id === state.activeProfileId) ?? null;

    const value: ProfilesContextValue = {
        ...state,
        activeProfile,
        addProfile,
        updateProfile,
        deleteProfile,
        setActiveProfile,
    };

    return (
        <ProfilesContext.Provider value={value}>
            {children}
        </ProfilesContext.Provider>
    );
}

export function useProfiles(): ProfilesContextValue {
    const context = useContext(ProfilesContext);
    if (!context) {
        throw new Error('useProfiles must be used within ProfilesProvider');
    }
    return context;
}
