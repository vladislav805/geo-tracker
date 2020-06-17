import * as ws from 'ws';

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
