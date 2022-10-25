import ApiService from "./api/apiService";
import {QuerySort} from "../models/api/querySort";
import {QueryPage} from "../models/api/queryPage";
import {MultipleEntityResponse} from "../models/api/multipleEntityResponse";
import {URLs} from "../utils/urls";
import {generatePath} from "react-router-dom";
import QueryFilter from "../models/api/queryFilter";
import {Configuration, Room} from "../models/configuration";

export interface CloneCfgDTO {
  cfgToCloneId: string,
  targetRelatedCustomer: string
}

export interface CloneAndModifyCfgDTO {
  cfgToCloneId: string,
  name: string,
  equipmentKeys: string[],
  targetRelatedCustomer: string
}

export interface CreateCfgDTO {
  name: string,
  equipmentKeys: string[],
  readonly: true,
  key: string,
  room: string,
  visibility: boolean,
  crateKey: string,
  crateContentKey: string
}

export class ConfigurationService extends ApiService {
  public async editConfiguration(configurationId: string, data: Partial<Configuration.DTO>): Promise<Configuration.DTO> {
    let url = generatePath(URLs.API.CONFIGURATION, {
      configurationId: configurationId
    });

    return await this.patch(url, data)
  }

  public async cloneConfiguration(payload: CloneCfgDTO): Promise<Configuration.DTO> {
    return this.post(URLs.API.CONFIGURATION_CLONE, payload);
  }

  public async cloneAndModifyConfiguration(payload: CloneAndModifyCfgDTO): Promise<Configuration.DTO> {
    return this.patch(URLs.API.CONFIGURATION_CLONE, payload);
  }

  public async createConfiguration(payload: CreateCfgDTO): Promise<Configuration.DTO> {
    return this.post(URLs.API.CONFIGURATIONS, payload);
  }

  public async getConfigurations(
    room?: string,
    readonly?: boolean,
    filters?: QueryFilter<Partial<Configuration.DTO>>,
    sort?: QuerySort,
    page?: QueryPage
  ): Promise<MultipleEntityResponse<Configuration.DTO>> {
    console.log("filters :", room);
    if (!filters) {
      filters = new QueryFilter<Partial<Configuration.DTO>>({});
    }

    if (room) filters.fields.room = room as Room;
    if (room) filters.fields.readonly = readonly;

    return this.getList(URLs.API.CONFIGURATIONS, filters, sort, page);
  }

  public async getConfiguration(configurationId: string): Promise<Configuration.DTO> {
    let url = generatePath(URLs.API.CONFIGURATION, {
      configurationId: configurationId
    });

    return this.getOne(url);
  }

  public async removeConfiguration(configurationId: string): Promise<void> {
    let url = generatePath(URLs.API.CONFIGURATION, {
      configurationId: configurationId
    });

    return this.delete(url);
  }
}