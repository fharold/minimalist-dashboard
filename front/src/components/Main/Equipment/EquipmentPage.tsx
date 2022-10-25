import React, {useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {Equipment} from 'models/equipment';
import {ServiceRepository} from 'services/serviceRepository';
import ImageGallery from 'react-image-gallery';
import {EquipmentEditor} from './EquipmentEditor';
import {useStateSafe} from 'hooks';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './Equipment.scss';
import './EquipmentViewer.scss';


export type SlideshowProps = {
  images: Array<string>;
  visible: boolean;
  closeRequired?: () => void;
}

// TODO Extract
export const Slideshow: React.FC<SlideshowProps> = (props: SlideshowProps) => {
  useEffect(() => {
    // auto close if image array empty
    if (props.images.length < 1) props?.closeRequired?.();
  }, [props]);

  if (!props.visible) return <></>;

  return <div className={'slideshow'}>
    <img className={'close'} src={'/assets/img/icon_close.png'} alt={'close'} onClick={() => props?.closeRequired?.()}/>
    <ImageGallery items={
      props.images.map(image => {
        return {original: image};
      })
    }/>
  </div>;
};

const EquipmentPage: React.FC = () => {
  const [equipment, setEquipment] = useStateSafe<Equipment.DTO | undefined>(undefined);

  const {id} = useParams();

  useEffect(() => {
    const loadEquipment = async (id: string) =>
      setEquipment(await ServiceRepository.getInstance().equipmentSvc.getEquipment(id));

    if (id)
      loadEquipment(id);
  }, [id, setEquipment]);

  return <div className={'equipment-page'}>
    {equipment && <EquipmentEditor equipment={equipment}/>}
  </div>;
};

export default EquipmentPage;