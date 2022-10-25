import React, {useEffect} from 'react';
import {sizeClassStore} from 'stores';
import {fixedAnnotationStore} from 'webgl/stores';
import {getAnnotationDescriptions__FAKE} from 'services/getAnnotationDescriptions__FAKE'; // TODO REMOVE

import './AnnotationBase.scss';
import './AnnotationOrangeFixed.scss';
import {OrangeFixedCircle} from 'webgl/components/Annotations/AnnotationOrangeFixed';

const AnnotationOrangeFixedDescriptions: React.FC = () => {
  const sizeClass = sizeClassStore(state => state.sizeClass);
  const fixedAnnotationObjects = fixedAnnotationStore(state => state.fixedAnnotationObjects);
  const setFixedAnnotationDescriptions = fixedAnnotationStore(state => state.setFixedAnnotationDescriptions);
  const fixedAnnotationDescriptions = fixedAnnotationStore(state => state.fixedAnnotationDescriptions);

  useEffect(() => {
    setFixedAnnotationDescriptions([]); // reset list when objects change before waiting for backend response

    getAnnotationDescriptions__FAKE(fixedAnnotationObjects) // TODO Retrieve Annotations' description from backend
      .then(res => setFixedAnnotationDescriptions(res));
  }, [fixedAnnotationObjects, setFixedAnnotationDescriptions]);

  return (
    <div className={`fixedAnnotationsContainer ${sizeClass}`}>
      {fixedAnnotationDescriptions.map(({key, description}) =>
        <div key={key} className={`annotation orangeFixed ${sizeClass}`}>
          <OrangeFixedCircle markerChar={'a'} animated={false} opaque={true}/>
          <div className={`description ${sizeClass}`}>{description}</div>
        </div>
      )}
    </div>
  );
};

export default AnnotationOrangeFixedDescriptions;
