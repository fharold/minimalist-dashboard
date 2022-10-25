import {Dispatch, SetStateAction, useCallback, useEffect, useState} from 'react';
import {Object3D} from 'three';

export const useAnnotationHandleExpand = (object: Object3D, expandedUuidStateArray: [string, Dispatch<SetStateAction<string>>], description: string): [boolean, () => boolean] => {
  const [expandedUuid, setExpandedUuid] = expandedUuidStateArray;
  const [isExpanded, setIsExpandedState] = useState<boolean>(false);

  // expand description when own uuid is set in parent component
  useEffect(() => {
    setIsExpandedState(expandedUuid === object.uuid && !!description);
  }, [object.uuid, expandedUuid, description]);

  // send current uuid (or empty string if already expanded) to parent component
  const handleExpand = useCallback((): boolean => {
    let doExpand = false;
    // EXPAND
    setExpandedUuid(previouslyExpandedUuid => {
      const {uuid} = object;
      doExpand = previouslyExpandedUuid !== uuid;
      return doExpand ? uuid : '';
    });
    return doExpand;
  }, [object, setExpandedUuid]);

  return [isExpanded, handleExpand];
};