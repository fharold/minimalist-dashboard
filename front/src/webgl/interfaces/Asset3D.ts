import {Asset} from 'interfaces';
import {AnimationClip, Camera, Group} from 'three/src/Three';

export interface Asset3D extends Asset {
  scene: Group;
  animations: AnimationClip[];
  cameras: Camera[];
}