import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useStats } from '@/contexts/StatsContext';
import { colors, typography, spacing, radius } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

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
        <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom + 80 }]}>
            <View style={styles.header}>
                <Text style={styles.title}>Productivity</Text>
            </View>

            <View style={styles.grid}>
                {/* Total Time Card - Large */}
                <View style={[styles.card, styles.cardLarge]}>
                    <LinearGradient
                        colors={[colors.surface, '#F8F8F8']}
                        style={StyleSheet.absoluteFill}
                    />
                    <View style={styles.iconContainer}>
                        <Ionicons name="time" size={24} color={colors.accent} />
                    </View>
                    <View>
                        <Text style={styles.valueLarge}>
                            {hours}<Text style={styles.unitLarge}>h</Text> {minutes}<Text style={styles.unitLarge}>m</Text>
                        </Text>
                        <Text style={styles.label}>Total Focus Time</Text>
                    </View>
                </View>

                <View style={styles.row}>
                    {/* Sessions Card */}
                    <View style={styles.card}>
                        <View style={[styles.iconContainer, { backgroundColor: '#E3F2FD' }]}>
                            <Ionicons name="checkmark-circle" size={20} color="#2196F3" />
                        </View>
                        <Text style={styles.value}>{totalSessions}</Text>
                        <Text style={styles.label}>Sessions Completed</Text>
                    </View>

                    {/* Average Time Card */}
                    <View style={styles.card}>
                        <View style={[styles.iconContainer, { backgroundColor: '#E8F5E9' }]}>
                            <Ionicons name="stats-chart" size={20} color="#4CAF50" />
                        </View>
                        <Text style={styles.value}>{averageMinutes}<Text style={styles.unit}>m</Text></Text>
                        <Text style={styles.label}>Avg Session Length</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: spacing.lg,
    },
    header: {
        marginBottom: spacing.xl,
        marginTop: spacing.md,
    },
    title: {
        ...typography.title,
        fontSize: 34,
        color: colors.primary,
        letterSpacing: -0.5,
    },
    grid: {
        gap: spacing.md,
    },
    row: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: radius.xl,
        padding: spacing.lg,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
        elevation: 3,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.02)',
        flex: 1,
        overflow: 'hidden',
    },
    cardLarge: {
        paddingVertical: spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.sm,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFF3E0',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.md,
    },
    label: {
        ...typography.caption,
        color: colors.secondary,
        fontWeight: '600',
        marginTop: spacing.xs,
        letterSpacing: 0.2,
    },
    value: {
        fontSize: 32,
        fontWeight: '700',
        color: colors.primary,
        fontFamily: 'System',
    },
    valueLarge: {
        fontSize: 56,
        fontWeight: '800',
        color: colors.primary,
        letterSpacing: -1,
        textAlign: 'center',
    },
    unit: {
        fontSize: 18,
        color: colors.secondary,
        fontWeight: '500',
    },
    unitLarge: {
        fontSize: 24,
        color: colors.secondary,
        fontWeight: '500',
    },
});
