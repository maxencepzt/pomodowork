/**
 * Home Screen - Timer
 * 
 * Main pomodoro timer with circular progress and controls.
 * Trade Republic-inspired dark, minimal design.
 */

import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CircularTimer, TimerControls } from '@/components/timer';
import { useTimer, useProfiles } from '@/contexts';
import { colors, typography, spacing } from '@/constants/theme';
import { calculateTotalCycles } from '@/utils/calculations';

export default function HomeScreen() {
    const {
        phase,
        isRunning,
        remainingMs,
        timeDisplay,
        completedCycles,
        totalCycles,
        start,
        pause,
        resume,
        reset
    } = useTimer();

    const { activeProfile } = useProfiles();

    const handleStart = () => {
        if (activeProfile) {
            start(activeProfile);
        }
    };

    // Calculate initial time display when idle
    const displayTime = phase === 'idle' && activeProfile
        ? `${Math.round(activeProfile.workDurationMs / 60000)}:00`
        : timeDisplay;

    const cycles = activeProfile ? calculateTotalCycles(activeProfile) : 0;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {/* Profile indicator */}
                <View style={styles.profileInfo}>
                    <Text style={styles.profileName}>
                        {activeProfile?.name ?? 'No profile selected'}
                    </Text>
                    {phase !== 'idle' && (
                        <Text style={styles.cycleProgress}>
                            Cycle {completedCycles + (phase === 'work' ? 1 : 0)} of {totalCycles}
                        </Text>
                    )}
                    {phase === 'idle' && activeProfile && (
                        <Text style={styles.cycleProgress}>
                            {cycles} cycles · {Math.round(activeProfile.sessionDurationMs / 3600000)}h session
                        </Text>
                    )}
                </View>

                {/* Timer */}
                <View style={styles.timerContainer}>
                    <CircularTimer
                        isRunning={isRunning}
                        remainingMs={remainingMs}
                        durationMs={activeProfile ? (phase === 'break' ? activeProfile.breakDurationMs : activeProfile.workDurationMs) : 0}
                        timeDisplay={displayTime}
                        phase={phase}
                    />
                </View>

                {/* Controls */}
                <TimerControls
                    phase={phase}
                    isRunning={isRunning}
                    onStart={handleStart}
                    onPause={pause}
                    onResume={resume}
                    onReset={reset}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        flex: 1,
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xxxl,
        paddingBottom: 100, // Space for absolute tab bar
    },
    profileInfo: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    profileName: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.primary,
        letterSpacing: -0.4,
    },
    cycleProgress: {
        fontSize: typography.footnote.fontSize,
        color: colors.secondary,
        marginTop: spacing.xs,
    },
    timerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
