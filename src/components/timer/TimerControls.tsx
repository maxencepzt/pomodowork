/**
 * Timer Controls Component
 * 
 * Consistent button styling with proper centering.
 */

import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borders } from '@/constants/theme';
import type { TimerPhase } from '@/types/timer';

interface TimerControlsProps {
    phase: TimerPhase;
    isRunning: boolean;
    onStart: () => void;
    onPause: () => void;
    onResume: () => void;
    onReset: () => void;
}

export function TimerControls({
    phase,
    isRunning,
    onStart,
    onPause,
    onResume,
    onReset,
}: TimerControlsProps) {
    const isIdle = phase === 'idle';
    const buttonColor = phase === 'break' ? colors.accentBreak : colors.accent;

    return (
        <View style={styles.container}>
            {isIdle ? (
                <TouchableOpacity
                    style={[styles.primaryButton, { backgroundColor: buttonColor }]}
                    onPress={onStart}
                    activeOpacity={0.8}
                >
                    <Ionicons name="play" size={24} color="#FFF" />
                    <Text style={styles.primaryButtonText}>Start</Text>
                </TouchableOpacity>
            ) : (
                <View style={styles.activeControls}>
                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={onReset}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="refresh" size={22} color={colors.secondary} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.primaryButton, { backgroundColor: buttonColor }]}
                        onPress={isRunning ? onPause : onResume}
                        activeOpacity={0.8}
                    >
                        <Ionicons
                            name={isRunning ? 'pause' : 'play'}
                            size={24}
                            color="#FFF"
                        />
                        <Text style={styles.primaryButtonText}>
                            {isRunning ? 'Pause' : 'Resume'}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingVertical: spacing.xl,
        paddingBottom: spacing.xxl,
    },
    activeControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    primaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        height: 56,
        paddingHorizontal: spacing.xl + spacing.sm,
        borderRadius: 28,
        minWidth: 160,
    },
    primaryButtonText: {
        color: '#FFF',
        fontSize: 17,
        fontWeight: '600',
    },
    secondaryButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.surfaceElevated,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: borders.thick,
        borderColor: colors.border,
    },
});
