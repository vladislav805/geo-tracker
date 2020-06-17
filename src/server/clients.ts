import * as ws from 'ws';
import { IClient } from '../types';
import { getPosition } from './memory';
import { EVENT_PING, EVENT_POSITION_CHANGED } from '../cmd';

const clients = new Set<IClient>();

export const onClientConnected = (socket: ws) => {
    const client: IClient = {
        socket,
        key: null,
    };

    clients.add(client);

    socket.on('message', event => {
        const json = JSON.parse(event as string);
        client.key = json.init_key;

        const lastPosition = getPosition(client.key);

        if (lastPosition) {
            sendToClient(socket, EVENT_POSITION_CHANGED, lastPosition);
        }
    });

    socket.on('close', () => clients.delete(client));
};

const sendToClient = (socket: ws, type: string, data?: object) => socket.send(JSON.stringify({ type, data }));

export const sendToClientsWithKey = (key: string, type: string, data: object) => Array.from(clients)
        .filter(client => client.key === key)
        .forEach(({socket}) => sendToClient(socket, type, data));

setInterval(() => clients.forEach(({ socket }) => sendToClient(socket, EVENT_PING )), 40000);
