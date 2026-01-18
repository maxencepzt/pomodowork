/**
 * CircularTimer Component
 * 
 * SVG-based circular progress with thick ring.
 * Smoothly animates based on active/inactive state and remaining time.
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
    useAnimatedProps,
    useSharedValue,
    useFrameCallback,
} from 'react-native-reanimated';
import { colors, typography, spacing } from '@/constants/theme';
import type { TimerPhase } from '@/types/timer';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CircularTimerProps {
    isRunning: boolean;
    remainingMs: number; // Used for static display when paused
    durationMs: number;
    endTime: number | null; // Added prop
    timeDisplay: string;
    phase: TimerPhase;
    size?: number;
    strokeWidth?: number;
}

export function CircularTimer({
    isRunning,
    remainingMs,
    durationMs,
    endTime,
    timeDisplay,
    phase,
    size = 300,
    strokeWidth = 16,
}: CircularTimerProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const center = size / 2;

    // We animate from 0 (empty) to 1 (full) or vice-versa?
    // Let's say full circle = 0 progress (or 100% remaining).
    // progress = 1 - (remaining / duration)
    // We want to animate the strokeDashoffset.
    // offset = circumference * (1 - progress)
    // If progress 0, offset = circumference (empty) -> wait, depends on logic.
    // Usually: offset 0 = full ring. offset circumference = empty ring.

    // Let's use a shared value representing "percent remaining" (1 to 0).
    // 1 = full (start), 0 = empty (end).

    const percentRemaining = useSharedValue(durationMs > 0 ? remainingMs / durationMs : 1);

    // Frame callback for smooth animation independent of React renders
    useFrameCallback(() => {
        if (!isRunning || !endTime || durationMs <= 0) {
            return;
        }

        const now = Date.now();
        const remaining = Math.max(0, endTime - now);
        const nextPercent = remaining / durationMs;
        percentRemaining.value = nextPercent;
    });

    // Handle Pause state sync
    useEffect(() => {
        if (!isRunning && durationMs > 0) {
            percentRemaining.value = Math.max(0, remainingMs / durationMs);
        }
    }, [isRunning, remainingMs, durationMs]);

    const animatedProps = useAnimatedProps(() => {
        // strokeDashoffset:
        // 0 = full
        // circumference = empty
        // We want full at start (percent 1) -> offset 0
        // Empty at end (percent 0) -> offset circumference
        const offset = circumference * (1 - percentRemaining.value);

        return {
            strokeDashoffset: offset,
        };
    });

    const ringColor = phase === 'break' ? colors.ringBreak : colors.ringWork;
    const phaseLabel = phase === 'idle' ? '' : phase === 'work' ? 'FOCUS' : 'BREAK';

    return (
        <View style={styles.container}>
            <Svg width={size} height={size} style={styles.svg}>
                {/* Background ring */}
                <Circle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke={colors.ringBackground}
                    strokeWidth={strokeWidth}
                    fill="none"
                />

                {/* Progress ring */}
                <AnimatedCircle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke={ringColor}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    animatedProps={animatedProps}
                    transform={`rotate(-90 ${center} ${center})`}
                />
            </Svg>

            <View style={[styles.timeContainer, { width: size, height: size }]}>
                <Text style={styles.timeText}>{timeDisplay}</Text>
                {phaseLabel ? (
                    <Text style={[styles.phaseLabel, { color: ringColor }]}>
                        {phaseLabel}
                    </Text>
                ) : null}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    svg: {
        transform: [{ rotateZ: '0deg' }],
    },
    timeContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    timeText: {
        fontSize: typography.display.fontSize,
        fontWeight: typography.display.fontWeight,
        letterSpacing: typography.display.letterSpacing,
        color: colors.primary,
        fontVariant: ['tabular-nums'], // Fixed width numbers to prevent jitter
    },
    phaseLabel: {
        fontSize: 13,
        fontWeight: '600',
        marginTop: spacing.sm,
        letterSpacing: 3,
    },
});
