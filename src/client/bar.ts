import { IPositionRecord } from '../types';
import { getHumanTimeDiff, getSpeedByInterpolate } from './utils';
import { getUnixTime } from '../utils';

let nodeSpeed: HTMLElement;
let nodeLatency: HTMLElement;

let previousPosition: IPositionRecord;

export const initBar = (): void => {
    nodeSpeed = document.getElementById('speed');
    nodeLatency = document.getElementById('latency');
    setInterval(updateLatency, 1000);
};

export const setBarInfo = (position: IPositionRecord): void => {
    const kmPh = previousPosition
        ? getSpeedByInterpolate(position, previousPosition)
        : position.speed;
    nodeSpeed.textContent = String(kmPh);
    nodeLatency.dataset.time = String(position.time);
    previousPosition = position;
};

const updateLatency = (): void => {
    const now = getUnixTime();
    if (nodeLatency.dataset.time) {
        const diff = now - +nodeLatency.dataset.time;
        nodeLatency.textContent = diff ? `${getHumanTimeDiff(diff)} ago` : 'just now';
    }
};
