import { isDevelopment, isSecure } from './utils';

export const connect = (): WebSocket => {
    return new WebSocket(`${isSecure ? 'wss' : 'ws'}://${isDevelopment ? 'localhost:7000' : window.location.host}/ws`);
};
