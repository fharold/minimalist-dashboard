
export default class WebSocketService {
    private ws?: WebSocket;
    private isBusy: Boolean = false;

    constructor() {
        this.initConnection();
    }

    private initConnection = () => {
        if (this.isBusy) return;

        this.isBusy = true;
        this.ws = new WebSocket('ws://localhost:8080');

        this.ws.onopen = () => {
            this.isBusy = false;
        };

        this.ws.onerror = (err) => {
            console.error(err);
            setTimeout(() => {
                this.isBusy = false;
                this.initConnection();
            }, 1000);
        };

        this.ws.onmessage = (data) => {
            console.log('received: %s', data);
        };
    }
}