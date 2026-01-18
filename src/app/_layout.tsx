/**
 * Root Layout
 * 
 * Sets up providers and navigation structure.
 */

import React from 'react';
import { Stack } from 'expo-router';
import { ProfilesProvider } from '@/contexts/ProfilesContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { StatsProvider } from '@/contexts/StatsContext';
import { TimerProvider } from '@/contexts';

export default function RootLayout() {
    return (
        <SettingsProvider>
            <ProfilesProvider>
                <StatsProvider>
                    <TimerProvider>
                        <Stack>
                            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                            <Stack.Screen
                                name="create-profile"
                                options={{
                                    presentation: 'modal',
                                    animation: 'slide_from_bottom',
                                }}
                            />
                        </Stack>
                    </TimerProvider>
                </StatsProvider>
            </ProfilesProvider>
        </SettingsProvider>
    );
}
