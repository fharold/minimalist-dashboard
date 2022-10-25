import ApiService from './api/apiService';
import {QuerySort} from '../models/api/querySort';
import {QueryPage} from '../models/api/queryPage';
import {MultipleEntityResponse} from '../models/api/multipleEntityResponse';
import {URLs} from '../utils/urls';
import {Equipment} from '../models/equipment';
import {generatePath} from 'react-router-dom';
import {Slide, toast} from 'react-toastify';
import React from 'react';
import {Listener} from './serviceRepository';
import {User} from '../models/user';
import {getAssetList__FAKE} from './getAssetList__FAKE';
import {updateUserAssetList} from '../webgl/services/webglService';
import {UserService} from './userService';
import {logHelper, tLogStyled} from 'utils/Logger';
import QueryFilter from '../models/api/queryFilter';

export class EquipmentService extends ApiService implements Listener<User.DTO> {
  constructor(userSvc: UserService) {
    super();

    userSvc.addListener(this);
  }

  public async listEquipments(
    filters?: QueryFilter<Equipment.DTO>,
    sort?: QuerySort,
    page?: QueryPage
  ): Promise<MultipleEntityResponse<Equipment.DTO>> {
    const order = ['laser_life', 'egginject', 'selective_transfer', 'clear_egg_remover', 'dead_egg_tipper'];
    return this.getList(URLs.API.EQUIPMENTS, filters, sort, page)
      .then(equipments => {
        equipments.data.sort((a, b) => order.indexOf(a.key) - order.indexOf(b.key)); // TODO quick fix to reorder equipments
        return equipments;
      });
  }

  // public async getEquipmentsForARoom(room: string): Promise<MultipleEntityResponse<Equipment.DTO>> {
  //   let url = generatePath(URLs.API.EQUIPMENTS_FOR_ROOM, {
  //     name: room
  //   });
  //
  //   return this.getList(url);
  // }
  //
  public async getEquipment(id: string): Promise<Equipment.DTO> {
    let url = generatePath(URLs.API.EQUIPMENT, {
      id: id
    });

    return this.getOne(url);
  }

  public addFile(equipmentId: string, file: File, fileType: Equipment.FileType, locale?: string) {
    let toastRef: React.ReactText | undefined = undefined;

    let url: string;
    if (fileType === 'MODEL' || !locale) {
      url = generatePath(URLs.API.EQUIPMENT_ATTACH_FILE, {
        id: equipmentId,
        fileType: fileType,
      });
    } else {
      url = generatePath(URLs.API.EQUIPMENT_ATTACH_LOCALIZED_FILE, {
        id: equipmentId,
        fileType: fileType,
        lang: locale
      });
    }

    let form = new FormData();
    form.append('attachment', file);

    return new Promise<boolean>((resolve, reject) => {
      tLogStyled(`[EquipmentService.addFile] Uploading file ${file.name} to language ${locale} on equipment id ${equipmentId}`, logHelper.subdued);

      this.post(url, form, progressEvent => {
        const progress = progressEvent.loaded / progressEvent.total;

        if (progress === 1) return;

        const toastContent = <>Uploading file <br/>{file.name}<br/>{Math.round(progress) * 100}%</>;
        if (toastRef === undefined) {
          toastRef = toast(toastContent, {transition: Slide, progress: progress});
        } else {
          toast.update(toastRef, {render: toastContent, progress: progress});
        }
      })
        .then(() => {
          tLogStyled(`[EquipmentService.addFile] Uploaded file ${file.name} to language ${locale} on equipment id ${equipmentId}`, logHelper.subduedSuccess);
          resolve(true);
        })
        .catch(e => {
          tLogStyled(`[EquipmentService.addFile] Failed to upload file ${file.name} to language ${locale} on equipment id ${equipmentId}`, logHelper.subduedFailed);
          reject(e);
          if (toastRef) toast.dismiss(toastRef);
          // toast(<>Failed to upload file: {file.name}<br/>{e.message}</>, {transition: Slide, type: 'error'});
        });
    });
  }

  public deleteFile(equipmentId: string, fileType: Equipment.FileType, key: string, locale?: string) {
    let toastRef: React.ReactText | undefined = undefined;

    let url: string;

    if (!!locale) {
      // /equipments/:id/:fileType/:key/:lang
      url = generatePath(URLs.API.EQUIPMENT_DELETE_LOCALIZED_FILE, {
        id: equipmentId,
        fileType: fileType,
        key: key,
        lang: locale
      });
    } else {
      // /equipments/:id/:fileType/:key
      url = generatePath(URLs.API.EQUIPMENT_DELETE_FILE, {
        id: equipmentId,
        fileType: fileType,
        key: key
      });
    }

    return new Promise<boolean>((resolve, reject) => {
      tLogStyled(`[EquipmentService.deleteFile] Deleting key ${key} from language ${locale} on equipment id ${equipmentId}`, logHelper.subdued);

      this.delete(url)
        .then(() => {
          tLogStyled(`[EquipmentService.deleteFile] Deleted key ${key} from language ${locale} on equipment id ${equipmentId}`, logHelper.subduedSuccess);
          resolve(true);
        })
        .catch(e => {
          tLogStyled(`[EquipmentService.deleteFile] Failed to delete key ${key} from language ${locale} on equipment id ${equipmentId}`, logHelper.subduedFailed);
          reject(e);
          if (toastRef) toast.dismiss(toastRef);
          // toast(<>Failed to delete file with key: {key}<br/>{e.message}</>, {transition:Slide, type: 'error'});
        });
    });
  }

  async editEquipment(equipId: string, videos: Map<string, string>): Promise<Equipment.DTO> {
    let url = generatePath(URLs.API.EQUIPMENT, {
      id: equipId
    });

    return this.patch(url, {videos: Object.fromEntries(videos)});
  }

  onSubjectUpdate(sub?: User.DTO): void {
    // TODO set userAssets when we know what equipments user has access to
    getAssetList__FAKE() // TODO implement real method
      .then(updateUserAssetList);
    // TODO sent each time user is updated (eg. select another language)
  }

  // async downloadFile(fileKey: string, fileName: string) {
  //   let url = FileService.getFileURL(fileKey);
  //   let file = await this.getFile(url);
  //   this.saveBlob(file, fileName);
  // }
  //
  // saveBlob(blob: Blob, fileName: string) {
  //   var a = document.createElement('a');
  //   a.href = window.URL.createObjectURL(blob);
  //   a.download = fileName;
  //   a.dispatchEvent(new MouseEvent('click'));
  // }
}