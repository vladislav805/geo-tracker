import './client.scss';
import { connect } from './connect';
import { isDevelopment } from './utils';
import { EVENT_POSITION_CHANGED } from '../cmd';
import { initMap, setPosition } from './map';
import { initBar, setBarInfo } from './bar';

const makeConnection = () => {
    const socket = connect();

    socket.addEventListener('open', () => {
        socket.send(JSON.stringify({ init_key: new URLSearchParams(window.location.search).get('key') }));
    });

    socket.addEventListener('message', event => {
        const message = event.data;

        const { type, data } = JSON.parse(message);

        if (isDevelopment) {
            console.log('message', type, data);
        }

        switch (type) {
            case EVENT_POSITION_CHANGED: {
                setPosition(data);
                setBarInfo(data);
                break;
            }
        }
    });

    socket.addEventListener('error', () => {
        alert('Connection with server lost. Need to reload the page.');
    });

    socket.addEventListener('close', () => {
        alert('Connection with server lost. Need to reload the page.');
    });
};

document.addEventListener('DOMContentLoaded', () => {
    initMap();
    initBar();
    makeConnection();
});
