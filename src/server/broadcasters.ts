import { IBroadcaster, IPositionRecord } from '../types';
import { getUnixTime } from '../utils';

const broadcasters: Record<string, IBroadcaster> = {};

const isExpired = (position: IPositionRecord): boolean => !position || getUnixTime() - position.time > 60 * 60;

const hasBroadcaster = (key: string) => broadcasters
    ? key in broadcasters
    : !isExpired(broadcasters[key].position);

const putBroadcaster = (key: string): IBroadcaster => broadcasters[key] = {
    timeCreated: getUnixTime(),
    timeUpdated: getUnixTime(),
    position: null,
    waypoints: [],
};

export const getBroadcaster = (key: string): IBroadcaster => broadcasters[key];

export const putPosition = (key: string, position: IPositionRecord): void => {
    const broadcaster = hasBroadcaster(key)
        ? getBroadcaster(key)
        : putBroadcaster(key);

    broadcaster.timeUpdated = getUnixTime();
    broadcaster.position = position;
    broadcaster.waypoints.push({
        lat: position.lat,
        lng: position.lng,
        speed: position.speed,
        time: position.time,
    });
};

export const getPosition = (key: string): IPositionRecord => {
    const broadcaster = getBroadcaster(key);

    return broadcaster?.position && !isExpired(broadcaster.position)
        ? broadcaster.position
        : null;
};

export const isAvailableKey = (key: string): boolean => hasBroadcaster(key);
