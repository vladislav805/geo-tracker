import './client.scss';
import { connect, onMessageEvent, request2socket } from './connect';
import { initMap, setPosition } from './map';
import { initBar, setBarInfo } from './bar';

const makeConnection = () => {
    const key = new URLSearchParams(window.location.search).get('key');
    void connect().then(() => {
        request2socket({ type: 'init', props: { key } });

        onMessageEvent('location_update', event => {
            setPosition(event.data);
            setBarInfo(event.data);
        });
    });
};

document.addEventListener('DOMContentLoaded', () => {
    initMap();
    initBar();

    void makeConnection();
});
