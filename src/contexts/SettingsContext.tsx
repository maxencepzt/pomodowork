/**
 * Settings Context
 * 
 * Manages user preferences for notifications and app behavior.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { Settings, DEFAULT_SETTINGS, NotificationMode } from '@/types/settings';
import { storage } from '@/services/storage';

interface SettingsContextValue {
    settings: Settings;
    isLoading: boolean;
    updateNotificationMode: (mode: NotificationMode) => Promise<void>;
    toggleBreakNotification: () => Promise<void>;
    toggleWorkNotification: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
    const [isLoading, setIsLoading] = useState(true);

    // Load settings on mount
    useEffect(() => {
        async function load() {
            const saved = await storage.getSettings();
            if (saved) {
                setSettings(saved);
            }
            setIsLoading(false);
        }
        load();
    }, []);

    const updateSettings = useCallback(async (newSettings: Settings) => {
        setSettings(newSettings);
        await storage.setSettings(newSettings);
    }, []);

    const updateNotificationMode = useCallback(async (mode: NotificationMode) => {
        const newSettings: Settings = {
            ...settings,
            notifications: {
                ...settings.notifications,
                mode,
            },
        };
        await updateSettings(newSettings);
    }, [settings, updateSettings]);

    const toggleBreakNotification = useCallback(async () => {
        const newSettings: Settings = {
            ...settings,
            notifications: {
                ...settings.notifications,
                notifyBreakStart: !settings.notifications.notifyBreakStart,
            },
        };
        await updateSettings(newSettings);
    }, [settings, updateSettings]);

    const toggleWorkNotification = useCallback(async () => {
        const newSettings: Settings = {
            ...settings,
            notifications: {
                ...settings.notifications,
                notifyWorkResume: !settings.notifications.notifyWorkResume,
            },
        };
        await updateSettings(newSettings);
    }, [settings, updateSettings]);

    const value: SettingsContextValue = {
        settings,
        isLoading,
        updateNotificationMode,
        toggleBreakNotification,
        toggleWorkNotification,
    };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings(): SettingsContextValue {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within SettingsProvider');
    }
    return context;
}
