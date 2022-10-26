import {singleton} from "tsyringe";
import {WebSocketServer} from 'ws';

@singleton()
export class WebSocketService {
    wss: WebSocketServer = new WebSocketServer({port: 8080});

    constructor() {
        console.log("constructor");
        this.wss.on('connection', function connection(ws) {
            console.log("connection :)");
            ws.on('message', function message(data) {
                console.log('received: %s', data);
            });

            ws.send('something');
        });
    }
}