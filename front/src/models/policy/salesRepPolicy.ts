import {Policy} from "./policy";
import {User} from "../user";
import {Forbidden, UnprocessableEntity} from "http-errors";
import {Equipment} from "../equipment";
import {CRUD} from "./crud";

export class SalesRepPolicy implements Policy {
  canChangeUserReferent(): boolean {
    return false;
  }

  userRolesThatCanBeGivenToAnotherUser(): Array<User.Role> {
    return [User.Role.ANONYMOUS, User.Role.STANDARD];
  }

  assignCustomerToSalesRep(userAsking: User.DTO, customerToAssign: User.DTO, salesRepToAssignTo: User.DTO): void {
    //if trying to assign someone that is not sales rep.
    if (salesRepToAssignTo.role !== User.Role.SALES_REP) throw new UnprocessableEntity("Can't assign a customer to an user that is not a sales rep");

    //if sales rep tries to assign customer to another sales rep.
    if (userAsking.id !== salesRepToAssignTo.id) throw new Forbidden("Sales rep can't assign a customer to another sales rep");
  }

  doActionOnUser(userAsking: User.DTO, action: CRUD, affectedUser?: User.DTO): void {
    //asking user can modify or read its own properties.
    if (userAsking.id === affectedUser?.id && [CRUD.READ, CRUD.UPDATE].includes(action)) return;

    /*
        sales rep can only CRUD standard users account that are not assigned
        to a referent or assigned to asking referent
     */
    if (affectedUser?.role === User.Role.STANDARD
      && (affectedUser?.referentUserId === userAsking.id
        || affectedUser?.referentUserId === undefined)) return;

    throw new Forbidden(`userAsking: ${userAsking.id}, action: ${action}, affectedUser?: ${affectedUser}`);
  }

  canEditUser(editor: User.DTO, userToEdit: User.DTO, dataToEditUserWith: User.DTO): void {
    if (userToEdit.referentUserId === editor.id
      && userToEdit.role === User.Role.STANDARD) return;

    if (editor.id === userToEdit.id) {
      return;
    }
    throw new Forbidden("Sales rep can only edit itself or a user that it is refering to.");
  }

  canChangeUserPassword(editor: User.DTO, userToEdit: User.DTO) {
    if (userToEdit.referentUserId === editor.id
      && userToEdit.role === User.Role.STANDARD) return;

    if (editor.id === userToEdit.id) {
      return;
    }
    throw new Forbidden("Sales rep can only edit itself or a user that it is refering to.");
  }

  canUserExpire(): boolean {
    return false;
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
    return "SDashboard";
  }

  canCreateReadonlyConfiguration(): boolean {
    return false;
  }

  getEquipmentUri(equipment: Equipment.DTO): string {
    return `/equipment/${equipment.key}`;
  }
}