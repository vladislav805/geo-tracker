import './client.scss';
import { connect, onMessageEvent, request2socket } from './connect';
import { EVENT_POSITION_CHANGED } from '../cmd';
import { initMap, setPosition } from './map';
import { initBar, setBarInfo } from './bar';

const makeConnection = () => {
    const key = new URLSearchParams(window.location.search).get('key');
    void connect().then(() => {
        request2socket({ type: 'init', props: { key } });

        onMessageEvent(EVENT_POSITION_CHANGED, event => {
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
