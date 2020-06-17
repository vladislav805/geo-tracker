import { IPositionRecord } from '../types';
import { getSpeedByInterpolate } from './utils';
import { getUnixTime } from '../utils';

let speed: HTMLElement;
let latency: HTMLElement;

let prev: IPositionRecord;

export const initBar = () => {
    speed = document.getElementById('speed');
    latency = document.getElementById('latency');
    setInterval(updateLatency, 1000);
};

export const setBarInfo = (position: IPositionRecord) => {
    speed.textContent = prev
        ? getSpeedByInterpolate(position, prev).toFixed(1)
        : String(position.speed);
    latency.dataset.time = String(position.time);
    prev = position;
};

const updateLatency = () => {
    const now = getUnixTime();
    if (latency.dataset.time) {
        latency.textContent = `${now - +latency.dataset.time} seconds ago`;
    }
};
