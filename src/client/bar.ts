import { IPositionRecord } from '../types';
import { distanceHumanize, getHumanTimeDiff, wayDistance } from './utils';
import { getUnixTime } from '../utils';
import { getBroadcaster } from './map';

let nodeSpeed: HTMLElement;
let nodeLatency: HTMLElement;
let nodeWay: HTMLElement;

export const initBar = (): void => {
    nodeSpeed = document.getElementById('speed');
    nodeLatency = document.getElementById('latency');
    nodeWay = document.getElementById('way');
    setInterval(updateLatency, 1000);
};

export const setBarInfo = (position: IPositionRecord): void => {
    const kmPh = position.speed;
    nodeSpeed.textContent = kmPh.toFixed(1);
    nodeLatency.dataset.time = String(position.time);

    const broadcaster = getBroadcaster();

    if (broadcaster) {
        nodeWay.textContent = `Distance ~${distanceHumanize(wayDistance(broadcaster.waypoints))}, duration: ${getHumanTimeDiff(broadcaster.timeUpdated - broadcaster.timeCreated)}`;
    }
};

const updateLatency = (): void => {
    const now = getUnixTime();
    if (nodeLatency.dataset.time) {
        const diff = now - +nodeLatency.dataset.time;
        nodeLatency.textContent = diff ? `${getHumanTimeDiff(diff)} ago` : 'just now';
    }
};
