import * as L from 'leaflet';
import { LatLngTuple } from 'leaflet';
import { IBroadcaster, IPositionRecord } from '../types';
import * as imageLocationBearing from './assets/location-bearing.svg';
import * as imageLocationStay from './assets/location-place.svg';
import { e } from './dom';

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

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
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

    createFollowToggleControl().addTo(map);
};

export const setBroadcaster = (info: IBroadcaster) => {
    broadcaster = info;

    info.waypoints.forEach(point => way.addLatLng([point.lat, point.lng]));

    const last = info.position;

    if (last) {
        setPosition(last);
    }
};

export const setPosition = (position: IPositionRecord): void => {
    const coords: LatLngTuple = [position.lat, position.lng];

    map.setView(coords, map.getZoom());

    location.setLatLng(coords);

    icon.dataset.drive = String(position.speed > 1);
    icon.style.setProperty('--bearing', `${position.bearing}deg`);

    circle.setLatLng(coords)
        .setRadius(position.accuracy)
        .setTooltipContent(`Accuracy: ${position.accuracy.toFixed(2)}m`);

    way.addLatLng(coords);
};

const createMapLocationMarker = (): HTMLElement => e('div', {
    'class': 'current-location',
}, [
    e('img', {
        'class': 'current-location__bearing',
        src: imageLocationBearing.default,
    }),
    e('img', {
        'class': 'current-location__stay',
        src: imageLocationStay.default,
    }),
]);


const createFollowToggleControl = (): L.Control => {
    const buttonFollow: L.Control = new L.Control({
        position: 'topright',
    });
    buttonFollow.onAdd = () => createFollowToggleNode();
    return buttonFollow;
};

const createFollowToggleNode = (): HTMLElement => {
    return e('label', {
        'class': 'leaflet-control-button followToggle',
        onClick: event => event.stopPropagation(),
    }, [
        e<HTMLInputElement>('input', {
            'class': 'followToggle-check',
            type: 'checkbox',
            onChange: function(this: HTMLInputElement) { onChangeFollowToggleState(this.checked) },
        }),
        e('span', {
            'class': 'followToggle-label',
        }, 'Follow marker'),
    ]);
};

const onChangeFollowToggleState = (state: boolean) => {
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
