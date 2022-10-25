import {User} from "../models/user";
import {Policy} from "../models/policy/policy";
import {AnonymousPolicy} from "../models/policy/anonymousPolicy";
import {StandardPolicy} from "../models/policy/standardPolicy";
import {SalesRepPolicy} from "../models/policy/salesRepPolicy";
import {CevaAdminPolicy} from "../models/policy/cevaAdminPolicy";
import {SuperAdminPolicy} from "../models/policy/superAdminPolicy";
import {UserService} from "./userService";
import {ListenableService, Listener, ServiceRepository} from "./serviceRepository";

export class PolicyService implements ListenableService<Policy>, Listener<User.DTO> {
  private _policy: Policy;
  private _listeners: Array<Listener<Policy>> = [];

  public get policy(): Policy {
    return this._policy;
  }

  constructor(_userSvc: UserService) {
    _userSvc.addListener(this);
    console.log("role1 : ", _userSvc.currentUser?.role);
    this._policy = this._getPolicyForRole(_userSvc.currentUser?.role);
    this._notifyListeners();
  }

  onSubjectUpdate(sub?: User.DTO): void {
    const newPolicy = this._getPolicyForRole(sub?.role);
    if (this._policy !== newPolicy) {
      this._policy = newPolicy
      this._notifyListeners();
    }
  }

  private _getPolicyForRole(role?: User.Role): Policy {
    if (!role) return new AnonymousPolicy();

    switch (role) {
      case User.Role.ANONYMOUS:
        return new AnonymousPolicy();
      case User.Role.STANDARD:
        return new StandardPolicy();
      case User.Role.SALES_REP:
        return new SalesRepPolicy();
      case User.Role.CEVA_ADMIN:
        return new CevaAdminPolicy();
      case User.Role.SUPER_ADMIN:
        return new SuperAdminPolicy();
    }
  }

  public addListener(listener: Listener<Policy>): void {
    this._listeners.push(listener);
  }

  public removeListener(listener: Listener<Policy>): void {
    let index = this._listeners.indexOf(listener);
    if (index === -1) return;
    this._listeners.splice(index, 1);
  }

  private _notifyListeners(): void {
    for (let listener of this._listeners) {
      listener.onSubjectUpdate(this._policy);
    }
  }

  init() {
  }
}