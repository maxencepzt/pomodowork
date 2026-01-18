/**
 * Profiles Screen
 * 
 * List of profiles with swipe-to-delete.
 */

import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ProfileCard } from '@/components/profiles';
import { useProfiles } from '@/contexts';
import { colors, typography, spacing, radius, borders } from '@/constants/theme';
import { haptics } from '@/services/haptics';
import type { Profile } from '@/types/profile';

export default function ProfilesScreen() {
    const router = useRouter();
    const { profiles, activeProfileId, setActiveProfile, deleteProfile, isLoading } = useProfiles();

    const handleCreatePress = async () => {
        await haptics.lightImpact();
        router.push('/create-profile');
    };

    const handleSelectProfile = async (profile: Profile) => {
        await haptics.selectionFeedback();
        await setActiveProfile(profile.id);
    };

    const handleDeleteProfile = async (profile: Profile) => {
        // Don't allow deleting if only 1 profile left
        if (profiles.length <= 1) return;

        await haptics.mediumImpact();
        await deleteProfile(profile.id);

        // If we deleted the active profile, select the first one
        if (profile.id === activeProfileId && profiles.length > 1) {
            const remaining = profiles.filter(p => p.id !== profile.id);
            if (remaining.length > 0) {
                await setActiveProfile(remaining[0].id);
            }
        }
    };

    const renderProfile = ({ item }: { item: Profile }) => (
        <ProfileCard
            profile={item}
            isActive={item.id === activeProfileId}
            onSelect={() => handleSelectProfile(item)}
            onDelete={() => handleDeleteProfile(item)}
            canDelete={profiles.length > 1}
        />
    );

    if (isLoading) {
        return (
            <View style={styles.container}>
                <View style={styles.loading}>
                    <Text style={styles.loadingText}>Loading...</Text>
                </View>
            </View>
        );
    }

    return (
        <GestureHandlerRootView style={styles.container}>
            {/* Create button at top */}
            <TouchableOpacity
                style={styles.createButton}
                onPress={handleCreatePress}
                activeOpacity={0.7}
            >
                <View style={styles.createIcon}>
                    <Ionicons name="add" size={24} color="#FFF" />
                </View>
                <Text style={styles.createText}>Create New Profile</Text>
            </TouchableOpacity>

            {/* Profiles list */}
            <FlatList
                data={profiles}
                renderItem={renderProfile}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    createButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        marginHorizontal: spacing.md,
        marginTop: spacing.md,
        marginBottom: spacing.sm,
        padding: spacing.md,
        borderRadius: radius.lg,
        borderWidth: borders.thick,
        borderColor: colors.border,
        borderStyle: 'dashed',
    },
    createIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.accent,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    createText: {
        fontSize: typography.body.fontSize,
        color: colors.primary,
        fontWeight: '600',
    },
    listContent: {
        padding: spacing.md,
        paddingBottom: 100, // Space for absolute tab bar
    },
    loading: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        fontSize: typography.body.fontSize,
        color: colors.secondary,
        fontWeight: '500',
    },
});
