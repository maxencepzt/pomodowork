/**
 * SettingRow Component
 * 
 * A single row in the settings screen.
 */

import React from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, typography, spacing, radius } from '@/constants/theme';

interface SettingRowProps {
    label: string;
    description?: string;
    type: 'toggle' | 'action';
    value?: boolean;
    onToggle?: () => void;
    onPress?: () => void;
    rightText?: string;
}

export function SettingRow({
    label,
    description,
    type,
    value,
    onToggle,
    onPress,
    rightText,
}: SettingRowProps) {
    const Container = type === 'action' ? TouchableOpacity : View;

    return (
        <Container
            style={styles.container}
            onPress={type === 'action' ? onPress : undefined}
            activeOpacity={0.7}
        >
            <View style={styles.content}>
                <Text style={styles.label}>{label}</Text>
                {description && (
                    <Text style={styles.description}>{description}</Text>
                )}
            </View>

            {type === 'toggle' && (
                <Switch
                    value={value}
                    onValueChange={onToggle}
                    trackColor={{ false: colors.border, true: colors.accent }}
                    thumbColor="#FFFFFF"
                />
            )}

            {type === 'action' && rightText && (
                <View style={styles.actionRight}>
                    <Text style={styles.rightText}>{rightText}</Text>
                    <Text style={styles.chevron}>›</Text>
                </View>
            )}
        </Container>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.border,
    },
    content: {
        flex: 1,
    },
    label: {
        fontSize: typography.body.fontSize,
        color: colors.primary,
    },
    description: {
        fontSize: typography.caption.fontSize,
        color: colors.secondary,
        marginTop: spacing.xs,
    },
    actionRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rightText: {
        fontSize: typography.body.fontSize,
        color: colors.secondary,
        marginRight: spacing.xs,
    },
    chevron: {
        fontSize: 20,
        color: colors.tertiary,
        fontWeight: '300',
    },
});
