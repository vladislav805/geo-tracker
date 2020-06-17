import { LatLngTuple } from 'leaflet';
import { IPositionRecord } from '../types';

export const isDevelopment = process.env.DEV;
export const isSecure = window.location.protocol === 'https:';

const rad = (deg: number): number => deg * Math.PI / 180;

/**
 * Great circle distance
 */
const convertToMeters = ([lat1, lng1]: LatLngTuple, [lat2, lng2]: LatLngTuple): number => {
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
    const S = convertToMeters([fresh.lat, fresh.lng], [previous.lat, previous.lng]);
    return Math.abs(S / t) || 0;
};
