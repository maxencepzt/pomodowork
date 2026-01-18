import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useStats } from '@/contexts/StatsContext';
import { colors, typography, spacing } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function StatsScreen() {
    const { totalWorkMs } = useStats();
    const insets = useSafeAreaInsets();

    // Provide 1 decimal place if < 10 hours for better detail? Or just integer.
    // User asked "sous forme d'heure de travail". 
    // Let's do "12.5 h" format or "12 h 30 min".
    // "sous forme d'heure" suggests number.

    // Let's refine formatting:
    const hours = Math.floor(totalWorkMs / (1000 * 60 * 60));
    const minutes = Math.floor((totalWorkMs % (1000 * 60 * 60)) / (1000 * 60));

    return (
        <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom + 80 }]}>
            <Text style={styles.title}>Statistics</Text>

            <View style={styles.card}>
                <Text style={styles.label}>Total Focus Time</Text>
                <Text style={styles.value}>
                    {hours}<Text style={styles.unit}>h</Text> {minutes}<Text style={styles.unit}>m</Text>
                </Text>
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
    title: {
        ...typography.title,
        fontSize: 32,
        marginBottom: spacing.xl,
        color: colors.primary,
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: 20,
        padding: spacing.xl,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 5,
        borderWidth: 1,
        borderColor: colors.border,
    },
    label: {
        ...typography.body,
        color: colors.secondary,
        marginBottom: spacing.sm,
    },
    value: {
        ...typography.display,
        fontSize: 64,
        color: colors.accent,
    },
    unit: {
        fontSize: 24,
        color: colors.secondary,
        fontWeight: '400',
    },
});
