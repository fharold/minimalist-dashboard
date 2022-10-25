import {CevaAdminPolicy} from "./cevaAdminPolicy";
import {Equipment} from "../equipment";
import {CRUD} from "./crud";

export class SuperAdminPolicy extends CevaAdminPolicy {
    //super admin can update pictures and datasheets AND the 3D model.
    override canDoActionOnEquipmentFile(action: CRUD, fileType: Equipment.FileType): boolean {
        return true;
    }

    override getLandingURL(): string {
      return "CADashboard";
    }
}