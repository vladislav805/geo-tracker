import { distance, getSpeedByInterpolate, rad } from './utils';
import { IPositionRecord } from '../types';

describe('Client utils', () => {
    it('Function rad', () => {
        expect(rad(0)).toEqual(0);
        expect(rad(90)).toBeCloseTo(1.570796326);
    });

    it('Function distance', () => {
        expect(distance([60, 30], [60.148, 29.995])).toBeCloseTo(16.459, 2);
    });

    it('Function getSpeedByInterpolate', () => {
        const pos1: IPositionRecord = {
            time: 0,
            lat: 60.44,
            lng: 30.4,
            bearing: 0,
            speed: 0,
        };

        const pos2: IPositionRecord = {
            time: 320,
            lat: 60.464,
            lng: 30.405,
            bearing: 0,
            speed: 0,
        };

        expect(getSpeedByInterpolate(pos2, pos1)).toBeCloseTo(30.18);
    });
});
