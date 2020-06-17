import * as ws from 'ws';
import { IClient, IMessageRequest, IPositionRecord } from '../types';
import { getPosition } from './memory';
import { EVENT_PING, EVENT_POSITION_CHANGED } from '../cmd';

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
                sendToClient<IPositionRecord>(client.socket, EVENT_POSITION_CHANGED, lastPosition);
            }
            break;
        }
    }
};


const sendToClient = <T>(socket: ws, type: string, data?: T): void => socket.send(JSON.stringify({ type, data }));

export const sendToClientsWithKey = <T>(key: string, type: string, data: T): void => Array.from(clients)
        .filter(client => client.key === key)
        .forEach(({socket}) => sendToClient(socket, type, data));

setInterval(() => clients.forEach(({ socket }) => sendToClient(socket, EVENT_PING )), 40000);
