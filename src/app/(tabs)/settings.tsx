/**
 * Settings Screen
 * 
 * Consistent thick borders, smaller toggle without bounce.
 */

import React from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    interpolateColor,
    Easing,
} from 'react-native-reanimated';
import { useSettings } from '@/contexts';
import { colors, spacing, radius, borders } from '@/constants/theme';
import { haptics } from '@/services/haptics';
import type { NotificationMode } from '@/types/settings';

const NOTIFICATION_MODES: { value: NotificationMode; label: string; icon: string; color: string }[] = [
    { value: 'sound', label: 'Sound', icon: 'volume-high-outline', color: '#A855F7' },
    { value: 'vibration', label: 'Vibration', icon: 'phone-portrait-outline', color: '#3B82F6' },
    { value: 'repeatingVibration', label: 'Alarm', icon: 'alarm-outline', color: '#F59E0B' },
    { value: 'none', label: 'Silent', icon: 'volume-mute-outline', color: '#6B7280' },
];

// Animated toggle component - no bounce, smooth timing
function AnimatedToggle({ value, onToggle }: { value: boolean; onToggle: () => void }) {
    const position = useSharedValue(value ? 1 : 0);

    React.useEffect(() => {
        position.value = withTiming(value ? 1 : 0, {
            duration: 200,
            easing: Easing.out(Easing.ease)
        });
    }, [value, position]);

    const thumbStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: position.value * 18 }],
    }));

    const trackStyle = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(
            position.value,
            [0, 1],
            [colors.toggleInactive, colors.toggleActive]
        ),
    }));

    return (
        <Pressable onPress={onToggle}>
            <Animated.View style={[styles.toggle, trackStyle]}>
                <Animated.View style={[styles.toggleThumb, thumbStyle]} />
            </Animated.View>
        </Pressable>
    );
}

export default function SettingsScreen() {
    const {
        settings,
        updateNotificationMode,
        toggleBreakNotification,
        toggleWorkNotification
    } = useSettings();

    const handleModeChange = async (mode: NotificationMode) => {
        await haptics.selectionFeedback();
        await updateNotificationMode(mode);
    };

    const handleToggle = async (toggle: () => Promise<void>) => {
        await haptics.selectionFeedback();
        await toggle();
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/* Notification Triggers */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Notifications</Text>
                <View style={styles.sectionContent}>
                    <View style={styles.settingRow}>
                        <View style={[styles.settingIcon, { backgroundColor: 'rgba(78, 205, 196, 0.15)' }]}>
                            <Ionicons name="cafe-outline" size={20} color={colors.accentBreak} />
                        </View>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>Break Start</Text>
                            <Text style={styles.settingDescription}>When work session ends</Text>
                        </View>
                        <AnimatedToggle
                            value={settings.notifications.notifyBreakStart}
                            onToggle={() => handleToggle(toggleBreakNotification)}
                        />
                    </View>

                    <View style={[styles.settingRow, styles.settingRowLast]}>
                        <View style={[styles.settingIcon, { backgroundColor: 'rgba(255, 107, 107, 0.15)' }]}>
                            <Ionicons name="flash-outline" size={20} color={colors.accent} />
                        </View>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>Work Resume</Text>
                            <Text style={styles.settingDescription}>When break ends</Text>
                        </View>
                        <AnimatedToggle
                            value={settings.notifications.notifyWorkResume}
                            onToggle={() => handleToggle(toggleWorkNotification)}
                        />
                    </View>
                </View>
            </View>

            {/* Notification Mode */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Alert Style</Text>
                <View style={styles.modeGrid}>
                    {NOTIFICATION_MODES.map((mode) => {
                        const isActive = settings.notifications.mode === mode.value;
                        return (
                            <TouchableOpacity
                                key={mode.value}
                                style={[
                                    styles.modeCard,
                                    isActive && styles.modeCardActive,
                                ]}
                                onPress={() => handleModeChange(mode.value)}
                                activeOpacity={0.7}
                            >
                                <View style={[
                                    styles.modeIconContainer,
                                    { backgroundColor: `${mode.color}20` },
                                    isActive && { backgroundColor: mode.color },
                                ]}>
                                    <Ionicons
                                        name={mode.icon as keyof typeof Ionicons.glyphMap}
                                        size={22}
                                        color={isActive ? '#FFF' : mode.color}
                                    />
                                </View>
                                <Text style={[
                                    styles.modeLabel,
                                    isActive && styles.modeLabelActive,
                                ]}>
                                    {mode.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            {/* About */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>About</Text>
                <View style={styles.sectionContent}>
                    <View style={[styles.aboutRow, styles.settingRowLast]}>
                        <Text style={styles.aboutLabel}>Version</Text>
                        <Text style={styles.aboutValue}>1.0.0</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        paddingVertical: spacing.lg,
    },
    section: {
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.secondary,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginHorizontal: spacing.lg,
        marginBottom: spacing.sm,
    },
    sectionContent: {
        backgroundColor: colors.surface,
        marginHorizontal: spacing.md,
        borderRadius: radius.lg,
        borderWidth: borders.thick,
        borderColor: colors.border,
        overflow: 'hidden',
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
        borderBottomWidth: borders.thick,
        borderBottomColor: colors.border,
    },
    settingRowLast: {
        borderBottomWidth: 0,
    },
    settingIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    settingInfo: {
        flex: 1,
    },
    settingLabel: {
        fontSize: 17,
        color: colors.primary,
        fontWeight: '600',
    },
    settingDescription: {
        fontSize: 13,
        color: colors.secondary,
        fontWeight: '500',
        marginTop: 2,
    },

    // Smaller toggle without bounce
    toggle: {
        width: 48,
        height: 28,
        borderRadius: 14,
        padding: 2,
        justifyContent: 'center',
    },
    toggleThumb: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 2,
    },

    // Mode grid
    modeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
        marginHorizontal: spacing.md,
    },
    modeCard: {
        flex: 1,
        minWidth: '45%',
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        padding: spacing.md,
        alignItems: 'center',
        gap: spacing.sm,
        borderWidth: borders.thick,
        borderColor: colors.border,
    },
    modeCardActive: {
        borderColor: colors.accent,
    },
    modeIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modeLabel: {
        fontSize: 14,
        color: colors.secondary,
        fontWeight: '600',
    },
    modeLabelActive: {
        color: colors.primary,
        fontWeight: '700',
    },
    aboutRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
    },
    aboutLabel: {
        fontSize: 17,
        color: colors.primary,
        fontWeight: '600',
    },
    aboutValue: {
        fontSize: 17,
        color: colors.secondary,
        fontWeight: '500',
    },
});
