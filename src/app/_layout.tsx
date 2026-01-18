/**
 * Root Layout
 * 
 * Sets up providers and navigation structure.
 */

import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ProfilesProvider, SettingsProvider, TimerProvider } from '@/contexts';
import { colors } from '@/constants/theme';

export default function RootLayout() {
    return (
        <SettingsProvider>
            <ProfilesProvider>
                <TimerProvider>
                    <StatusBar style="light" />
                    <Stack
                        screenOptions={{
                            headerShown: false,
                            contentStyle: { backgroundColor: colors.background },
                            animation: 'fade',
                        }}
                    >
                        <Stack.Screen name="(tabs)" />
                        <Stack.Screen
                            name="create-profile"
                            options={{
                                presentation: 'modal',
                                animation: 'slide_from_bottom',
                            }}
                        />
                    </Stack>
                </TimerProvider>
            </ProfilesProvider>
        </SettingsProvider>
    );
}
