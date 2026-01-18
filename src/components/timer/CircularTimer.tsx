/**
 * CircularTimer Component
 * 
 * SVG-based circular progress with thick ring.
 */

import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
    useAnimatedProps,
    withTiming,
    Easing,
    useSharedValue,
} from 'react-native-reanimated';
import { colors, typography, spacing } from '@/constants/theme';
import type { TimerPhase } from '@/types/timer';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CircularTimerProps {
    progress: number;
    timeDisplay: string;
    phase: TimerPhase;
    size?: number;
    strokeWidth?: number;
}

export function CircularTimer({
    progress,
    timeDisplay,
    phase,
    size = 300,
    strokeWidth = 16,  // Much thicker stroke
}: CircularTimerProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const center = size / 2;

    const animatedProgress = useSharedValue(0);

    React.useEffect(() => {
        animatedProgress.value = withTiming(progress, {
            duration: 300,
            easing: Easing.out(Easing.ease),
        });
    }, [progress, animatedProgress]);

    const animatedProps = useAnimatedProps(() => {
        const strokeDashoffset = circumference * (1 - animatedProgress.value);
        return {
            strokeDashoffset,
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
    },
    phaseLabel: {
        fontSize: 13,
        fontWeight: '600',
        marginTop: spacing.sm,
        letterSpacing: 3,
    },
});
