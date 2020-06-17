import * as ws from 'ws';
import { IBroadcaster, IClientListener, IMessageEventData, IMessageEventType, IMessageRequest } from '../types';
import { getBroadcaster } from './broadcasters';

const listeners = new Set<IClientListener>();

export const onClientConnected = (socket: ws): void => {
    const client: IClientListener = {
        socket,
        key: null,
    };

    listeners.add(client);

    socket.on('message', event => {
        const json = JSON.parse(event as string) as IMessageRequest;

        onClientRequest(client, json);
    });

    socket.on('close', () => listeners.delete(client));
};

const onClientRequest = (client: IClientListener, { type, props }: IMessageRequest) => {
    switch (type) {
        case 'init': {
            client.key = props.key;

            const broadcaster: IBroadcaster = getBroadcaster(client.key);

            if (broadcaster) {
                sendToClient(client.socket, 'broadcaster_info', broadcaster);
            }
            break;
        }
    }
};


function sendToClient<E extends IMessageEventType, T extends IMessageEventData<E>>(socket: ws, type: E, data?: T): void {
    socket.send(JSON.stringify({ type, data }));
}

export function sendToClientsWithKey<E extends IMessageEventType, T extends IMessageEventData<E>>(key: string, type: E, data: T): void {
    return Array.from(listeners)
        .filter(client => client.key === key)
        .forEach(({socket}) => sendToClient(socket, type, data));
}

setInterval(() => listeners.forEach(({ socket }) => sendToClient(socket, 'ping')), 40000);
