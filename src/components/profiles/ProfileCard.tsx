/**
 * ProfileCard Component with Swipe-to-Delete
 * 
 * Swipe left to reveal delete action, continue to delete.
 */

import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    runOnJS,
    interpolate,
    Extrapolation,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, borders } from '@/constants/theme';
import { formatProfileSummary, calculateTotalCycles } from '@/utils/calculations';
import type { Profile } from '@/types/profile';

const SCREEN_WIDTH = Dimensions.get('window').width;
const DELETE_THRESHOLD = -120;
const SNAP_POINT = -80;

interface ProfileCardProps {
    profile: Profile;
    isActive: boolean;
    onSelect: () => void;
    onDelete?: () => void;
    canDelete: boolean;
}

export function ProfileCard({ profile, isActive, onSelect, onDelete, canDelete }: ProfileCardProps) {
    const cycles = calculateTotalCycles(profile);
    const summary = formatProfileSummary(profile);

    const translateX = useSharedValue(0);
    const isDeleting = useSharedValue(false);

    const handleDelete = () => {
        if (onDelete && canDelete) {
            onDelete();
        }
    };

    const panGesture = Gesture.Pan()
        .activeOffsetX([-10, 10])
        .onUpdate((e) => {
            if (!canDelete) return;
            // Only allow left swipe
            translateX.value = Math.min(0, e.translationX);
        })
        .onEnd((e) => {
            if (!canDelete) {
                translateX.value = withSpring(0);
                return;
            }

            if (translateX.value < DELETE_THRESHOLD) {
                // Delete - animate out
                isDeleting.value = true;
                translateX.value = withTiming(-SCREEN_WIDTH, { duration: 200 }, () => {
                    runOnJS(handleDelete)();
                });
            } else if (translateX.value < SNAP_POINT / 2) {
                // Snap to show delete button
                translateX.value = withSpring(SNAP_POINT);
            } else {
                // Snap back
                translateX.value = withSpring(0);
            }
        });

    const tapGesture = Gesture.Tap()
        .onEnd(() => {
            if (translateX.value < -10) {
                // If swiped, tap snaps back
                translateX.value = withSpring(0);
            } else {
                runOnJS(onSelect)();
            }
        });

    const composedGesture = Gesture.Race(panGesture, tapGesture);

    const cardStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    const deleteButtonStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            translateX.value,
            [0, SNAP_POINT],
            [0, 1],
            Extrapolation.CLAMP
        );
        const scale = interpolate(
            translateX.value,
            [0, SNAP_POINT],
            [0.5, 1],
            Extrapolation.CLAMP
        );
        return {
            opacity,
            transform: [{ scale }],
        };
    });

    return (
        <View style={styles.wrapper}>
            {/* Delete button behind */}
            {canDelete && (
                <Animated.View style={[styles.deleteButton, deleteButtonStyle]}>
                    <Ionicons name="trash-outline" size={24} color="#FFF" />
                </Animated.View>
            )}

            {/* Card */}
            <GestureDetector gesture={composedGesture}>
                <Animated.View
                    style={[
                        styles.container,
                        isActive && styles.containerActive,
                        cardStyle,
                    ]}
                >
                    <View style={styles.content}>
                        <Text style={[styles.name, isActive && styles.nameActive]}>
                            {profile.name}
                        </Text>
                        <Text style={styles.summary}>{summary}</Text>
                    </View>

                    <View style={styles.cyclesBadge}>
                        <Text style={[styles.cyclesText, isActive && styles.cyclesTextActive]}>{cycles}</Text>
                        <Text style={styles.cyclesLabel}>cycles</Text>
                    </View>
                </Animated.View>
            </GestureDetector>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: spacing.sm,
        position: 'relative',
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        padding: spacing.md,
        borderWidth: borders.thick,
        borderColor: colors.border,
    },
    containerActive: {
        borderColor: colors.accent,
        backgroundColor: colors.surfaceElevated,
    },
    content: {
        flex: 1,
    },
    name: {
        fontSize: typography.headline.fontSize,
        fontWeight: '700',
        color: colors.primary,
        marginBottom: spacing.xs,
    },
    nameActive: {
        color: colors.accent,
    },
    summary: {
        fontSize: typography.footnote.fontSize,
        fontWeight: '500',
        color: colors.secondary,
    },
    cyclesBadge: {
        alignItems: 'center',
        paddingHorizontal: spacing.md,
    },
    cyclesText: {
        fontSize: 26,
        fontWeight: '600',
        color: colors.primary,
    },
    cyclesTextActive: {
        color: colors.accent,
    },
    cyclesLabel: {
        fontSize: typography.caption.fontSize,
        fontWeight: '600',
        color: colors.tertiary,
    },
    deleteButton: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: spacing.sm,
        width: 80,
        backgroundColor: colors.error,
        borderRadius: radius.lg,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
