import './client.scss';
import { connect, onMessageEvent, request2socket } from './connect';
import { initMap, setBroadcaster, setPosition } from './map';
import { initBar, setBarInfo } from './bar';
import { initPreferences } from './preferences';

const makeConnection = () => {
    const key = new URLSearchParams(window.location.search).get('key');
    void connect().then(() => {
        request2socket({ type: 'init', props: { key } });

        onMessageEvent('location_update', event => {
            setPosition(event.data);
            setBarInfo(event.data);
        });

        onMessageEvent('broadcaster_info', event => {
            setBroadcaster(event.data);
            if (event.data.position) {
                setBarInfo(event.data.position);
            }
        });
    });
};

document.addEventListener('DOMContentLoaded', () => {
    initMap();
    initBar();
    initPreferences();

    void makeConnection();
});
