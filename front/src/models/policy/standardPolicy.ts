import {Policy} from "./policy";
import {User} from "../user";
import {Forbidden} from "http-errors";
import {Equipment} from "../equipment";
import {CRUD} from "./crud";

export class StandardPolicy implements Policy {
  canCreateReadonlyConfiguration(): boolean {
    return false;
  }

  canChangeUserReferent(): boolean {
    return false;
  }

  canChangeUserPassword(editor: User.DTO, userToEdit: User.DTO) {
    if (editor.id !== userToEdit.id) throw new Forbidden("Standard user cannot change another user password.");
  }

  userRolesThatCanBeGivenToAnotherUser(): Array<User.Role> {
    return [];
  }

  assignCustomerToSalesRep(userAsking: User.DTO, customerToAssign: User.DTO, salesRepToAssignTo: User.DTO): void {
    throw new Forbidden("Standard user cannot assign itself");
  }

  doActionOnUser(userAsking: User.DTO, action: CRUD, affectedUser?: User.DTO): void {
    if (!affectedUser || userAsking.id !== affectedUser.id) throw new Forbidden("Standard user can't do global actions or do actions on another user than himself.");

    if (![CRUD.READ, CRUD.UPDATE].includes(action)) throw new Forbidden("Standard user can't do anything else than read or update its own profile.");
  }

  canEditUser(editor: User.DTO, userToEdit: User.DTO, dataToEditUserWith: User.DTO): void {
    if (editor.id !== userToEdit.id) throw new Forbidden("Standard user can only edit itself.");

    if (dataToEditUserWith.role && dataToEditUserWith.role !== User.Role.STANDARD) throw new Forbidden("Standard user cannot change its role.");
  }

  canUserExpire(): boolean {
    return true;
  }

  canDoActionOnTranslation(action: CRUD): boolean {
    return action === CRUD.READ;
  }

  canDoActionOnEquipment(action: CRUD): boolean {
    return action === CRUD.READ;
  }

  canDoActionOnEquipmentFile(action: CRUD, fileType: Equipment.FileType): boolean {
    return action === CRUD.READ;
  }

  canReadS3Files(): boolean {
    return true;
  }

  canDoActionOnLanguage(action: CRUD): Boolean {
    return action === CRUD.READ;
  }

  getLandingURL(): string {
    return "configurations";
  }

  getEquipmentUri(equipment: Equipment.DTO): string {
    return `/equipment/${equipment.key}`;
  }
}