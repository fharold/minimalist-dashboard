import ApiService from "./api/apiService";
import {QuerySort} from "../models/api/querySort";
import {QueryPage} from "../models/api/queryPage";
import {MultipleEntityResponse} from "../models/api/multipleEntityResponse";
import {URLs} from "../utils/urls";
import {ListenableService, Listener} from "./serviceRepository";
import {Language} from "../models/language";
import {generatePath} from "react-router-dom";
import {toast} from "react-toastify";
import React from "react";
import {User} from "../models/user";
import {UserService} from "./userService";
import QueryFilter from "../models/api/queryFilter";
import i18next from "i18next";

export class LanguageService extends ApiService implements ListenableService<Language.DTO>, Listener<User.DTO> {
  public currentLanguage: Language.DTO | undefined;
  private _listeners: Array<Listener<Language.DTO>> = [];
  private _userSvc: UserService;

  constructor(userSvc: UserService) {
    super();
    this._userSvc = userSvc;
    userSvc.addListener(this);
  }


  public async listLanguages(
    filters?: QueryFilter<Language.DTO>,
    sort?: QuerySort,
    page?: QueryPage
  ): Promise<MultipleEntityResponse<Language.DTO>> {
    return this.getList(URLs.API.LANGUAGES, filters, sort, page);
  }

  public async getLanguage(code: string): Promise<Language.DTO> {
    let url = generatePath(URLs.API.LANGUAGE, {
      languageCode: code || 'EN'
    });

    return this.getOne(url);
  }

  public async addLanguage(language: Language.DTO): Promise<Language.DTO> {
    return this.post(URLs.API.LANGUAGES, {
      code: language.code,
      name: language.name,
      visible: language.visible
    });
  }

  public async editLanguage(language: Language.DTO): Promise<Language.DTO> {
    let url = generatePath(URLs.API.LANGUAGE, {
      languageCode: language.code
    });

    return this.patch(url, {
      name: language.name,
      visible: language.visible
    });
  }

  private _notifyListeners(): void {
    for (let listener of this._listeners) {
      listener.onSubjectUpdate(this.currentLanguage);
    }
  }

  public addListener(listener: Listener<Language.DTO>): void {
    this._listeners.push(listener);
  }

  public removeListener(listener: Listener<Language.DTO>): void {
    let index = this._listeners.indexOf(listener);
    if (index === -1) return;
    this._listeners.splice(index, 1);
  }

  public async addFile(code: string, file: File, fileType: "ICON" | "CSV") {
    let toastRef: React.ReactText | undefined = undefined;

    let url = generatePath(URLs.API.LANGUAGE_ATTACH_FILE, {
      languageCode: code,
      fileType: fileType
    });
    let form = new FormData();
    form.set("attachment", file);


    try {
      await this.post(url, form, progressEvent => {
        const progress = progressEvent.loaded / progressEvent.total;

        if (progress === 1) return

        if (toastRef === undefined) {
          toastRef = toast(`Uploading file : ${progress}`, {
            progress: progress
          })
        } else {
          toast.update(toastRef, {progress: progress})
        }
      });

      if (toastRef) {
        toast.done(toastRef);
      }
    } catch (e) {
      if (toastRef) toast.dismiss(toastRef);
      toast("Failed to upload file", {type: "error"});
    }
  }

  async onSubjectUpdate(sub?: User.DTO): Promise<void> {
    if (!sub) return;
    this.currentLanguage = await this.getLanguage(sub.preferredLanguage);
    this._notifyListeners();
  }

  async setCurrentLanguage(code: string): Promise<void> {
    const currentUserId = this._userSvc.currentUser?.id;
    if (!currentUserId) return;

    await this._userSvc.editUser(currentUserId, {preferredLanguage: code});
    await this._userSvc.refreshCurrentUserProfile();
    //TODO : refresh user profile
  }

  static areSameLanguageCode(code1?: string, code2?: string): boolean {
    if (!code1 || !code2) return false;

    return code1.toLowerCase() === code2.toLowerCase()
  }
}