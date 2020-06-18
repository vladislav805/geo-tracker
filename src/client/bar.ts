import { IPositionRecord } from '../types';
import { distanceHumanize, toDuration, wayDistance } from './utils';
import { getUnixTime } from '../utils';
import { getBroadcaster } from './map';

let nodeSpeed: HTMLElement;
let nodeLatency: HTMLElement;
let nodeDistance: HTMLElement;
let nodeDuration: HTMLElement;
let nodeBattery: HTMLElement;

export const initBar = (): void => {
    nodeSpeed = document.getElementById('speed');
    nodeLatency = document.getElementById('latency');
    nodeDistance = document.getElementById('distance');
    nodeDuration = document.getElementById('duration');
    nodeBattery = document.getElementById('battery');
    setInterval(updateLatency, 1000);
};

export const setBarInfo = (position: IPositionRecord): void => {
    const kmPh = position.speed;
    nodeSpeed.textContent = `${kmPh.toFixed(1)} km/h`;
    nodeLatency.dataset.time = String(position.time);

    if (position.battery >= 0) {
        nodeBattery.hidden = false;
        nodeBattery.textContent = `${position.battery}%`;
        nodeBattery.style.setProperty('--battery-level', String(position.battery));
    } else {
        nodeBattery.hidden = true;
    }

    const broadcaster = getBroadcaster();

    if (broadcaster) {
        const distance = distanceHumanize(wayDistance(broadcaster.waypoints));
        const duration = broadcaster.timeUpdated - broadcaster.timeCreated;

        nodeDistance.textContent = distance;
        nodeDuration.textContent = toDuration(duration);
    }
};

const updateLatency = (): void => {
    const now = getUnixTime();
    if (nodeLatency.dataset.time) {
        const diff = now - +nodeLatency.dataset.time;
        nodeLatency.textContent = diff ? `${toDuration(diff)} ago` : 'just now';
    }
};
