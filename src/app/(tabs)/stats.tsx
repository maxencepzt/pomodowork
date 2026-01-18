import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useStats } from '@/contexts/StatsContext';
import { colors, typography, spacing, radius, borders } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function StatsScreen() {
    const { totalWorkMs, totalSessions } = useStats();
    const insets = useSafeAreaInsets();

    const hours = Math.floor(totalWorkMs / (1000 * 60 * 60));
    const minutes = Math.floor((totalWorkMs % (1000 * 60 * 60)) / (1000 * 60));

    // Average session length
    const averageMinutes = totalSessions > 0
        ? Math.round((totalWorkMs / (1000 * 60)) / totalSessions)
        : 0;

    return (
        <ScrollView
            style={[styles.container]}
            contentContainerStyle={{ paddingTop: insets.top + spacing.md, paddingBottom: insets.bottom + 80, paddingHorizontal: spacing.lg }}
        >
            <Text style={styles.pageTitle}>Statistics</Text>

            <View style={styles.grid}>
                {/* Total Time Card - Large */}
                <View style={styles.cardLarge}>
                    <View style={styles.headerRow}>
                        <View style={[styles.settingIcon, { backgroundColor: 'rgba(255, 107, 107, 0.15)' }]}>
                            <Ionicons name="time" size={24} color={colors.accent} />
                        </View>
                        <Text style={styles.cardLabel}>TIME FOCUSED</Text>
                    </View>

                    <View style={styles.valueContainer}>
                        <Text style={styles.valueLarge}>
                            {hours}<Text style={styles.unitLarge}>h</Text> {minutes}<Text style={styles.unitLarge}>m</Text>
                        </Text>
                    </View>
                </View>

                <View style={styles.row}>
                    {/* Sessions Card */}
                    <View style={styles.card}>
                        <View style={[styles.settingIcon, { backgroundColor: 'rgba(34, 197, 94, 0.15)' }]}>
                            <Ionicons name="file-tray-full-outline" size={22} color={colors.success} />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit>{totalSessions}</Text>
                            <Text style={styles.labelSmall} numberOfLines={1}>SESSIONS</Text>
                        </View>
                    </View>

                    {/* Average Time Card */}
                    <View style={styles.card}>
                        <View style={[styles.settingIcon, { backgroundColor: 'rgba(78, 205, 196, 0.15)' }]}>
                            <Ionicons name="stats-chart" size={22} color={colors.accentBreak} />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit>{averageMinutes}<Text style={styles.unit}>m</Text></Text>
                            <Text style={styles.labelSmall} numberOfLines={1}>AVG LENGTH</Text>
                        </View>
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
    pageTitle: {
        ...typography.title,
        fontSize: 34,
        color: colors.primary,
        marginBottom: spacing.xl,
        marginTop: spacing.sm,
    },
    grid: {
        gap: spacing.md,
    },
    row: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    // Consistent with ProfileCard style
    cardLarge: {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        padding: spacing.lg,
        borderWidth: borders.thick,
        borderColor: colors.border,
        width: '100%',
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        padding: spacing.md,
        borderWidth: borders.thick,
        borderColor: colors.border,
        flex: 1,
        // Row layout for alignment
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: spacing.sm, // Reduced gap to give more space to text
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
        gap: spacing.sm,
    },
    settingIcon: {
        width: 44,
        height: 44,
        borderRadius: 12, // More squared like settings
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardLabel: {
        ...typography.headline,
        fontSize: 14,
        color: colors.secondary,
        letterSpacing: 1,
        fontWeight: '700',
    },
    labelSmall: {
        ...typography.caption,
        color: colors.tertiary,
        fontWeight: '700',
        letterSpacing: 1,
        marginTop: spacing.xs,
    },
    valueContainer: {
        alignItems: 'center',
        paddingVertical: spacing.md,
    },
    valueLarge: {
        ...typography.display,
        fontSize: 56,
        color: colors.primary,
        fontWeight: '700',
    },
    value: {
        ...typography.title,
        fontSize: 32,
        color: colors.primary,
        marginBottom: spacing.xs,
    },
    unit: {
        fontSize: 18,
        color: colors.secondary,
        fontWeight: '500',
    },
    unitLarge: {
        fontSize: 24,
        color: colors.tertiary,
        fontWeight: '400',
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: 4, // Push text block down slightly for optical alignment
    },
});
