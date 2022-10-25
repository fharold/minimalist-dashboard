import {AuthService} from "./authService";
import {UserService} from "./userService";
import {TranslationService} from "./translationService";
import {PolicyService} from "./policyService";
import {LanguageService} from "./languageService";
import {FileService} from "./fileService";
import {EquipmentService} from "./equipmentService";
import {ConfigurationService} from "./configurationService";
import {AnnotationService} from "./annotationService";

export interface Listener<T> {
  onSubjectUpdate(sub?: T): void;
}

export interface ListenableService<T> {
  addListener(listener: Listener<T>): void;
  removeListener(listener: Listener<T>): void;
}

export class ServiceRepository {
  protected static instance: ServiceRepository;
  private readonly _authSvc: AuthService;
  private readonly _equipSvc: EquipmentService;
  private readonly _fileSvc: FileService;
  private readonly _languageSvc: LanguageService;
  private readonly _policySvc: PolicyService;
  private readonly _translationSvc: TranslationService;
  private readonly _userSvc: UserService;
  private readonly _cfgSvc: ConfigurationService;
  private readonly _annotationSvc: AnnotationService;

  public get authSvc(): AuthService {
    return this._authSvc;
  }

  public get equipmentSvc(): EquipmentService {
    return this._equipSvc;
  }

  public get cfgSvc(): ConfigurationService {
    return this._cfgSvc;
  }

  public get fileSvc(): FileService {
    return this._fileSvc;
  }

  public get languageSvc(): LanguageService {
    return this._languageSvc;
  }

  public get policySvc(): PolicyService {
    return this._policySvc;
  }

  public get translationSvc(): TranslationService {
    return this._translationSvc;
  }

  public get annotationSvc(): AnnotationService {
    return this._annotationSvc;
  }

  public get userSvc(): UserService {
    return this._userSvc;
  }

  public static getInstance(): ServiceRepository {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!ServiceRepository.instance) {
      ServiceRepository.instance = new ServiceRepository();
    }
    return ServiceRepository.instance;
  }

  private constructor() {
    this._authSvc = new AuthService();
    this._userSvc = new UserService();
    this._policySvc = new PolicyService(this._userSvc);
    this._translationSvc = new TranslationService(this._userSvc);
    this._languageSvc = new LanguageService(this._userSvc);
    this._fileSvc = new FileService();
    this._equipSvc = new EquipmentService(this._userSvc);
    this._cfgSvc = new ConfigurationService();
    this._annotationSvc = new AnnotationService();
  }
}
