import {Policy} from "./policy";
import {User} from "../user";
import {Equipment} from "../equipment";
import {CRUD} from "./crud";

export class CevaAdminPolicy implements Policy {
  canChangeUserReferent(): boolean {
    return true;
  }

  userRolesThatCanBeGivenToAnotherUser(): Array<User.Role> {
    return [User.Role.CEVA_ADMIN, User.Role.SALES_REP, User.Role.STANDARD, User.Role.STANDARD];
  }

  assignCustomerToSalesRep(userAsking: User.DTO, customerToAssign: User.DTO, salesRepToAssignTo: User.DTO): void {
    //can do anything as an admin.
  }

  doActionOnUser(userAsking: User.DTO, action: CRUD, affectedUser?: User.DTO): void {
    //can do anything as an admin.
  }

  canEditUser(editor: User.DTO, userToEdit: User.DTO, dataToEditUserWith: User.DTO) {
    //can do anything as an admin.
  }

  canChangeUserPassword(editor: User.DTO, userToEdit: User.DTO) {
    //can do anything as an admin.
  }

  canUserExpire(): boolean {
    return false;
  }

  canDoActionOnTranslation(): boolean {
    return true;
  }

  canDoActionOnEquipment(action: CRUD): boolean {
    return true;
  }

  //ceva admin can update pictures and datasheets but not the 3D model.
  canDoActionOnEquipmentFile(action: CRUD, fileType: Equipment.FileType): boolean {
    if (fileType !== Equipment.FileType.MODEL && fileType !== Equipment.FileType.ILLUSTRATION) return true;

    return action === CRUD.READ;
  }

  canReadS3Files(): boolean {
    return true;
  }

  canDoActionOnLanguage(action: CRUD): Boolean {
    return true;
  }

  getLandingURL(): string {
    return "SDashboard";
  }

  canCreateReadonlyConfiguration(): boolean {
    return true;
  }

  getEquipmentUri(equipment: Equipment.DTO): string {
    return `/equipments/${equipment.id}`;
  }
}