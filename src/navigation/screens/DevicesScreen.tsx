import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { useIoT } from '../../context/IoTContext';
import DeviceCard from '../../components/DeviceCard';
import GatewayBanner from '../../components/GatewayBanner';

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
    dismissDeviceUpdateError,
  } = useIoT();

  const switchesDisabled = !gatewayConnected || gatewayConnecting;

  return (
    <ScrollView style={styles.container}>

      <Text style={styles.title}>
        Devices
      </Text>

      <Text style={styles.subtitle}>
        Control your connected devices
      </Text>

      <GatewayBanner
        connecting={gatewayConnecting}
        connected={gatewayConnected}
        onReconnect={reconnectGateway}
      />

      {deviceUpdateError && (
        <View style={styles.errorBanner}>
          <Ionicons
            name="alert-circle-outline"
            size={18}
            color="#b71c1c"
          />
          <Text style={styles.errorText}>
            {deviceUpdateError}
          </Text>
          <Pressable
            onPress={dismissDeviceUpdateError}
            hitSlop={10}
          >
            <Ionicons
              name="close-circle-outline"
              size={20}
              color="#b71c1c"
            />
          </Pressable>
        </View>
      )}

      {devicesLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="small" />
          <Text style={styles.mutedText}>
            Loading devices...
          </Text>
        </View>
      ) : devicesError ? (
        <View style={styles.centered}>
          <Ionicons
            name="alert-circle-outline"
            size={40}
            color="#b71c1c"
          />
          <Text style={styles.errorText}>
            {devicesError}
          </Text>
          <Pressable
            style={styles.primaryButton}
            onPress={loadDevices}
          >
            <Text style={styles.primaryButtonText}>
              Retry
            </Text>
          </Pressable>
        </View>
      ) : devices.length === 0 ? (
        <View style={styles.centered}>
          <Ionicons
            name="cube-outline"
            size={40}
            color="#888888"
          />
          <Text style={styles.mutedText}>
            No devices found.
          </Text>
          <Pressable
            style={styles.primaryButton}
            onPress={loadDevices}
          >
            <Text style={styles.primaryButtonText}>
              Reload
            </Text>
          </Pressable>
        </View>
      ) : (
        devices.map((device) => (
          <DeviceCard
            key={device.id}
            device={device}
            updating={!!updatingDeviceIds[device.id]}
            disabled={switchesDisabled}
            onToggle={toggleDevice}
          />
        ))
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

  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#fdecea',
    marginBottom: 15,
  },

  errorText: {
    flex: 1,
    fontSize: 14,
    color: '#b71c1c',
    textAlign: 'center',
  },

  centered: {
    alignItems: 'center',
    gap: 12,
    padding: 30,
  },

  mutedText: {
    fontSize: 14,
    color: '#666666',
  },

  primaryButton: {
    backgroundColor: '#007aff',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },

  primaryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },

});