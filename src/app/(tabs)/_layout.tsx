/**
 * Tab Layout
 * 
 * iOS-style bottom tab navigation with gradient + blur.
 * Absolute positioning for true transparency effect.
 */

import React from 'react';
import { Tabs } from 'expo-router';
import { StyleSheet, View, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography } from '@/constants/theme';

// Custom tab bar background with gradient and blur
function TabBarBackground() {
    if (Platform.OS === 'web') {
        return (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.surface }]} />
        );
    }
    return (
        <View style={StyleSheet.absoluteFill}>
            {/* Gradient fade at top - from transparent to dark */}
            <LinearGradient
                colors={['rgba(13,13,13,0)', 'rgba(13,13,13,0.8)', 'rgba(13,13,13,1)']}
                locations={[0, 0.2, 1]}
                style={StyleSheet.absoluteFill}
            />
            {/* Blur effect */}
            <BlurView
                intensity={80}
                tint="dark"
                style={[StyleSheet.absoluteFill, { backgroundColor: 'transparent' }]}
            />
        </View>
    );
}

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.tertiary,
                tabBarStyle: styles.tabBar,
                tabBarItemStyle: styles.tabBarItem,
                tabBarLabelStyle: styles.tabBarLabel,
                tabBarShowLabel: true,
                tabBarBackground: () => <TabBarBackground />,
                headerStyle: styles.header,
                headerTitleStyle: styles.headerTitle,
                headerShadowVisible: false,
                headerTintColor: colors.primary,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Timer',
                    headerShown: false,
                    tabBarIcon: ({ focused, color }) => (
                        <Ionicons
                            name={focused ? 'timer' : 'timer-outline'}
                            size={26}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="profiles"
                options={{
                    title: 'Profiles',
                    headerTitle: 'Profiles',
                    headerShown: true,
                    tabBarIcon: ({ focused, color }) => (
                        <Ionicons
                            name={focused ? 'layers' : 'layers-outline'}
                            size={26}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="stats"
                options={{
                    title: 'Stats',
                    headerTitle: 'Statistics',
                    headerShown: true,
                    tabBarIcon: ({ focused, color }) => (
                        <Ionicons
                            name={focused ? 'stats-chart' : 'stats-chart-outline'}
                            size={26}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    headerTitle: 'Settings',
                    headerShown: true,
                    tabBarIcon: ({ focused, color }) => (
                        <Ionicons
                            name={focused ? 'settings' : 'settings-outline'}
                            size={26}
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'transparent',
        borderTopWidth: 0,
        height: 85,
        elevation: 0,
    },
    tabBarItem: {
        paddingTop: 12,
        paddingBottom: 8,
    },
    tabBarLabel: {
        fontSize: 10,
        fontWeight: '600',
        marginTop: 4,
    },
    header: {
        backgroundColor: colors.background,
    },
    headerTitle: {
        fontSize: typography.title.fontSize,
        fontWeight: typography.title.fontWeight,
        color: colors.primary,
    },
});
