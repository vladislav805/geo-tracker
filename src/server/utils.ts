import { ParsedUrlQuery } from "querystring";
import { IPositionRecord } from '../types';
import { getUnixTime } from '../utils';
import * as http from 'http';
import * as restana from 'restana';
import * as fs from 'fs';

export const preparePosition = (query: ParsedUrlQuery): IPositionRecord => {
    const { lat, lng, speed, bearing, accuracy, battery } = query;
    return {
        time: getUnixTime(),
        lat: +lat,
        lng: +lng,
        speed: +speed,
        bearing: +bearing,
        accuracy: +accuracy,
        battery: +battery,
    };
};

export const responseWithFile = (response: http.ServerResponse & restana.ResponseExtensions, path: string): void => {
    fs.readFile(path, 'binary', (err, file) => {
        if (err) {
            response.writeHead(500, {
                'Content-Type': 'text/plain',
            });
            response.write(`${String(err)}\n`);
            response.end();
            return;
        }

        response.writeHead(200, {
            'Content-Type': getMime(getExtension(path)),
        });
        response.write(file, 'binary');
        response.end();
    });
}

const getMime = (ext: string) => {
    let mime = 'text/plain';
    switch (ext) {
        case 'html': mime = 'text/html; charset=utf-8'; break;
        case 'js': mime = 'text/javascript'; break;
        case 'css': mime = 'text/css'; break;
        case 'png': mime = 'image/png'; break;
    }
    return mime;
};

const getExtension = (path: string) => path.split('.').pop();
