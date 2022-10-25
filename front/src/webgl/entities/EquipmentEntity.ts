import {Object3D, Vector3} from 'three';
import {AssetEntity} from 'webgl/entities/AssetEntity';
import {Asset3D} from 'webgl/interfaces';

export class EquipmentEntity extends AssetEntity {
  public state: string;
  protected _nextPivotObject?: Object3D; // Object3D whose position represents the pivot of the next asset in line

  constructor(asset: Asset3D) {
    super(asset);

    // this._nextPivotObject = getObjectByType('next_equipment_pivot', this.scene);
    this._nextPivotObject = this.getObjectByType('next_equipment_pivot');
    this.state = `line.${this.key}`;
  }

  get nextPivotPosition() {
    return this._nextPivotObject?.position || new Vector3();
  }
}