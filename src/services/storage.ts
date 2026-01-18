/**
 * Storage Service
 * 
 * Typed wrapper around AsyncStorage for persistence.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Profile } from '@/types/profile';
import type { Settings } from '@/types/settings';

const STORAGE_KEYS = {
    PROFILES: '@pomodowork/profiles',
    ACTIVE_PROFILE_ID: '@pomodowork/activeProfileId',
    SETTINGS: '@pomodowork/settings',
    TIMER_STATE: '@pomodowork/timerState',
} as const;

type StorageKey = keyof typeof STORAGE_KEYS;

/**
 * Generic get with JSON parsing
 */
async function get<T>(key: StorageKey): Promise<T | null> {
    try {
        const value = await AsyncStorage.getItem(STORAGE_KEYS[key]);
        return value ? JSON.parse(value) : null;
    } catch (error) {
        console.error(`Storage get error for ${key}:`, error);
        return null;
    }
}

/**
 * Generic set with JSON stringify
 */
async function set<T>(key: StorageKey, value: T): Promise<void> {
    try {
        await AsyncStorage.setItem(STORAGE_KEYS[key], JSON.stringify(value));
    } catch (error) {
        console.error(`Storage set error for ${key}:`, error);
    }
}

/**
 * Remove a key
 */
async function remove(key: StorageKey): Promise<void> {
    try {
        await AsyncStorage.removeItem(STORAGE_KEYS[key]);
    } catch (error) {
        console.error(`Storage remove error for ${key}:`, error);
    }
}

// Typed storage methods

export const storage = {
    // Profiles
    async getProfiles(): Promise<Profile[]> {
        return (await get<Profile[]>('PROFILES')) ?? [];
    },

    async setProfiles(profiles: Profile[]): Promise<void> {
        await set('PROFILES', profiles);
    },

    // Active profile
    async getActiveProfileId(): Promise<string | null> {
        return get<string>('ACTIVE_PROFILE_ID');
    },

    async setActiveProfileId(id: string): Promise<void> {
        await set('ACTIVE_PROFILE_ID', id);
    },

    // Settings
    async getSettings(): Promise<Settings | null> {
        return get<Settings>('SETTINGS');
    },

    async setSettings(settings: Settings): Promise<void> {
        await set('SETTINGS', settings);
    },

    // Timer state (for resume after background)
    async getTimerEndTime(): Promise<number | null> {
        return get<number>('TIMER_STATE');
    },

    async setTimerEndTime(endTime: number | null): Promise<void> {
        if (endTime === null) {
            await remove('TIMER_STATE');
        } else {
            await set('TIMER_STATE', endTime);
        }
    },

    // Clear all data
    async clear(): Promise<void> {
        await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    },
};
