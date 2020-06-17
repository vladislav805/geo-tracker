# GPS Tracker

## Installation
```bash
npm i
```
### Server
```bash
ts-node src/server/index.ts
# or
npm run server:dev
```
### Client
```bash
npm run build
```
Then configure web server. The repository provides an example configuration for nginx.

## Usage
### Viewer
Open in browser URL `http://DOMAIN/?key=$KEY`, where `$KEY` - unique key, on which data expected.

### Sender
Use clients to send locations (e.g. Online Tracking in OsmAnd or ) to configure sending to the URL: `http://DOMAIN/set` with following parameters:

| Param | Require | Type | Description |
| ----- |:-------:| ---- | ----------- |
| key | Yes | string | Unique key |
| lat | Yes | float (-90...90) | Latitude |
| lng | Yes | float (-180...180) | Longitude |
| speed |  | float | Speed in km per hour |
| accuracy |  | float | Accuracy in meters |
| bearing |  | int (0-360) | Bearing in deg | 
