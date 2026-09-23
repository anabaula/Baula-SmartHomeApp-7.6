import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Switch,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import type { Device } from '../models/IoTModels';

type DeviceCardProps = {
    device: Device;
    updating?: boolean;
    disabled?: boolean;
    onToggle: (id: number, value: boolean) => void;
};

export default function DeviceCard({
    device,
    updating = false,
    disabled = false,
    onToggle,
}: DeviceCardProps) {

    const statusLabel = updating
        ? 'Updating...'
        : device.status
            ? 'ON'
            : 'OFF';

    return (
        <View style={styles.card}>

            <View style={styles.info}>

                <View style={styles.iconContainer}>

                    <Ionicons
                        name={device.icon}
                        size={28}
                    />

                </View>

                <View style={styles.details}>

                    <Text style={styles.name}>
                        {device.name}
                    </Text>

                    <Text style={styles.type}>
                        {device.type}
                    </Text>

                    <Text style={[
                        styles.state,
                        device.status
                            ? styles.stateOn
                            : styles.stateOff,
                    ]}>
                        {statusLabel}
                    </Text>

                </View>

            </View>

            <Switch
                value={device.status}
                disabled={disabled || updating}
                onValueChange={(value) => {
                    onToggle(device.id, value);
                }}
            />

        </View>
    );
}

const styles = StyleSheet.create({

    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 18,
        borderRadius: 15,
        backgroundColor: '#eeeeee',
        marginBottom: 15,
    },

    info: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },

    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },

    details: {
        flex: 1,
    },

    name: {
        fontSize: 16,
        fontWeight: 'bold',
    },

    type: {
        fontSize: 13,
        marginTop: 3,
    },

    state: {
        fontSize: 12,
        marginTop: 5,
        fontWeight: 'bold',
    },

    stateOn: {
        color: '#168a3e',
    },

    stateOff: {
        color: '#888888',
    },

});