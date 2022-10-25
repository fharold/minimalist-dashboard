import React, {useEffect} from 'react';
import {Link} from 'react-router-dom';
import {Equipment} from 'models/equipment';
import {ServiceRepository} from 'services/serviceRepository';
import {useStateSafe} from 'hooks';
import {headerStore} from "../../../stores";

type EquipmentCellProps = {
  equipment: Equipment.DTO
}

const EquipmentCell: React.FC<EquipmentCellProps> = (props: EquipmentCellProps) => {
  let policy = ServiceRepository.getInstance().policySvc.policy;
  let uri = policy.getEquipmentUri(props.equipment);

  return <Link className={"equipment-cell"} style={{ textDecoration: 'none' }} to={uri}>
    <div className={"equipment-title"}><span>{props.equipment.name}</span></div>
    <img src={"./assets/img/flag_placeholder.png"} alt={"equipment_illustration"}/>
  </Link>;
}

export interface EquipmentsProps {
  room: string | null;
}

const Equipments: React.FC<EquipmentsProps> = (props: EquipmentsProps) => {
  const [equipments, setEquipments] = useStateSafe<Array<Equipment.DTO> | undefined>();
  const setHeader = headerStore(state => state.setHeaderProps);

  setHeader({
    title: props.room || "Equipments",
    subtitle: 'Catalog',
    backEnabled: true
  });

  useEffect(() => {
    if (props.room) {
      ServiceRepository.getInstance().equipmentSvc.listEquipments()
        .then(equipments => setEquipments(equipments.data))
        .catch(e => {
          console.error("Failed to fetch equipments", e)
        });
    } else {
      ServiceRepository.getInstance().equipmentSvc.listEquipments()
        .then(equipments => setEquipments(equipments.data))
        .catch(e => {
          console.error("Failed to fetch equipments", e)
        });
    }
  }, [props.room, setEquipments]);

  return (
    <div className={"equipments-page"}>
      <div className={"equipments-list"}>
        {equipments?.map(equip => <EquipmentCell key={equip.key} equipment={equip}/>)}
      </div>
    </div>
  );
};

export default Equipments;