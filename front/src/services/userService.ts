import ApiService from "./api/apiService";
import {QuerySort} from "../models/api/querySort";
import {QueryPage} from "../models/api/queryPage";
import {MultipleEntityResponse} from "../models/api/multipleEntityResponse";
import {User} from "../models/user";
import {URLs} from "../utils/urls";
import {ListenableService, Listener} from "./serviceRepository";
import {generatePath} from "react-router-dom";
import QueryFilter from "../models/api/queryFilter";
import {AccessSendDTO} from "../components/Main/Configuration/AccessSendPage";

export interface AddCustomerPayload {
  email: string
  firstname: string
  lastname: string
  company: string
  hatchery: string
  phone: string
  addressLine1: string
  addressLine2: string
  zipCode: string
  city: string
  country: string
  status: User.Status
  expireAt: number
  referentUserId: string
  role: User.Role
  profile?: User.CustomerProfile
}

export interface AddSalesPayload {
  email: string
  firstname: string
  lastname: string
  phone: string
  status: boolean | string
  preferredLanguage: string
  referentUserId?: string
  role: User.Role
  profile?: User.SalesProfile
}

export interface EditProfilePayload {
  firstname: string
  lastname: string
}

export interface EditPasswordPayload {
  password: string
}

export class UserService extends ApiService implements ListenableService<User.DTO> {
  public currentUser: User.DTO | undefined;
  private _listeners: Array<Listener<User.DTO>> = [];

  public async getCurrentUser(
    forceRefresh = false
  ): Promise<User.DTO> {
    if (!this.currentUser || forceRefresh) {
      void (await this.refreshCurrentUserProfile());
    }
    if (this.currentUser) {
      return this.currentUser;
    } else {
      return Promise.reject(
        "An error occurred while retrieving the user profile."
      );
    }
  }

  public async editUser(userId: string, data: any): Promise<User.DTO> {
    let url = generatePath(URLs.API.USER, {
      userId: userId
    });

    return await this.patch(url, data)
  }

  public async editPassword(userId: string, password: string): Promise<User.DTO> {
    let url = generatePath(URLs.API.USER_PASSWORD, {
      userId: userId
    });

    return await this.patch(url, {password: password})
  }

  public async sendAccess(userId: string, payload?: Partial<AccessSendDTO>): Promise<void> {
    let url = generatePath(URLs.API.SEND_ACCESS_USER, {
      userId: userId
    });

    return await this.post(url, payload)
  }

  public async getCompanies(): Promise<string[]> {
    try {
      let companiesResponse = await this.getList<string>(
        URLs.API.GET_COMPANIES
      );
      return companiesResponse.data
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  public async refreshCurrentUserProfile(): Promise<void> {
    try {
      this.currentUser = await this.getOne<User.DTO>(
        URLs.API.GET_CURRENT_USER_PROFILE
      );
      this._notifyListeners();
    } catch (e) {
      // redirectToLoginPage()
      console.info("failed to refresh...");
      console.log(e);
    }
  }

  public async addCustomer(payload: AddCustomerPayload): Promise<User.DTO> {
    return this.post(URLs.API.USERS, payload);
  }

  public async addSales(payload: AddSalesPayload): Promise<User.DTO> {
    return this.post(URLs.API.USERS, payload);
  }

  public async getUsers(
    filters?: QueryFilter<Partial<User.DTO>>,
    sort?: QuerySort,
    page?: QueryPage
  ): Promise<MultipleEntityResponse<User.DTO>> {
    return this.getList(URLs.API.USERS, filters, sort, page);
  }

  public async getUser(userId: string): Promise<User.DTO> {
    let url = generatePath(URLs.API.USER, {
      userId: userId
    });

    return this.getOne(url);
  }

  public async deleteProfiles(ids: string[]): Promise<void> {
    return this.delete(URLs.API.USERS, {
      users: ids,
    });
  }

  public async deleteProfile(id: string): Promise<void> {
    // return this.delete(HttpClientUtils.generateUrl(USER_URL, {userId: id}));
  }

  private _notifyListeners(): void {
    for (let listener of this._listeners) {
      listener.onSubjectUpdate(this.currentUser);
    }
  }

  public addListener(listener: Listener<User.DTO>): void {
    this._listeners.push(listener);
  }

  public removeListener(listener: Listener<User.DTO>): void {
    let index = this._listeners.indexOf(listener);
    if (index === -1) return;
    this._listeners.splice(index, 1);
  }

  public async removeUser(userToDelete: User.DTO): Promise<void> {
    let url = generatePath(URLs.API.USER, {
      userId: userToDelete.id
    });

    return this.delete(url);
  }
}