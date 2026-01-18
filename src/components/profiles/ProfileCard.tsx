/**
 * ProfileCard Component with Swipe-to-Delete
 * 
 * Swipe left to reveal delete action, continue to delete.
 */

import React from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
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
import { formatProfileSummary } from '@/utils/calculations';
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
    const summary = formatProfileSummary(profile);

    const translateX = useSharedValue(0);

    const handleDelete = () => {
        if (onDelete && canDelete) {
            onDelete();
        }
    };

    const handleSelect = () => {
        onSelect();
    };

    const panGesture = Gesture.Pan()
        .activeOffsetX([-10, 10])
        .onUpdate((e) => {
            if (!canDelete) {
                translateX.value = 0;
                return;
            }
            // Only allow left swipe
            translateX.value = Math.min(0, e.translationX);
        })
        .onEnd(() => {
            if (!canDelete) {
                translateX.value = withSpring(0, { damping: 20 });
                return;
            }

            if (translateX.value < DELETE_THRESHOLD) {
                // Delete - animate out
                translateX.value = withTiming(-SCREEN_WIDTH, { duration: 200 }, () => {
                    runOnJS(handleDelete)();
                });
            } else if (translateX.value < SNAP_POINT / 2) {
                // Snap to show delete button
                translateX.value = withSpring(SNAP_POINT, { damping: 20 });
            } else {
                // Snap back
                translateX.value = withSpring(0, { damping: 20 });
            }
        });

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

    // If cannot delete, render simple touchable
    if (!canDelete) {
        return (
            <TouchableOpacity
                style={[styles.container, isActive && styles.containerActive]}
                onPress={onSelect}
                activeOpacity={0.7}
            >
                <View style={styles.content}>
                    <Text style={[styles.name, isActive && styles.nameActive]}>
                        {profile.name}
                    </Text>
                    <Text style={styles.summary}>{summary}</Text>
                </View>

                <View style={styles.cyclesBadge}>
                    <Text style={[styles.cyclesText, isActive && styles.cyclesTextActive]}>
                        {profile.completedSessions || 0}
                    </Text>
                    <Text style={styles.cyclesLabel}>sessions</Text>
                </View>
            </TouchableOpacity>
        );
    }

    return (
        <View style={styles.wrapper}>
            {/* Delete button behind */}
            <Animated.View style={[styles.deleteButton, deleteButtonStyle]}>
                <Ionicons name="trash-outline" size={24} color="#FFF" />
            </Animated.View>

            {/* Card */}
            <GestureDetector gesture={panGesture}>
                <Animated.View style={[styles.container, isActive && styles.containerActive, cardStyle]}>
                    <TouchableOpacity
                        style={styles.cardContent}
                        onPress={handleSelect}
                        activeOpacity={0.8}
                    >
                        <View style={styles.content}>
                            <Text style={[styles.name, isActive && styles.nameActive]}>
                                {profile.name}
                            </Text>
                            <Text style={styles.summary}>{summary}</Text>
                        </View>

                        <View style={styles.cyclesBadge}>
                            <Text style={[styles.cyclesText, isActive && styles.cyclesTextActive]}>
                                {profile.completedSessions || 0}
                            </Text>
                            <Text style={styles.cyclesLabel}>sessions</Text>
                        </View>
                    </TouchableOpacity>
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
        marginBottom: spacing.sm,
    },
    containerActive: {
        borderColor: colors.accent,
        backgroundColor: colors.surfaceElevated,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
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
