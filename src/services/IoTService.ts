import { Device, SensorData, sampleDevices } from '../models/IoTModels';

const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

export class IoTGatewayError extends Error {
    constructor() {
        super('IoT Gateway is disconnected.');
        this.name = 'IoTGatewayError';
    }
}

let deviceStore: Device[] = sampleDevices.map((device) => ({
    ...device,
}));

const FAILURE_RATE = 0.15;
const GATEWAY_FAILURE_RATE = 0.35;

function maybeFail(operation: 'sensors' | 'devices' | 'update') {
    if (Math.random() >= FAILURE_RATE) {
        return;
    }

    if (Math.random() < GATEWAY_FAILURE_RATE) {
        throw new IoTGatewayError();
    }

    if (operation === 'sensors') {
        throw new Error('Unable to retrieve sensor data.');
    }

    if (operation === 'devices') {
        throw new Error('Unable to retrieve devices.');
    }

    throw new Error('Unable to update device.');
}

export async function getSensorData(): Promise<SensorData> {
    await delay(1500);

    maybeFail('sensors');

    return {
        temperature: Math.round(20 + Math.random() * 10),
        humidity: Math.round(40 + Math.random() * 35),
        lightLevel: Math.round(200 + Math.random() * 900),
    };
}

export async function getDevices(): Promise<Device[]> {
    await delay(1200);

    maybeFail('devices');

    return deviceStore.map((device) => ({ ...device }));
}

export async function updateDeviceStatus(
    id: number,
    status: boolean
): Promise<Device> {
    await delay(900);

    maybeFail('update');

    deviceStore = deviceStore.map((device) =>
        device.id === id
            ? { ...device, status }
            : device
    );

    const updated = deviceStore.find((device) => device.id === id);

    if (!updated) {
        throw new Error('Device not found.');
    }

    return { ...updated };
}