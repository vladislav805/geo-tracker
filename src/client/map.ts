import * as L from 'leaflet';
import { LatLngTuple } from 'leaflet';
import { IBroadcaster, IPositionRecord } from '../types';
import { createMapLocationMarker, createToggleControl } from './map-control';
import { isDarkTheme, toggleDarkTheme } from './preferences';

let map: L.Map;
let location: L.Marker;
let icon: HTMLElement;
let way: L.Polyline;
let circle: L.Circle;
let follow = false;

let broadcaster: IBroadcaster;

const spb: LatLngTuple = [59.938531, 30.313497];

export const initMap = (): void => {
    map = L.map('map').setView(spb, 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        id: 'osm',
        subdomains: ['a', 'b', 'c'],
    }).addTo(map);

    icon = createMapLocationMarker();

    location = L.marker(spb, {
        icon: L.divIcon({
            html: icon,
            iconSize: new L.Point(36, 36),
            iconAnchor: [18, 18],
        }),
    }).addTo(map);

    way = L.polyline([], {
        color: 'red',
        weight: 4,
    }).addTo(map);

    circle = L.circle(spb, {
        radius: 0,
        stroke: true,
        color: 'rgba(255, 0, 0, .7)',
        fill: true,
        fillColor: 'red',
        fillOpacity: .5,
        interactive: true,
    }).addTo(map);

    L.control.scale({ position: 'bottomleft', imperial: false }).addTo(map);

    createToggleControl({
        label: 'Follow marker',
        position: 'topright',
        onChange: onChangeFollowToggleState,
        checked: false,
    }).addTo(map);

    createToggleControl({
        label: 'Night mode',
        position: 'topright',
        onChange: state => toggleDarkTheme(state),
        checked: isDarkTheme(),
    }).addTo(map);
};

export const setBroadcaster = (info: IBroadcaster): void => {
    broadcaster = info;

    info.waypoints.forEach(point => way.addLatLng([point.lat, point.lng]));

    if (info.position) {
        setPosition(info.position);
    }
};

export const getBroadcaster = (): IBroadcaster => broadcaster;

export const setPosition = (position: IPositionRecord): void => {
    const coords: LatLngTuple = [position.lat, position.lng];

    map.setView(coords, map.getZoom());

    location.setLatLng(coords);

    if (position.accuracy) {
        location.bindTooltip(`Accuracy: ${position.accuracy.toFixed(2)}m`);
    }

    icon.dataset.drive = String(position.speed > 1);
    icon.style.setProperty('--bearing', `${position.bearing}deg`);

    circle.setLatLng(coords)
        .setRadius(position.accuracy);

    way.addLatLng(coords);

    if (broadcaster) {
        broadcaster.timeUpdated = position.time;
        broadcaster.waypoints.push({
            lat: position.lat,
            lng: position.lng,
            time: position.time,
            speed: position.speed,
        });
    } else {
        window.location.reload();
    }
};

const onChangeFollowToggleState = (state: boolean): void => {
    follow = state;

    if (follow) {
        const constZoom = 15;
        if (location.getLatLng().lat) {
            map.flyTo(location.getLatLng(), constZoom, {
                animate: true,
                duration: 1,
            });
        }

        map.dragging.disable();
        map.scrollWheelZoom.disable();
    } else {
        map.dragging.enable();
        map.scrollWheelZoom.enable();
    }
};
