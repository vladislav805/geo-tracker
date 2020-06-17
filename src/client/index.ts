import './client.scss';
import { connect, onMessageEvent, request2socket } from './connect';
import { EVENT_POSITION_CHANGED } from '../cmd';
import { initMap, setPosition } from './map';
import { initBar, setBarInfo } from './bar';

const makeConnection = async() => {
    const socket = await connect();
    const key = new URLSearchParams(window.location.search).get('key');

    request2socket({ type: 'init', props: { key } });

    onMessageEvent(EVENT_POSITION_CHANGED, event => {
        setPosition(event.data);
        setBarInfo(event.data);
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

    // noinspection JSIgnoredPromiseFromCall
    makeConnection();
});
