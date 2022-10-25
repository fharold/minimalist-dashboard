import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {Configuration, Room} from 'models/configuration';
import {ServiceRepository} from 'services/serviceRepository';
import {headerStore} from 'stores';

import './Rooms.scss';
import Skeleton, {SKELETON_TYPE} from 'components/Shared/Skeleton';
import ButtonIcon from 'components/Shared/Button/ButtonIcon';
import {useTranslation} from "react-i18next";

type RoomCellProps = {
  room: string
}

const RoomCell: React.FC<RoomCellProps> = (props: RoomCellProps) => {
  const [configurations, setConfigurations] = useState<Configuration.DTO[]>();
  const {t} = useTranslation();

  useEffect(() => {
    const cfgSvc = ServiceRepository.getInstance().cfgSvc;
    cfgSvc.getConfigurations(props.room, true)
      .then(res => setConfigurations(res.data));
  }, [props.room]);

  console.log(props.room);

  return (
    <Link className={'room-cell'} style={{textDecoration: 'none'}} to={`/rooms/${props.room}`}>

      <div className={'room-title'}>
        <span>{t(props.room)}</span>
        <ButtonIcon label={'edit'} onClick={() => void 0 /* Global click handler with <Link> */}
                    iconUrl={'/assets/img/edit_icon'}/>
      </div>
      <div className="room-configurations-wrapper">
        <div className={'room-configurations'}>

          {!configurations && /* WHILE LOADING */
            <div className={'room-configuration-elem'}>
              {/*Loading*/}
              <Skeleton type={SKELETON_TYPE.ROOM_CONFIGURATION}/>
            </div>
          }

          {configurations && configurations.length > 0 && /* DISPLAY CONFIGS */
            configurations?.map((cfg, id) => {
              return <div key={id} className={'room-configuration-elem'}>{cfg.name}</div>;
            })
          }

          {configurations && configurations.length === 0 && /* EMPTY ROOM */
            <div className={'room-configuration-elem'}>
              {t('noConfigurationInRoom')}
            </div>
          }
        </div>
      </div>

    </Link>
  );
};

const Rooms: React.FC = () => {
  const setHeader = headerStore(state => state.setHeaderProps);
  const {t} = useTranslation();

  setHeader({
    title: t('cevaAdminDashboardConfigurationEditor'),
    backEnabled: true
  });

  return (
    <div className={'rooms-page'}>
      <div className={'section-title'}>{t('roomsPageChooseOneToEdit')}</div>
      <div className={'rooms-list'}>
        <RoomCell key={Room.CHICK_PROCESSING} room={Room.CHICK_PROCESSING}/>
        <RoomCell key={Room.WASTE_DISPOSAL} room={Room.WASTE_DISPOSAL}/>
        <RoomCell key={Room.TRANSFER} room={Room.TRANSFER}/>
        <RoomCell key={Room.EGG_HANDLING} room={Room.EGG_HANDLING}/>
      </div>
    </div>
  );
};

export default Rooms;