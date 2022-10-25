import React from 'react';
import ContentLoader from 'react-content-loader';
import {pxToRem} from 'utils/HtmlClassUtils';

export enum SKELETON_TYPE {
  EQUIPMENT_VIEWER_TITLE,
  EQUIPMENT_VIEWER_DESCRIPTION,
  EQUIPMENT_VIEWER_SPECS,
  USER_LIST_COLUMN,
  ROOM_CONFIGURATION
}

type SkeletonProps = {
  type: SKELETON_TYPE
}

const backgroundColorLight = 'rgb(255,255,255)';
const foregroundColorLight = 'rgb(255,255,255)';
const backgroundColorDark = 'rgb(180,180,180)';
const foregroundColorDark = 'rgb(220,220,220)';
const backgroundOpacity = 0.4;
const foregroundOpacity = 0.5;
const speed = 1;

const Skeleton: React.FC<SkeletonProps> = (props) => {
  switch (props.type) {
    case SKELETON_TYPE.EQUIPMENT_VIEWER_TITLE:
      return (
        <ContentLoader width="100%" height={pxToRem(63)} speed={speed}
          backgroundColor={backgroundColorLight} backgroundOpacity={backgroundOpacity}
          foregroundColor={foregroundColorLight} foregroundOpacity={foregroundOpacity}>
          <rect x="0" y="0" rx={pxToRem(20)} ry={pxToRem(20)} width="20rem" height={pxToRem(63)}/>
        </ContentLoader>);

    case SKELETON_TYPE.EQUIPMENT_VIEWER_DESCRIPTION:
      return (
        <ContentLoader width="35.75rem" height="8.75rem" speed={speed}
          backgroundColor={backgroundColorDark} backgroundOpacity={backgroundOpacity}
          foregroundColor={foregroundColorDark} foregroundOpacity={foregroundOpacity}>
          <rect x="0" y="0.375rem" rx={pxToRem(8)} ry={pxToRem(8)} width="94%" height="1.25rem"/>
          <rect x="0" y={pxToRem(28+6)} rx={pxToRem(8)} ry={pxToRem(8)} width="96%" height="1.25rem"/>
          <rect x="0" y={pxToRem(2*28+6)} rx={pxToRem(8)} ry={pxToRem(8)} width="93%" height="1.25rem"/>
          <rect x="0" y={pxToRem(3*28+6)} rx={pxToRem(8)} ry={pxToRem(8)} width="95%" height="1.25rem"/>
          <rect x="0" y={pxToRem(4*28+6)} rx={pxToRem(8)} ry={pxToRem(8)} width="70%" height="1.25rem"/>
        </ContentLoader>);

    case SKELETON_TYPE.EQUIPMENT_VIEWER_SPECS:
      return (
        <ContentLoader width="31.25rem" height="5.25rem" speed={speed}
          backgroundColor={backgroundColorDark} backgroundOpacity={backgroundOpacity}
          foregroundColor={foregroundColorDark} foregroundOpacity={foregroundOpacity}>
          <rect x="0rem" y={pxToRem(11)} width={pxToRem(7)} height={pxToRem(7)}/>
          <rect x="2rem" y={pxToRem(6)} rx={pxToRem(8)} ry={pxToRem(8)} width="60%" height="1.25rem"/>

          <rect x="0rem" y={pxToRem(28+11)} width={pxToRem(7)} height={pxToRem(7)}/>
          <rect x="2rem" y={pxToRem(28+6)} rx={pxToRem(8)} ry={pxToRem(8)} width="80%" height="1.25rem"/>

          <rect x="0rem" y={pxToRem(2*28+11)} width={pxToRem(7)} height={pxToRem(7)}/>
          <rect x="2rem" y={pxToRem(2*28+6)} rx={pxToRem(8)} ry={pxToRem(8)} width="50%" height="1.25rem"/>
        </ContentLoader>);
    case SKELETON_TYPE.USER_LIST_COLUMN:
      return (
        <ContentLoader width={'100%'} height={pxToRem(50)} speed={speed}
          backgroundColor={backgroundColorDark} backgroundOpacity={backgroundOpacity}
          foregroundColor={foregroundColorDark} foregroundOpacity={foregroundOpacity}>
          <rect x="0" y={pxToRem(20)} rx={pxToRem(10)} ry={pxToRem(10)} width={`${60 + (Math.random() * 20)}%`} height={pxToRem(20)}/>
        </ContentLoader>
      );
    case SKELETON_TYPE.ROOM_CONFIGURATION:
      return (
        <ContentLoader width={'100%'} height={pxToRem(2*36+30)} speed={speed}
          backgroundColor={backgroundColorDark} backgroundOpacity={backgroundOpacity}
          foregroundColor={foregroundColorDark} foregroundOpacity={foregroundOpacity}>
          <rect x="0" y={pxToRem(4)} rx={pxToRem(8)} ry={pxToRem(8)} width="75%" height={pxToRem(22)}/>
          <rect x="0" y={pxToRem(1*36+4)} rx={pxToRem(8)} ry={pxToRem(8)} width="60%" height={pxToRem(22)}/>
          <rect x="0" y={pxToRem(2*36+4)} rx={pxToRem(8)} ry={pxToRem(8)} width="65%" height={pxToRem(22)}/>
        </ContentLoader>);
    default:
      return null;
  }
};

export default Skeleton;