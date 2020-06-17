import * as ws from 'ws';
import { IClient, IMessageEventMap, IMessageEventType, IMessageRequest } from '../types';
import { getPosition } from './memory';

const clients = new Set<IClient>();

export const onClientConnected = (socket: ws): void => {
    const client: IClient = {
        socket,
        key: null,
    };

    clients.add(client);

    socket.on('message', event => {
        const json = JSON.parse(event as string) as IMessageRequest;

        onClientRequest(client, json);
    });

    socket.on('close', () => clients.delete(client));
};

const onClientRequest = (client: IClient, { type, props }: IMessageRequest) => {
    switch (type) {
        case 'init': {
            client.key = props.key;

            const lastPosition = getPosition(client.key);

            if (lastPosition) {
                sendToClient(client.socket, 'location_update', lastPosition);
            }
            break;
        }
    }
};


function sendToClient<E extends IMessageEventType, T extends IMessageEventMap[E]>(socket: ws, type: E, data?: T): void {
    socket.send(JSON.stringify({ type, data }));
}

export function sendToClientsWithKey<E extends IMessageEventType, T extends IMessageEventMap[E]>(key: string, type: E, data: T): void {
    return Array.from(clients)
        .filter(client => client.key === key)
        .forEach(({socket}) => sendToClient(socket, type, data));
}

setInterval(() => clients.forEach(({ socket }) => sendToClient(socket, 'ping')), 40000);
