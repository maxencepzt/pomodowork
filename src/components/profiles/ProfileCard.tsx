/**
 * ProfileCard Component
 * 
 * Consistent borders, no checkmark icon.
 */

import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { colors, typography, spacing, radius, borders } from '@/constants/theme';
import { formatProfileSummary, calculateTotalCycles } from '@/utils/calculations';
import type { Profile } from '@/types/profile';

interface ProfileCardProps {
    profile: Profile;
    isActive: boolean;
    onSelect: () => void;
}

export function ProfileCard({ profile, isActive, onSelect }: ProfileCardProps) {
    const cycles = calculateTotalCycles(profile);
    const summary = formatProfileSummary(profile);

    return (
        <TouchableOpacity
            style={[
                styles.container,
                isActive && styles.containerActive,
            ]}
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
                <Text style={[styles.cyclesText, isActive && styles.cyclesTextActive]}>{cycles}</Text>
                <Text style={styles.cyclesLabel}>cycles</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        padding: spacing.md,
        marginBottom: spacing.sm,
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
});
