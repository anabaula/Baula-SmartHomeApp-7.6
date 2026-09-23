import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    type StyleProp,
    type ViewStyle,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

type SensorCardProps = {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value: string;
    description?: string;
    compact?: boolean;
    style?: StyleProp<ViewStyle>;
};

export default function SensorCard({
    icon,
    label,
    value,
    description,
    compact = false,
    style,
}: SensorCardProps) {

    return (
        <View style={[styles.card, compact && styles.cardCompact, style]}>

            <View style={styles.header}>

                <Ionicons
                    name={icon}
                    size={compact ? 22 : 30}
                />

                <Text style={[styles.name, compact && styles.nameCompact]}>
                    {label}
                </Text>

            </View>

            <Text style={[styles.value, compact && styles.valueCompact]}>
                {value}
            </Text>

            {description ? (
                <Text style={styles.description}>
                    {description}
                </Text>
            ) : null}

        </View>
    );
}

const styles = StyleSheet.create({

    card: {
        padding: 20,
        borderRadius: 15,
        backgroundColor: '#eeeeee',
        marginBottom: 15,
    },

    cardCompact: {
        marginBottom: 0,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },

    name: {
        fontSize: 17,
        fontWeight: 'bold',
    },

    nameCompact: {
        fontSize: 14,
    },

    value: {
        fontSize: 32,
        fontWeight: 'bold',
        marginTop: 20,
    },

    valueCompact: {
        fontSize: 28,
        marginTop: 10,
    },

    description: {
        fontSize: 13,
        marginTop: 5,
    },

});