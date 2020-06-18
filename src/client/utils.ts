import { LatLngTuple } from 'leaflet';
import { IPositionRecord, IWaypoint } from '../types';

export const rad = (deg: number): number => deg * Math.PI / 180;

/**
 * Great circle distance
 */
export const distance = ([lat1, lng1]: LatLngTuple, [lat2, lng2]: LatLngTuple): number => {
    const R = 6371;
    const dLat = rad(lat2 - lat1);
    const dLong = rad(lng2 - lng1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
};

/**
 * Calculation of speed by two points and time.
 * @param fresh Current position
 * @param previous Previous position
 * @returns Speed in km per hour
 */
export const getSpeedByInterpolate = (fresh: IPositionRecord, previous: IPositionRecord): number => {
    const t = (fresh.time - (previous.time || 0)) / 3600;
    const S = distance([fresh.lat, fresh.lng], [previous.lat, previous.lng]);
    return Math.abs(S / t) || 0;
};

const pluralize = (n: number, text: string): string => (n % 10) === 1 && n !== 11 ? text : text + 's';

export const getHumanTimeDiff = (delta: number): string => {
    const m = Math.floor(delta / 60);
    const s = Math.floor(delta % 60);
    const res = [];

    if (m) {
        res.push(`${m} ${pluralize(m, 'minute')}`);
    }

    if (s) {
        res.push(`${s} ${pluralize(s, 'second')}`);
    }

    return res.join(', ');
};

export const wayDistance = (way: IWaypoint[]): number => {
    let res = 0;

    for (let i = 1; i < way.length; ++i) {
        const curr = way[i];
        const prev = way[i - 1];
        res += distance([curr.lat, curr.lng], [prev.lat, prev.lng]);
    }

    return res;
};

export const distanceHumanize = (km: number) => km < 1
    ? `${((km / 1000) | 0)}m`
    : `${km.toFixed(1)}km`;
