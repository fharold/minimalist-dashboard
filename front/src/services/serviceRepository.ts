import CanService from "./canService";

export class ServiceRepository {
  protected static instance: ServiceRepository;
  private readonly _canSvc: CanService;
  public get canSvc(): CanService {
    return this._canSvc;
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
  }
}
