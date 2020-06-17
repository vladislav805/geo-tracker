import { IPositionRecord } from '../types';
import { getUnixTime } from '../utils';

const lastPosition: Record<string, IPositionRecord> = {};

const isExpired = (position: IPositionRecord): boolean => getUnixTime() - position.time > 60 * 60;

export const putPosition = (key: string, position: IPositionRecord): void => {
    lastPosition[key] = position;
};

export const getPosition = (key: string): IPositionRecord => {
    const position = lastPosition[key];

    return position && !isExpired(position)
        ? position
        : null;
};
