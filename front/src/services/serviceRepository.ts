import CanService from "./canService";
import WebSocketService from "./WebSocketService";

export class ServiceRepository {
  protected static instance: ServiceRepository;
  private readonly _canSvc: CanService;
  private readonly _webSocketService: WebSocketService;

  public get canSvc(): CanService {
    return this._canSvc;
  }

  public get webSocketService(): WebSocketService {
    return this._webSocketService;
  }

  public static getInstance(): ServiceRepository {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!ServiceRepository.instance) {
      ServiceRepository.instance = new ServiceRepository();
    }
    return ServiceRepository.instance;
  }

  private constructor() {
    this._canSvc = new CanService();
    this._webSocketService = new WebSocketService();
  }
}
