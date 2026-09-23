import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { useIoT } from '../../context/IoTContext';
import DeviceCard from '../../components/DeviceCard';
import SensorCard from '../../components/SensorCard';
import GatewayBanner from '../../components/GatewayBanner';

export default function DashboardScreen() {

    const {
        devices,
        sensors,
        sensorsLoading,
        gatewayConnected,
        gatewayConnecting,
        updatingDeviceIds,
        toggleDevice,
        reconnectGateway,
    } = useIoT();

    return (
        <View style={styles.container}>

            <Text style={styles.greeting}>
                Good evening
            </Text>

            <Text style={styles.title}>
                IoT Dashboard
            </Text>

            <GatewayBanner
                connecting={gatewayConnecting}
                connected={gatewayConnected}
                onReconnect={reconnectGateway}
            />

            <View style={styles.sensorRow}>

                <SensorCard
                    compact
                    style={styles.sensorCard}
                    icon="thermometer-outline"
                    label="Temperature"
                    value={sensorsLoading ? '—' : `${sensors.temperature}°C`}
                />

                <SensorCard
                    compact
                    style={styles.sensorCard}
                    icon="water-outline"
                    label="Humidity"
                    value={sensorsLoading ? '—' : `${sensors.humidity}%`}
                />

            </View>

            <Text style={styles.sectionTitle}>
                Device Status
            </Text>

            {devices.map((device) => (
                <DeviceCard
                    key={device.id}
                    device={device}
                    updating={!!updatingDeviceIds[device.id]}
                    disabled={!gatewayConnected || gatewayConnecting}
                    onToggle={toggleDevice}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        padding: 20,
    },

    greeting: {
        fontSize: 14,
    },

    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 5,
    },

    sensorRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 25,
    },

    sensorCard: {
        flex: 1,
    },

    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 30,
        marginBottom: 12,
    },

});