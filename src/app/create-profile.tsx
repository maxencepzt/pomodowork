/**
 * Create Profile Screen (Modal)
 * 
 * Consistent thick borders throughout.
 */

import React, { useState, useMemo } from 'react';
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { useProfiles } from '@/contexts';
import { colors, typography, spacing, radius, borders } from '@/constants/theme';
import { DEFAULTS } from '@/constants/defaults';
import { formDataToProfile, type ProfileFormData } from '@/types/profile';
import { calculateActualSessionDuration } from '@/utils/calculations';
import { haptics } from '@/services/haptics';

export default function CreateProfileScreen() {
    const router = useRouter();
    const { addProfile, setActiveProfile } = useProfiles();

    const [formData, setFormData] = useState<ProfileFormData>({
        name: '',
        workDurationMinutes: DEFAULTS.workDuration.default,
        breakDurationMinutes: DEFAULTS.breakDuration.default,
        sessionDurationHours: DEFAULTS.sessionDuration.default,
    });

    const preview = useMemo(() => {
        return calculateActualSessionDuration(
            formData.workDurationMinutes,
            formData.breakDurationMinutes,
            formData.sessionDurationHours
        );
    }, [formData.workDurationMinutes, formData.breakDurationMinutes, formData.sessionDurationHours]);

    const handleSave = async () => {
        if (!formData.name.trim()) {
            return;
        }

        const profile = formDataToProfile({
            ...formData,
            name: formData.name.trim(),
        });

        await addProfile(profile);
        await setActiveProfile(profile.id);
        await haptics.mediumImpact();
        router.back();
    };

    const handleCancel = () => {
        router.back();
    };

    const handleSliderChange = async () => {
        await haptics.selectionFeedback();
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
                    <Ionicons name="close" size={24} color={colors.secondary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>New Profile</Text>
                <TouchableOpacity
                    onPress={handleSave}
                    disabled={!formData.name.trim()}
                    style={styles.headerButton}
                >
                    <Ionicons
                        name="checkmark"
                        size={24}
                        color={formData.name.trim() ? colors.accent : colors.tertiary}
                    />
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                keyboardShouldPersistTaps="handled"
            >
                {/* Name input */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Profile Name</Text>
                    <TextInput
                        style={styles.textInput}
                        value={formData.name}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                        placeholder="e.g., Deep Work, Study Session"
                        placeholderTextColor={colors.tertiary}
                        autoFocus
                    />
                </View>

                {/* Work duration */}
                <View style={styles.inputGroup}>
                    <View style={styles.sliderHeader}>
                        <Text style={styles.label}>Work Duration</Text>
                        <Text style={[styles.sliderValue, { color: colors.accent }]}>{formData.workDurationMinutes} min</Text>
                    </View>
                    <Slider
                        style={styles.slider}
                        minimumValue={DEFAULTS.workDuration.min}
                        maximumValue={DEFAULTS.workDuration.max}
                        step={DEFAULTS.workDuration.step}
                        value={formData.workDurationMinutes}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, workDurationMinutes: value }))}
                        onSlidingComplete={handleSliderChange}
                        minimumTrackTintColor={colors.accent}
                        maximumTrackTintColor={colors.border}
                        thumbTintColor={colors.accent}
                    />
                </View>

                {/* Break duration */}
                <View style={styles.inputGroup}>
                    <View style={styles.sliderHeader}>
                        <Text style={styles.label}>Break Duration</Text>
                        <Text style={[styles.sliderValue, { color: colors.accentBreak }]}>{formData.breakDurationMinutes} min</Text>
                    </View>
                    <Slider
                        style={styles.slider}
                        minimumValue={DEFAULTS.breakDuration.min}
                        maximumValue={DEFAULTS.breakDuration.max}
                        step={DEFAULTS.breakDuration.step}
                        value={formData.breakDurationMinutes}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, breakDurationMinutes: value }))}
                        onSlidingComplete={handleSliderChange}
                        minimumTrackTintColor={colors.accentBreak}
                        maximumTrackTintColor={colors.border}
                        thumbTintColor={colors.accentBreak}
                    />
                </View>

                {/* Session duration */}
                <View style={styles.inputGroup}>
                    <View style={styles.sliderHeader}>
                        <Text style={styles.label}>Session Duration</Text>
                        <Text style={styles.sliderValue}>{formData.sessionDurationHours}h</Text>
                    </View>
                    <Slider
                        style={styles.slider}
                        minimumValue={DEFAULTS.sessionDuration.min}
                        maximumValue={DEFAULTS.sessionDuration.max}
                        step={DEFAULTS.sessionDuration.step}
                        value={formData.sessionDurationHours}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, sessionDurationHours: value }))}
                        onSlidingComplete={handleSliderChange}
                        minimumTrackTintColor={colors.secondary}
                        maximumTrackTintColor={colors.border}
                        thumbTintColor={colors.primary}
                    />
                </View>

                {/* Preview */}
                <View style={styles.preview}>
                    <View style={styles.previewItem}>
                        <Text style={styles.previewValue}>{preview.cycles}</Text>
                        <Text style={styles.previewLabel}>cycles</Text>
                    </View>
                    <View style={styles.previewDivider} />
                    <View style={styles.previewItem}>
                        <Text style={styles.previewValue}>
                            {(preview.actualMinutes / 60).toFixed(1)}h
                        </Text>
                        <Text style={styles.previewLabel}>total time</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        borderBottomWidth: borders.thick,
        borderBottomColor: colors.border,
    },
    headerButton: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: typography.headline.fontSize,
        fontWeight: '700',
        color: colors.primary,
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: spacing.lg,
    },
    inputGroup: {
        marginBottom: spacing.xl,
    },
    label: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.secondary,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: spacing.sm,
    },
    textInput: {
        backgroundColor: colors.surface,
        borderRadius: radius.md,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        fontSize: 17,
        fontWeight: '500',
        color: colors.primary,
        borderWidth: borders.thick,
        borderColor: colors.border,
    },
    sliderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    sliderValue: {
        fontSize: 22,
        fontWeight: '700',
        color: colors.primary,
    },
    slider: {
        width: '100%',
        height: 40,
    },
    preview: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        padding: spacing.lg,
        marginTop: spacing.md,
        borderWidth: borders.thick,
        borderColor: colors.border,
    },
    previewItem: {
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
    },
    previewValue: {
        fontSize: 28,
        fontWeight: '600',
        color: colors.primary,
    },
    previewLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.secondary,
        marginTop: spacing.xs,
    },
    previewDivider: {
        width: 2,
        height: 40,
        backgroundColor: colors.border,
    },
});
