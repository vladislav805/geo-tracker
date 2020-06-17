import { isDevelopment, isSecure } from './utils';
import { IMessageEvent, IMessageEventLocationChange, IMessageEventPing, IMessageRequest } from '../types';

let socket: WebSocket;

export const connect = (): Promise<WebSocket> => new Promise((resolve, reject) => {
    if (socket) {
        return Promise.resolve(socket);
    }

    socket = new WebSocket(`${isSecure ? 'wss' : 'ws'}://${isDevelopment ? 'localhost:7000' : window.location.host}/ws`);

    socket.addEventListener('message', onSocketMessage);
    socket.addEventListener('open', () => resolve(socket));
    socket.addEventListener('error',  (e) => reject(e));
});

export const request2socket = (body: IMessageRequest) => {
    socket.send(JSON.stringify(body));
};

const onSocketMessage = (event: MessageEvent) => {
    const message = JSON.parse(event.data as string) as IMessageEvent;
    const type = message.type;

    eventListeners[type]?.forEach(listener => listener(message));
};

type IMessageEventListener<T = any> = (event: T) => unknown;
const eventListeners: Record<string, IMessageEventListener[]> = {};

function onMessageEvent(type: 'location_update', listener: IMessageEventListener<IMessageEventLocationChange>): void;
function onMessageEvent(type: 'ping', listener: IMessageEventListener<IMessageEventPing>): void;
function onMessageEvent(type: string, listener: IMessageEventListener) {
    if (!(type in eventListeners)) {
        eventListeners[type] = [];
    }

    eventListeners[type].push(listener);
}

export { onMessageEvent };
