import React from 'react';
import ListAdapter, {AdapterListener} from '../components/Shared/List/ListAdapter';
import {Column} from 'components/Shared/List/Column';
import {Annotation} from "../models/annotation";
import AnnotationProvider from "./AnnotationProvider";
import {APIPagination} from "../models/pagination/APIPagination";
import {TFunction} from "i18next";

export interface AnnotationAdapterListener extends AdapterListener<Annotation.DTO> {
  onRemoveClick: (annotation: Annotation.DTO) => void;
  onEditClick: (annotation: Annotation.DTO) => void;
}

export default class AnnotationAdapter extends ListAdapter<Annotation.DTO, AnnotationAdapterListener, APIPagination> {

  /**
   * constructor
   * @param t
   * @param annotationsProvider
   * @param listener
   * @param displayActions
   */
  constructor(t: TFunction, annotationsProvider: AnnotationProvider, listener?: AnnotationAdapterListener, displayActions = true) {
    super(t);

    this.addColumn(new Column('Annotation title', 'title', this._title));
    if (displayActions) this.addColumn(new Column('', 'actions', this._actions));

    this.init(
      'annotationListEmpty',
      annotationsProvider,
      [],
      listener
    );
  }

  /**
   * _enabled
   * @returns {any}
   * @private
   * @param annotation
   */
  private _title = (annotation: Annotation.DTO): JSX.Element => {
    return <p className={'blue-hover'}>{annotation.title}</p>;
  };

  /**
   * _actions
   * @returns {any}
   * @private
   * @param annotation
   */
  private _actions = (annotation: Annotation.DTO): JSX.Element => {
    return <p>
      <span
        onClick={(e) => {
          e.stopPropagation();
          this._listener?.onEditClick(annotation);
        }}
        className={'button secondary'}>
        edit
      </span>
      <span> </span>
      <span
        onClick={(e) => {
          e.stopPropagation();
          this._listener?.onRemoveClick(annotation);
        }}
        className={'button secondary'}>
        remove
      </span>
    </p>;
  };
}