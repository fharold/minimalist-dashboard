import  {singleton} from "tsyringe";

@singleton()
export class WebSocketService {
    init(): void {
        console.log("salut");
    }
}