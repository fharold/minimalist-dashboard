import {Asset} from 'interfaces';
import {logHelper, tLogStyled} from 'utils/Logger';
import {FileService} from "./fileService";
import {ServiceRepository} from "./serviceRepository";
import {AuthService} from "./authService";

// TODO FAKE DATE

const assets_FAKE: Asset[] = [
  {key: 'eq_03', id:'627cdb495c6233d6f939478a', url: '/assets/glb/equipments/eq_03.glb', fileSize: 2_665_208},
  {key: 'eq_01', id:'627cdb495c6233d6f939478a', url: '/assets/glb/equipments/eq_01.glb', fileSize: 2_952},
  {key: 'eq_02', id:'627cdb495c6233d6f939478a', url: '/assets/glb/equipments/eq_02.glb', fileSize: 3_000},
  {key: 'eq_04', id:'627cdb495c6233d6f939478a', url: '/assets/glb/equipments/eq_04.glb', fileSize: 4_443_640},

  {key: 'laser_life', id:'62838b4bf61d45baa48d36c8', url: '/assets/glb/equipments/future_poultry/01_laser_life.glb', fileSize: 830_244},
  // {key: 'egginject', id:'627cdb495c6233d6f939478a', url: FileService.getFileURL('1652350218796', undefined ), fileSize: 3_482_444},
  {key: 'selective_transfer', id:'62838b53f61d45baa48d36f4', url: '/assets/glb/equipments/future_poultry/03-04_selective_transfer.glb', fileSize: 4_693_140},
  {key: 'clear_egg_remover', id:'62838b57f61d45baa48d3720', url: '/assets/glb/equipments/future_poultry/05_clear_egg_remover.glb', fileSize: 1_346_516},
  {key: 'dead_egg_tipper', id:'62838b5af61d45baa48d374c', url: '/assets/glb/equipments/future_poultry/06_dead_egg_tipper.glb', fileSize: 1_589_912},

  {key: 'egg', id:'627cdb495c6233d6f939478a', url: '/assets/glb/crateContent/egg.glb', fileSize: 2_072},
  {key: 'chick', id:'627cdb495c6233d6f939478a', url: '/assets/glb/crateContent/chick.glb', fileSize: 25_680},
];

export const getAssetList__FAKE = async (): Promise<Asset[]> => {
  tLogStyled('[getAssetList__FAKE()] using fake data : userAssets', logHelper.warning);

  return new Promise<Asset[]>((resolve) => {
    setTimeout(() => resolve(assets_FAKE), 1000);
  });
};