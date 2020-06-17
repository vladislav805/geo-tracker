import { IPositionRecord } from '../types';
import { getHumanTimeDiff, getSpeedByInterpolate } from './utils';
import { getUnixTime } from '../utils';

let speed: HTMLElement;
let latency: HTMLElement;

let previousPosition: IPositionRecord;

export const initBar = (): void => {
    speed = document.getElementById('speed');
    latency = document.getElementById('latency');
    setInterval(updateLatency, 1000);
};

export const setBarInfo = (position: IPositionRecord): void => {
    const kmPh = previousPosition
        ? getSpeedByInterpolate(position, previousPosition)
        : position.speed;
    speed.textContent = String(kmPh);
    latency.dataset.time = String(position.time);
    previousPosition = position;
};

const updateLatency = (): void => {
    const now = getUnixTime();
    if (latency.dataset.time) {
        const diff = now - +latency.dataset.time;
        latency.textContent = diff ? `${getHumanTimeDiff(diff)} ago` : 'just now';
    }
};
