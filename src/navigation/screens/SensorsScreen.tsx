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

export default function SensorsScreen() {

  const {
    sensors,
    sensorsLoading,
    sensorsError,
    gatewayConnected,
    gatewayConnecting,
    refreshSensors,
    reconnectGateway,
  } = useIoT();

  const gatewayOffline = !gatewayConnected;

  return (
    <ScrollView style={styles.container}>

      <Text style={styles.title}>
        Sensors
      </Text>

      <Text style={styles.subtitle}>
        Monitor your environment
      </Text>

      {sensorsError ? (
        <View style={styles.errorContainer}>
          <Ionicons
            name="alert-circle-outline"
            size={40}
            color="#b71c1c"
          />
          <Text style={styles.errorText}>
            {sensorsError}
          </Text>
          <Pressable
            style={styles.retryButton}
            onPress={gatewayOffline ? reconnectGateway : refreshSensors}
          >
            <Text style={styles.retryButtonText}>
              {gatewayOffline ? 'Reconnect' : 'Retry'}
            </Text>
          </Pressable>
        </View>
      ) : (
        <>
          <View style={styles.sensorCard}>

            <View style={styles.sensorHeader}>

              <Ionicons
                name="thermometer-outline"
                size={30}
              />

              <Text style={styles.sensorName}>
                Temperature
              </Text>

            </View>

            <Text style={styles.sensorValue}>
              {sensors.temperature}°C
            </Text>

            <Text style={styles.sensorDescription}>
              Current room temperature
            </Text>

          </View>

          <View style={styles.sensorCard}>

            <View style={styles.sensorHeader}>

              <Ionicons
                name="water-outline"
                size={30}
              />

              <Text style={styles.sensorName}>
                Humidity
              </Text>

            </View>

            <Text style={styles.sensorValue}>
              {sensors.humidity}%
            </Text>

            <Text style={styles.sensorDescription}>
              Current relative humidity
            </Text>

          </View>

          <View style={styles.sensorCard}>

            <View style={styles.sensorHeader}>

              <Ionicons
                name="sunny-outline"
                size={30}
              />

              <Text style={styles.sensorName}>
                Light Level
              </Text>

            </View>

            <Text style={styles.sensorValue}>
              {sensors.lightLevel} lux
            </Text>

            <Text style={styles.sensorDescription}>
              Current ambient light
            </Text>

          </View>
        </>
      )}

      <Pressable
        style={[
          styles.refreshButton,
          (sensorsLoading || gatewayOffline) && styles.refreshButtonDisabled,
        ]}
        disabled={sensorsLoading || gatewayOffline}
        onPress={refreshSensors}
      >
        {sensorsLoading ? (
          <>
            <ActivityIndicator
              size="small"
              color="#ffffff"
            />
            <Text style={styles.refreshButtonText}>
              Refreshing Sensors...
            </Text>
          </>
        ) : (
          <>
            <Ionicons
              name="refresh-outline"
              size={18}
              color="#ffffff"
            />
            <Text style={styles.refreshButtonText}>
              Refresh Sensors
            </Text>
          </>
        )}
      </Pressable>

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

  sensorCard: {
    padding: 20,
    borderRadius: 15,
    backgroundColor: '#eeeeee',
    marginBottom: 15,
  },

  sensorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  sensorName: {
    fontSize: 17,
    fontWeight: 'bold',
  },

  sensorValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 20,
  },

  sensorDescription: {
    fontSize: 13,
    marginTop: 5,
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

  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#007aff',
    paddingVertical: 15,
    borderRadius: 12,
    marginTop: 5,
  },

  refreshButtonDisabled: {
    opacity: 0.6,
  },

  refreshButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },

});