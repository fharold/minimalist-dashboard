import React, {useEffect, useState} from 'react';
import {configurationStore, fixedAnnotationStore, FSMStore, outlineStore} from 'webgl/stores';
import {useAnnotationActiveState} from 'webgl/hooks';
import {AnnotationStyles} from 'webgl/types/AnnotationStyles';

import AnnotationBase from 'webgl/components/Annotations/AnnotationBase';
import AnnotationBlueHover from 'webgl/components/Annotations/AnnotationBlueHover';
import AnnotationOrangeHover from 'webgl/components/Annotations/AnnotationOrangeHover';
import AnnotationDangerAlwaysOpened from 'webgl/components/Annotations/AnnotationDangerAlwaysOpened';
import AnnotationOrangeFixed from 'webgl/components/Annotations/AnnotationOrangeFixed';

const Annotations: React.FC = () => {
  const allAnnotationObjects = configurationStore(state => state.sortedObjects['annotation']);
  const setFixedAnnotationObjects = fixedAnnotationStore(state => state.setFixedAnnotationObjects);
  const annotationObjects = useAnnotationActiveState(allAnnotationObjects); // TODO cause rerender because [] !== [] by ref
  const expandedUuidStateArray = useState<string>(''); // single source of truth for active Annotation...
  const [, setExpandedState] = expandedUuidStateArray; // keep both array and setter

  // Reset selected annotation on FSMState change
  const currentFSMState = FSMStore(state => state.currentFSMState);
  useEffect(() => {
    setExpandedState('');
    outlineStore.setState({selectedObjects: []});
  }, [currentFSMState, setExpandedState]);

  // Setting Fixed Annotation object list (store)
  useEffect(() => {
    setFixedAnnotationObjects(annotationObjects.filter(annotation => annotation.userData.tags?.annotationStyle === AnnotationStyles.orangeFixed));
    return () => setFixedAnnotationObjects([]); // empty annotation object list when unmounting this component
  }, [annotationObjects, setFixedAnnotationObjects]);

  return (
    <group name={'Annotations Group'}>
      {annotationObjects?.map(annotation => {
        switch (annotation.userData.tags?.annotationStyle) {

          case AnnotationStyles.blueHover:
            return <AnnotationBlueHover key={annotation.uuid} object={annotation}/>;
          case AnnotationStyles.orangeHover:
            return <AnnotationOrangeHover key={annotation.uuid} object={annotation}/>;
          case AnnotationStyles.orangeFixed:
            return <AnnotationOrangeFixed key={annotation.uuid} object={annotation}/>; /*TODO*/
          case AnnotationStyles.dangerClick: /*TODO NOT USED*/
          case AnnotationStyles.dangerAlwaysOpened:
            return <AnnotationDangerAlwaysOpened key={annotation.uuid} object={annotation}/>;
          case AnnotationStyles.defaultExpandable:
          default :
            return <AnnotationBase key={annotation.uuid} object={annotation}
              expandedUuidStateArray={expandedUuidStateArray}/>;
        }
      })}
    </group>
  );
};

export default Annotations;
