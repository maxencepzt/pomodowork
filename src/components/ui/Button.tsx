/**
 * Reusable UI Button Component
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, type ViewStyle, type TextStyle } from 'react-native';
import { colors, typography, spacing, radius } from '@/constants/theme';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    fullWidth?: boolean;
}

export function Button({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    fullWidth = false,
}: ButtonProps) {
    const containerStyles: ViewStyle[] = [
        styles.container,
        styles[`container_${variant}`],
        styles[`container_${size}`],
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
    ];

    const textStyles: TextStyle[] = [
        styles.text,
        styles[`text_${variant}`],
        styles[`text_${size}`],
    ];

    return (
        <TouchableOpacity
            style={containerStyles}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.7}
        >
            <Text style={textStyles}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: radius.md,
    },
    fullWidth: {
        width: '100%',
    },
    disabled: {
        opacity: 0.5,
    },

    // Variants
    container_primary: {
        backgroundColor: colors.accent,
    },
    container_secondary: {
        backgroundColor: colors.ringBackground,
    },
    container_ghost: {
        backgroundColor: 'transparent',
    },

    // Sizes
    container_small: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
    },
    container_medium: {
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
    },
    container_large: {
        paddingVertical: spacing.md + 2,
        paddingHorizontal: spacing.xl,
    },

    text: {
        fontWeight: '600',
    },

    // Text variants
    text_primary: {
        color: '#FFFFFF',
    },
    text_secondary: {
        color: colors.primary,
    },
    text_ghost: {
        color: colors.accent,
    },

    // Text sizes
    text_small: {
        fontSize: typography.footnote.fontSize,
    },
    text_medium: {
        fontSize: typography.body.fontSize,
    },
    text_large: {
        fontSize: typography.body.fontSize,
    },
});
