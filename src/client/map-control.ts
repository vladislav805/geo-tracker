import * as L from 'leaflet';
import { e } from './dom';
import * as imageLocationBearing from './assets/location-bearing.svg';
import * as imageLocationStay from './assets/location-place.svg';

type ILeafletToggleControlOptions = {
    position: L.ControlPosition;
    label: string;
    onChange: (state: boolean) => unknown;
    checked: boolean;
};

export const createToggleControl = (props: ILeafletToggleControlOptions): L.Control => {
    const button: L.Control = new L.Control({
        position: props.position,
    });
    const input = e('input', {
        'class': 'leafletToggleControl-check',
        type: 'checkbox',
        onChange: function(this: HTMLInputElement) { props.onChange(this.checked) },
    });
    const root = e('label', {
        'class': 'leaflet-control-button leafletToggleControl',
        onClick: event => event.stopPropagation(),
    }, [
        input,
        e('span', {
            'class': 'leafletToggleControl-label',
        }, props.label),
    ]);
    input.checked = props.checked;
    button.onAdd = () => root;
    return button;
};

export const createMapLocationMarker = (): HTMLElement => e('div', {
    'class': 'current-location',
    'data-drive': 'false',
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
