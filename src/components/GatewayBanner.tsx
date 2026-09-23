import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    Pressable,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

type GatewayBannerProps = {
    connecting: boolean;
    connected: boolean;
    onReconnect: () => void;
};

export default function GatewayBanner({
    connecting,
    connected,
    onReconnect,
}: GatewayBannerProps) {

    if (connecting) {
        return (
            <View style={[styles.banner, styles.connecting]}>
                <ActivityIndicator size="small" />
                <Text style={styles.connectingText}>
                    Connecting to IoT Gateway...
                </Text>
            </View>
        );
    }

    if (!connected) {
        return (
            <View style={[styles.banner, styles.offline]}>
                <View style={styles.info}>
                    <Ionicons
                        name="cloud-offline-outline"
                        size={22}
                        color="#b71c1c"
                    />
                    <Text style={styles.offlineText}>
                        IoT Gateway is disconnected.
                    </Text>
                </View>

                <Pressable
                    style={styles.button}
                    onPress={onReconnect}
                >
                    <Text style={styles.buttonText}>
                        Reconnect
                    </Text>
                </Pressable>
            </View>
        );
    }

    return null;
}

const styles = StyleSheet.create({

    banner: {
        borderRadius: 12,
        padding: 14,
        marginBottom: 15,
        alignItems: 'center',
    },

    connecting: {
        flexDirection: 'row',
        gap: 10,
        backgroundColor: '#fff3cd',
    },

    connectingText: {
        fontSize: 13,
        color: '#856404',
    },

    offline: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fdecea',
    },

    info: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flex: 1,
    },

    offlineText: {
        fontSize: 13,
        color: '#b71c1c',
        flex: 1,
    },

    button: {
        backgroundColor: '#007aff',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
    },

    buttonText: {
        color: '#ffffff',
        fontSize: 13,
        fontWeight: 'bold',
    },

});