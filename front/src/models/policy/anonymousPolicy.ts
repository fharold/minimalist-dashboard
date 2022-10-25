import {Policy} from "./policy";
import {User} from "../user";
import {Forbidden} from "http-errors";
import {Equipment} from "../equipment";
import {CRUD} from "./crud";

export class AnonymousPolicy implements Policy {
  canCreateReadonlyConfiguration(): boolean {
    return false;
  }

  canChangeUserReferent(): boolean {
    return false;
  }

  canChangeUserPassword(editor: User.DTO, userToEdit: User.DTO) {
    throw new Forbidden("Anonymous user is powerless");
  }

  canEditUser(editor: User.DTO, userToEdit: User.DTO, dataToEditUserWith: User.DTO): void {
    throw new Forbidden("Anonymous user is powerless");
  }

  userRolesThatCanBeGivenToAnotherUser(): Array<User.Role> {
    return [];
  }

  assignCustomerToSalesRep(userAsking: User.DTO, customerToAssign: User.DTO, salesRepToAssignTo: User.DTO): void {
    throw new Forbidden("Anonymous user is powerless");
  }

  doActionOnUser(userAsking: User.DTO, action: CRUD, affectedUser?: User.DTO): void {
    throw new Forbidden("Anonymous user is powerless");
  }

  canUserExpire(): boolean {
    return true;
  }

  canDoActionOnTranslation(action: CRUD): boolean {
    return false;
  }

  canDoActionOnEquipment(action: CRUD): boolean {
    return false;
  }

  canDoActionOnEquipmentFile(action: CRUD, fileType: Equipment.FileType): boolean {
    return false;
  }

  canReadS3Files(): boolean {
    return false;
  }

  canDoActionOnLanguage(action: CRUD): Boolean {
    return false;
  }

  getLandingURL(): string {
    return "lost";
  }

  getEquipmentUri(equipment: Equipment.DTO): string {
    return "/";
  }
}