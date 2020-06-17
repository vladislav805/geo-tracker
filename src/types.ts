import * as ws from 'ws';
import { LatLngLiteral } from 'leaflet';

/**
 * Events
 */
interface IMessageEventMap {
    'location_update': IPositionRecord;
    'broadcaster_info': IBroadcaster;
    'ping': never;
}

export type IMessageEventLocationChange = {
    type: 'location_update';
    data: IPositionRecord;
};

export type IMessageEventBroadcasterInfo = {
    type: 'broadcaster_info';
    data: IBroadcaster;
};

export type IMessageEventPing = {
    type: 'ping';
};

export type IMessageEvent = IMessageEventLocationChange | IMessageEventBroadcasterInfo | IMessageEventPing;

export type IMessageEventType = keyof IMessageEventMap;
export type IMessageEventData<T extends IMessageEventType> = IMessageEventMap[T];

/**
 * Requests
 */
interface IMessageRequestMap {
    'init': IMessageRequestInitProps;
}

type IMessageRequestInitProps = {
    key: string;
};

type IMessageRequestInit = {
    type: 'init';
    props: IMessageRequestInitProps;
};

export type IMessageRequest = IMessageRequestInit;
export type IMessageRequestType = keyof IMessageRequestMap;
export type IMessageRequestProps<T extends IMessageRequestType> = IMessageRequestMap[T];

/**
 * Objects
 */
export interface IBroadcaster {
    timeCreated: number;
    timeUpdated: number;
    position: IPositionRecord;
    waypoints: IWaypoint[];
}

export interface IWaypoint extends LatLngLiteral {
    time: number;
    speed: number;
}

export interface IPositionRecord extends IWaypoint {
    lat: number;
    lng: number;
    bearing: number;
    accuracy?: number;
    battery?: number;
}

export interface IClientListener {
    socket: ws;
    key?: string;
}
