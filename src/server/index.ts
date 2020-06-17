import * as ws from 'ws';
import * as url from 'url';
import * as path from 'path';
import * as restana from 'restana';
import * as files from 'serve-static';
import { putPosition } from './memory';
import { preparePosition, responseWithFile } from './utils';
import { onClientConnected, sendToClientsWithKey } from './clients';
import { EVENT_POSITION_CHANGED } from '../cmd';
import { Protocol } from 'restana';

const base = process.cwd();

const wss: ws.Server = new ws.Server({
    noServer: true,
});

export const service = restana();

const serve = files(base);

service.use('/assets', serve as restana.RequestHandler<Protocol.HTTP>);

service.all('/ws', req => {
    wss.handleUpgrade(req, req.socket, Buffer.alloc(0), onClientConnected);
});

service.get('/', (req, res) => {
    const { query } = url.parse(req.url, true);

    const filename = query.key
        ? 'index.html'
        : 'none-key.html';

    responseWithFile(res, path.resolve(base, filename));
});

service.get('/set', (req, res) => {
    const { query } = url.parse(req.url, true);
    const key = query.key as string;

    const position = preparePosition(query);

    putPosition(key, position);
    res.write('ok');
    res.end();

    sendToClientsWithKey(key, EVENT_POSITION_CHANGED, position);
});

void service.start(7000).then(() => console.log('Server started'));
