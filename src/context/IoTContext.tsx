import React, {
    createContext,
    useContext,
    useState,
    useEffect,
} from 'react';

import {
    Device,
    SensorData,
} from '../models/IoTModels';

import {
    getSensorData,
    getDevices,
    updateDeviceStatus,
    IoTGatewayError,
} from '../services/IoTService';

type IoTContextType = {
    devices: Device[];
    sensors: SensorData;
    gatewayConnected: boolean;
    gatewayConnecting: boolean;
    devicesLoading: boolean;
    sensorsLoading: boolean;
    updatingDeviceIds: Record<number, boolean>;
    sensorsError: string | null;
    devicesError: string | null;
    deviceUpdateError: string | null;
    refreshSensors: () => Promise<void>;
    loadDevices: () => Promise<void>;
    toggleDevice: (id: number, value: boolean) => Promise<void>;
    reconnectGateway: () => Promise<void>;
};

const IoTContext = createContext<IoTContextType | undefined>(
    undefined
);

const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

export function IoTProvider({
    children,
}: {
    children: React.ReactNode;
}) {

    const [devices, setDevices] = useState<Device[]>([]);
    const [sensors, setSensors] = useState<SensorData>({
        temperature: 0,
        humidity: 0,
        lightLevel: 0,
    });
    const [gatewayConnected, setGatewayConnected] =
        useState(false);
    const [gatewayConnecting, setGatewayConnecting] =
        useState(true);
    const [devicesLoading, setDevicesLoading] =
        useState(true);
    const [sensorsLoading, setSensorsLoading] =
        useState(true);
    const [updatingDeviceIds, setUpdatingDeviceIds] =
        useState<Record<number, boolean>>({});
    const [sensorsError, setSensorsError] =
        useState<string | null>(null);
    const [devicesError, setDevicesError] =
        useState<string | null>(null);
    const [deviceUpdateError, setDeviceUpdateError] =
        useState<string | null>(null);

    const connectToGateway = async () => {
        setGatewayConnecting(true);
        setGatewayConnected(false);

        await delay(1500);

        setGatewayConnecting(false);
        setGatewayConnected(true);
    };

    const refreshSensors = async () => {
        setSensorsError(null);
        setSensorsLoading(true);

        try {
            const data = await getSensorData();
            setSensors(data);
        } catch (error) {
            if (error instanceof IoTGatewayError) {
                setGatewayConnected(false);
                setSensorsError(
                    'IoT Gateway is disconnected.'
                );
            } else {
                setSensorsError(
                    'Unable to retrieve sensor data.'
                );
            }
        } finally {
            setSensorsLoading(false);
        }
    };

    const loadDevices = async () => {
        setDevicesError(null);
        setDevicesLoading(true);

        try {
            const data = await getDevices();
            setDevices(data);
        } catch (error) {
            if (error instanceof IoTGatewayError) {
                setGatewayConnected(false);
                setDevicesError(
                    'IoT Gateway is disconnected.'
                );
            } else {
                setDevicesError(
                    'Unable to retrieve devices.'
                );
            }
        } finally {
            setDevicesLoading(false);
        }
    };

    const toggleDevice = async (
        id: number,
        value: boolean
    ) => {
        if (
            !gatewayConnected ||
            gatewayConnecting ||
            updatingDeviceIds[id]
        ) {
            return;
        }

        setDeviceUpdateError(null);

        setDevices((prev) =>
            prev.map((device) =>
                device.id === id
                    ? { ...device, status: value }
                    : device
            )
        );

        setUpdatingDeviceIds((prev) => ({
            ...prev,
            [id]: true,
        }));

        try {
            await updateDeviceStatus(id, value);
        } catch (error) {
            setDevices((prev) =>
                prev.map((device) =>
                    device.id === id
                        ? { ...device, status: !value }
                        : device
                )
            );

            if (error instanceof IoTGatewayError) {
                setGatewayConnected(false);
                setDeviceUpdateError(
                    'IoT Gateway is disconnected.'
                );
            } else {
                const device = devices.find((d) => d.id === id);
                setDeviceUpdateError(
                    `Unable to update ${device?.name ?? `device ${id}`}.`
                );
            }
        } finally {
            setUpdatingDeviceIds((prev) => ({
                ...prev,
                [id]: false,
            }));
        }
    };

    const reconnectGateway = async () => {
        setSensorsError(null);
        setDevicesError(null);
        setDeviceUpdateError(null);

        await connectToGateway();

        loadDevices();
        refreshSensors();
    };

    useEffect(() => {
        connectToGateway();
        loadDevices();
        refreshSensors();
    }, []);

    return (
        <IoTContext.Provider
            value={{
                devices,
                sensors,
                gatewayConnected,
                gatewayConnecting,
                devicesLoading,
                sensorsLoading,
                updatingDeviceIds,
                sensorsError,
                devicesError,
                deviceUpdateError,
                refreshSensors,
                loadDevices,
                toggleDevice,
                reconnectGateway,
            }}
        >
            {children}
        </IoTContext.Provider>
    );
}

export function useIoT() {

    const context = useContext(IoTContext);

    if (!context) {
        throw new Error(
            'useIoT must be used inside IoTProvider'
        );
    }

    return context;
}