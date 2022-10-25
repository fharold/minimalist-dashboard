import ApiService from "./api/apiService";
import {UserService} from "./userService";
import {generatePath} from "react-router-dom";
import {URLs} from "../utils/urls";
import {Translation} from "../models/translation";
import {objectAsMap} from "../utils/ArrayUtils";
import React from "react";
import {toast} from "react-toastify";
import {Listener} from "./serviceRepository";
import {User} from "../models/user";
import {MultipleEntityResponse} from "../models/api/multipleEntityResponse";
import i18next from "i18next";

const DEFAULT_LOCALE = "EN";

export class TranslationService extends ApiService implements Listener<User.DTO> {
  private usrSvc: UserService;
  private _locale: string = DEFAULT_LOCALE;
  private _translations: Array<Translation.DTO> = [];

  constructor(usrSvc: UserService) {
    super();
    this.usrSvc = usrSvc;

    this.usrSvc.addListener(this);
    this.usrSvc.getCurrentUser(false).then(usr => this._setPreferredLanguage(usr.preferredLanguage)).catch(e => console.error(e));
    this._fetchTranslations();
  }

  private async _fetchTranslations(): Promise<void> {
    let res = await this.getTranslations();
    this._translations = res.data;
  }

  public get(key: string): string {
    let translation = this._translations.find(value => value.key === key);
    if (!translation) return key;

    return translation.values.get(this.getCurrentLocale()) || key;
  }

  public getCurrentLocale(): string {
    return this._locale;
  }

  public async getTranslation(key: string): Promise<Translation.DTO> {
    let url = generatePath(URLs.API.TRANSLATION, {
      key: key
    });

    // await new Promise(r => setTimeout(r, 2000)); // TODO REMOVE DEBUG

    let translation: Translation.DTO = await this.getOne(url);
    translation.values = objectAsMap(translation.values);
    return translation;
  }

  public async getTranslations(): Promise<MultipleEntityResponse<Translation.DTO>> {
    let url = generatePath(URLs.API.TRANSLATIONS);

    return await this.getList(url);
  }

  public async updateTranslation(key: string, translation: Translation.DTO) {
    let url = generatePath(URLs.API.TRANSLATION, {
      key: key
    });

    return this.patch(url, {
      type: translation.type,
      values: Object.fromEntries(translation.values)
    });
  }

  public async sendCSV(csv: File) {
    let toastRef: React.ReactText | undefined = undefined;
    let url = generatePath(URLs.API.TRANSLATION_INTERFACE);

    let form = new FormData();
    form.append("attachment", csv);

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

  _setPreferredLanguage(locale: string): void {
    this._locale = locale;
    i18next.changeLanguage(locale, (error, t) => {
      console.error(error);
      console.error(t('back'));
    })
  }

  onSubjectUpdate(sub?: User.DTO): void {
    if (sub) this._setPreferredLanguage(sub.preferredLanguage)
  }
}