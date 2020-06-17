import * as ws from 'ws';

/**
 * Events
 */
export interface IMessageEventMap {
    'location_update': IPositionRecord;
    'ping': never;
}

export type IMessageEventLocationChange = { type: 'location_update', data: IPositionRecord };
export type IMessageEventPing = { type: 'ping' };

export type IMessageEvent = IMessageEventLocationChange | IMessageEventPing;

export type IMessageEventType = keyof IMessageEventMap;

/**
 * Requests
 */
type IMessageRequestInit = { type: 'init', props: { key: string } };

export type IMessageRequest = IMessageRequestInit;

/**
 * Objects
 */
export interface IPositionRecord {
    time: number;
    lat: number;
    lng: number;
    speed: number;
    bearing: number;
    accuracy?: number;
    battery?: number;
}

export type IClient = {
    socket: ws;
    key?: string;
};
