import * as ws from 'ws';
import * as url from 'url';
import { resolve } from 'path';
import * as restana from 'restana';
import { isFileExists, responseWithFile } from './utils';
import { onClientConnected } from './clients';
import methods, { hasMethod } from './methods';

const base = process.cwd();

const wss: ws.Server = new ws.Server({
    noServer: true,
});

export const service = restana();

service.all('/api/ws', req => wss.handleUpgrade(req, req.socket, Buffer.alloc(0), onClientConnected));

service.all('/api/:path?', async(req, res) => {
    const parsedUrl = url.parse(req.url, true);
    let pathname = parsedUrl.pathname.substring(1);
    const { query } = parsedUrl;
    const method = req.params.path;

    if (!pathname) {
        pathname = 'index.html';
    }

    const filename = resolve(base, 'dist', pathname);

    if (isFileExists(filename)) {
        responseWithFile(res, filename);
        return;
    }

    try {
        if (hasMethod(method)) {
            const methodFunc = methods[method];
            res.send({
                result: await methodFunc(query),
            });
        } else {
            // noinspection ExceptionCaughtLocallyJS
            throw new Error('unknown method');
        }
    } catch (e) {
        res.send({
            error: (e as Error).message,
        });
    }
});

void service.start(7001).then(() => console.log('Server started'));
