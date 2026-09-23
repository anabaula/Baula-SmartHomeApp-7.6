import React, {
  useCallback,
  useRef,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import { useIoT } from '../../context/IoTContext';
import SensorCard from '../../components/SensorCard';

export default function SensorsScreen() {

  const {
    sensors,
    sensorsLoading,
    sensorsLoaded,
    sensorsError,
    gatewayConnected,
    refreshSensors,
    reconnectGateway,
  } = useIoT();

  const gatewayOffline = !gatewayConnected;

  const hasAutoRefreshed = useRef(false);

  useFocusEffect(
    useCallback(() => {
      if (!hasAutoRefreshed.current) {
        hasAutoRefreshed.current = true;
        return;
      }

      refreshSensors();
    }, [refreshSensors])
  );

  const showInitialLoading = sensorsLoading && !sensorsLoaded;

  return (
    <ScrollView style={styles.container}>

      <Text style={styles.title}>
        Sensors
      </Text>

      <Text style={styles.subtitle}>
        Monitor your environment
      </Text>

      {sensorsError ? (
        <View style={styles.centered}>
          <Ionicons
            name="alert-circle-outline"
            size={40}
            color="#b71c1c"
          />
          <Text style={styles.errorText}>
            {sensorsError}
          </Text>
          <Pressable
            style={styles.primaryButton}
            onPress={gatewayOffline ? reconnectGateway : refreshSensors}
          >
            <Text style={styles.primaryButtonText}>
              {gatewayOffline ? 'Reconnect' : 'Retry'}
            </Text>
          </Pressable>
        </View>
      ) : showInitialLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="small" />
          <Text style={styles.mutedText}>
            Refreshing Sensors...
          </Text>
        </View>
      ) : (
        <>
          <SensorCard
            icon="thermometer-outline"
            label="Temperature"
            value={`${sensors.temperature}°C`}
            description="Current room temperature"
          />

          <SensorCard
            icon="water-outline"
            label="Humidity"
            value={`${sensors.humidity}%`}
            description="Current relative humidity"
          />

          <SensorCard
            icon="sunny-outline"
            label="Light Level"
            value={`${sensors.lightLevel} lux`}
            description="Current ambient light"
          />
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

  centered: {
    alignItems: 'center',
    gap: 12,
    padding: 30,
  },

  mutedText: {
    fontSize: 14,
    color: '#666666',
  },

  errorText: {
    fontSize: 14,
    color: '#b71c1c',
    textAlign: 'center',
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