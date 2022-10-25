export enum Room {
  TRANSFER = "TRANSFER",
  EGG_HANDLING = "EGG_HANDLING",
  CHICK_PROCESSING = "CHICK_PROCESSING",
  WASTE_DISPOSAL = "WASTE_DISPOSAL"
}

export namespace Configuration {
  export class DTO {
    id: string
    key: string
    name: string
    room: Room
    visibility: boolean

    equipmentKeys: string[]
    crateKey: string
    crateContentKey: string
    readonly: boolean;

    // pdf: string;
    relatedCustomer: string;
    sourceCfg?: string;//source config id
    createdAt: number;
    createdBy?: string;

    constructor(id: string, key: string, name: string, room: Room, visibility: boolean, equipmentKeys: string[], crateKey: string, crateContentKey: string, readonly: boolean, relatedCustomer: string, sourceCfg: string, createdAt: number, createdBy: string) {
      this.id = id;
      this.key = key;
      this.name = name;
      this.room = room;
      this.visibility = visibility;
      this.equipmentKeys = equipmentKeys;
      this.crateKey = crateKey;
      this.crateContentKey = crateContentKey;
      this.readonly = readonly;
      this.relatedCustomer = relatedCustomer;
      this.sourceCfg = sourceCfg;
      this.createdAt = createdAt;
      this.createdBy = createdBy;
    }
  }
}
