import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  ActivityIndicator,
  Pressable,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { useIoT } from '../../context/IoTContext';

export default function DevicesScreen() {

  const {
    devices,
    devicesLoading,
    devicesError,
    deviceUpdateError,
    gatewayConnected,
    gatewayConnecting,
    updatingDeviceIds,
    toggleDevice,
    loadDevices,
    reconnectGateway,
  } = useIoT();

  const gatewayOffline = !gatewayConnected || gatewayConnecting;

  return (
    <ScrollView style={styles.container}>

      <Text style={styles.title}>
        Devices
      </Text>

      <Text style={styles.subtitle}>
        Control your connected devices
      </Text>

      {gatewayConnecting && (
        <View style={styles.gatewayCard}>
          <ActivityIndicator
            size="small"
          />
          <Text style={styles.gatewayText}>
            Connecting to IoT Gateway...
          </Text>
        </View>
      )}

      {!gatewayConnected && !gatewayConnecting && (
        <View style={styles.gatewayCardOffline}>
          <View style={styles.gatewayInfo}>
            <Ionicons
              name="cloud-offline-outline"
              size={22}
              color="#b71c1c"
            />
            <Text style={styles.gatewayTextOffline}>
              IoT Gateway is disconnected.
            </Text>
          </View>

          <Pressable
            style={styles.retryButton}
            onPress={reconnectGateway}
          >
            <Text style={styles.retryButtonText}>
              Reconnect
            </Text>
          </Pressable>
        </View>
      )}

      {deviceUpdateError && (
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>
            {deviceUpdateError}
          </Text>
        </View>
      )}

      {devicesLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" />
          <Text style={styles.loadingText}>
            Loading devices...
          </Text>
        </View>
      ) : devicesError ? (
        <View style={styles.errorContainer}>
          <Ionicons
            name="alert-circle-outline"
            size={40}
            color="#b71c1c"
          />
          <Text style={styles.errorText}>
            {devicesError}
          </Text>
          <Pressable
            style={styles.retryButton}
            onPress={loadDevices}
          >
            <Text style={styles.retryButtonText}>
              Retry
            </Text>
          </Pressable>
        </View>
      ) : (
        devices.map((device) => {

          const isUpdating = !!updatingDeviceIds[device.id];

          const statusLabel = isUpdating
            ? 'Updating...'
            : device.status
              ? 'ON'
              : 'OFF';

          return (
            <View
              key={device.id}
              style={styles.deviceCard}
            >

              <View style={styles.deviceInfo}>

                <View style={styles.iconContainer}>

                  <Ionicons
                    name={device.icon}
                    size={28}
                  />

                </View>

                <View style={styles.deviceDetails}>

                  <Text style={styles.deviceName}>
                    {device.name}
                  </Text>

                  <Text style={styles.deviceType}>
                    {device.type}
                  </Text>

                  <Text style={[
                    styles.deviceState,
                    device.status
                      ? styles.deviceStateOn
                      : styles.deviceStateOff,
                  ]}>
                    {statusLabel}
                  </Text>

                </View>

              </View>

              <Switch
                value={device.status}
                disabled={isUpdating || gatewayOffline}
                onValueChange={(value) => {
                  toggleDevice(device.id, value);
                }}
              />

            </View>
          );
        })
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },

  subtitle: {
    fontSize: 14,
    marginTop: 5,
    marginBottom: 25,
  },

  gatewayCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#fff3cd',
    marginBottom: 15,
  },

  gatewayCardOffline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#fdecea',
    marginBottom: 15,
  },

  gatewayInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },

  gatewayText: {
    fontSize: 13,
    color: '#856404',
  },

  gatewayTextOffline: {
    fontSize: 13,
    color: '#b71c1c',
    flex: 1,
  },

  errorCard: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#fdecea',
    marginBottom: 15,
  },

  errorContainer: {
    alignItems: 'center',
    padding: 30,
    gap: 12,
  },

  errorText: {
    fontSize: 14,
    color: '#b71c1c',
    textAlign: 'center',
  },

  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 30,
  },

  loadingText: {
    fontSize: 14,
    color: '#666666',
  },

  retryButton: {
    backgroundColor: '#007aff',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },

  retryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },

  deviceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderRadius: 15,
    backgroundColor: '#eeeeee',
    marginBottom: 15,
  },

  deviceInfo: {
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

  deviceDetails: {
    flex: 1,
  },

  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  deviceType: {
    fontSize: 13,
    marginTop: 3,
  },

  deviceState: {
    fontSize: 12,
    marginTop: 5,
    fontWeight: 'bold',
  },

  deviceStateOn: {
    color: '#168a3e',
  },

  deviceStateOff: {
    color: '#888888',
  },

});