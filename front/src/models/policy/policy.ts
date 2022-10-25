import {User} from "../user";
import {Equipment} from "../equipment";
import {CRUD} from "./crud";

export interface Policy {
  canCreateReadonlyConfiguration() : boolean;

  userRolesThatCanBeGivenToAnotherUser(): Array<User.Role>;

  canChangeUserPassword(editor: User.DTO, userToEdit: User.DTO): void;

  canEditUser(editor: User.DTO, userToEdit: User.DTO, dataToEditUserWith: User.DTO): void;

  canChangeUserReferent(): boolean;

  canDoActionOnTranslation(action: CRUD): boolean;

  doActionOnUser(userAsking: User.DTO, action: CRUD, affectedUser?: User.DTO): void;

  assignCustomerToSalesRep(userAsking: User.DTO, customerToAssign: User.DTO, salesRepToAssignTo: User.DTO): void;

  canUserExpire(): boolean;

  canDoActionOnEquipment(action: CRUD): boolean;

  canDoActionOnEquipmentFile(action: CRUD, fileType: Equipment.FileType): boolean;

  canReadS3Files(): boolean;

  canDoActionOnLanguage(action: CRUD): Boolean;

  getLandingURL(): string;

  getEquipmentUri(equipment: Equipment.DTO): string;
}