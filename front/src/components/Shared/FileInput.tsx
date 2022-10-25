import React from 'react';
import {MimeTypes} from '../../utils/MimeTypes';
import './FileInput.scss';
import {Input} from '../../utils/Form/Input';
import {InputValidator} from '../../utils/Form/InputValidator';
import {InputState} from './TextInput';
import APIFile from '../../models/api/apifile';
import {arrayEquals} from '../../utils/ArrayUtils';
import {FileService} from 'services/fileService';
import {useTranslation} from "react-i18next";
import { getI18n } from 'react-i18next';
import {ServiceRepository} from "../../services/serviceRepository";

export interface FileInputProps extends Input<Array<File | APIFile>> {
  placeholder: string,
  multiple: boolean,
  acceptedFileTypes: Array<MimeTypes>
}

export interface FileInputState extends InputState<Array<File | APIFile>> {
  filenamesPreview?: string | JSX.Element[];
  imagesPreview?: JSX.Element[];
}

export default class FileInput extends React.Component<FileInputProps, FileInputState> implements InputValidator<Array<File | APIFile>> {
  fileRef: HTMLInputElement | null = null;
  _isMounted: boolean = false;

  constructor(props: FileInputProps, state: FileInputState) {
    super(props, state);

    // TODO USELESS BELOW?
    this.state = {
      error: 0,
      value: props.defaultValue,
      filenamesPreview: this._computeFileNames(this.props.defaultValue),
      imagesPreview: this._computeImagePreviews(this.props.defaultValue)
    };
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidUpdate(prevProps: Readonly<FileInputProps>, prevState: Readonly<FileInputState>, snapshot?: any) {
    super.componentDidUpdate?.(prevProps, prevState, snapshot);

    if (!this._isMounted) return;

    if (this.props.defaultValue !== prevProps.defaultValue) {
      this.setState({
        value: this.props.defaultValue,
        filenamesPreview: this._computeFileNames(this.props.defaultValue),
        imagesPreview: this._computeImagePreviews(this.props.defaultValue)
      });
    }
  }

  checkValidity(): boolean {
    const isValid = this.props.validation?.(this.state.value) || !this.props.validation;

    if (!this._isMounted) {
      this.setState({
        error: isValid ? 0 : 422
      });
    }

    return isValid;
  }

  getValue(): Array<File | APIFile> | undefined {
    return this.state.value;
  }

  id(): string | undefined {
    if (arrayEquals(this.props.defaultValue, this.state.value)) return undefined;

    return this.props.id;
  }

  private _fileAlreadyListed = (file: File): boolean => {
    if (!this.state.value) return false;

    const foundFile = this.state.value.find(existingFile => {
      // TODO should add other test to differentiate files? (size)
      if(APIFile.isAnAPIFile(existingFile)) {
        return (existingFile as APIFile).originalname === file.name;
      } else {
        return (existingFile as File).name === file.name;
      }
    });

    return !!foundFile;
  };

  private _computeFileNames(files: Array<File | APIFile> | undefined) {
    if (!files) return undefined;
    if (files.length === 0) return undefined;

    let key = 0;
    return files.map(file => {
      const isApiFile = APIFile.isAnAPIFile(file);
      const fileName = isApiFile? (file as APIFile).originalname : (file as File).name;
      return <div key={key++} className={'file-input-row'}>
        <div className={`file-name${isApiFile?'':' unsaved'}`}>{fileName}</div>
        <div className={'remove-icon'} onClick={() => this._removeThisFile(file)}/>
        {/*<img className={'accessory-icon'} src={'/assets/img/icon_close.png'} alt={'accessory-icon'}*/}
        {/*  onClick={() => this._removeThisFile(file)}*/}
        {/*/>*/}
      </div>
    });
  }

  private _computeImagePreviews(files: Array<File | APIFile> | undefined) {
    const authSvc = ServiceRepository.getInstance().authSvc;
    if (!files) return undefined;
    if (files.length === 0) return undefined;

    let key = 0;
    return files.map(file => {
      const isApiFile = APIFile.isAnAPIFile(file);
      const mimeType = isApiFile ? (file as APIFile).mimetype : (file as File).type;

      if (!mimeType.startsWith('image/')) return <></>;

      const url = isApiFile ?
        FileService.getFileURL((file as APIFile).key, authSvc) :
        window.URL.createObjectURL(file as File);

      const name = isApiFile ?
        (file as APIFile).originalname :
        (file as File).name;

      return <div key={key++} className={'file-input-image-preview'}>
        <img alt={name} src={url} title={name}/>
        <div className={'remove-icon corner'} onClick={() => this._removeThisFile(file)}/>
      </div>;
    });
  }

  // private _clearInputsIfNecessary = () => {
  //   if (!this._isMounted) return;
  //
  //   if (!this.state.value || (this.state.value && this.state.value?.length > 0)) {
  //     this.setState({
  //       value: [],
  //       filenamesPreview: this._computeFileNames([])
  //     }, () => this.props.onChange?.(this.state.value));
  //   }
  // };

  private _removeThisFile = (removedFile: File | APIFile) => {
    if (!this._isMounted) return;

    if (!this.state.value || (this.state.value && this.state.value?.length > 0)) {
      // const newFileList: Array<File | APIFile> = [...this.state.value!]; // copy current FileList
      const newFileList: Array<File | APIFile> = this.state.value?.filter(listedFile => {
        const listedName = (APIFile.isAnAPIFile(listedFile) ? (listedFile as APIFile).originalname : (listedFile as File).name);
        const removedName = (APIFile.isAnAPIFile(removedFile) ? (removedFile as APIFile).originalname : (removedFile as File).name);
        return listedName !== removedName; // only keep different files in array
      }) || [];

      // set visible names
      this.setState({
        value: newFileList,
        filenamesPreview: this._computeFileNames(newFileList),
        imagesPreview: this._computeImagePreviews(newFileList)
      }, () => this.props.onChange?.(this.state.value));

      // modify Input FileList
      let fileList = new DataTransfer();
      newFileList.filter(file => !APIFile.isAnAPIFile(file)) // only keep File (APIFiles are already uploaded)
        .forEach(file => fileList.items.add(file as File));
      if (this.fileRef)
        this.fileRef.files = fileList.files;

      console.log(this.fileRef?.files);
    }
  };

  private _triggerInputIfNecessary = () => {
    const files = this.state.value || [];

    //trigger file input only if no file selected or if multiple=true
    if (files.length === 0 || this.props.multiple) {
      this.fileRef?.click();
    }
  };

  render() {
    const files = this.state.value || [];
    const {filenamesPreview, imagesPreview} = this.state;
    const {placeholder, acceptedFileTypes, multiple, readonly} = this.props;
    const addFiles = (files.length === 0 || multiple) ?
      <div className={'file-input-row add'} onClick={this._triggerInputIfNecessary}>
        <p className={'placeholder'}>{getI18n().t(placeholder)}</p>
        <img className={'accessory-icon'} src={`/assets/img/icon_add.png`} alt={'accessory-icon'}/>
      </div> :
      undefined;

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
      if (!this._isMounted) return;

      if (e.target.files) {
        const newFileList: Array<File | APIFile> = [...files]; // copy current FileList

        console.log('previous FileList', this.state.value, 'new FileList', e.target.files); // TODO REMOVE DEBUG

        for (let i = 0; i < e.target.files.length; i++) {
          const file = e.target.files.item(i);
          if (!file) continue;

          console.log(file.type); // TODO REMOVE DEBUG
          if (!acceptedFileTypes.includes(file.type as MimeTypes)) {
            const allowedExtensions = acceptedFileTypes.map(item => item.substring(item.indexOf('/') + 1)).join(', ');
            return alert(`Only ${allowedExtensions} are accepted.`);
          }

          // add new selected files to FileList only if not already selected (previous click)
          if (!this._fileAlreadyListed(file)) {
            newFileList.push(file);
            console.log('file added to list', file, newFileList);
            // new file
          } else {
            console.log('file already in list', file);
          }

          this.setState({
            value: newFileList, //Array.from(e.target.files),
            filenamesPreview: this._computeFileNames(newFileList /*Array.from(e.target.files)*/),
            imagesPreview: this._computeImagePreviews(newFileList)
          }, () => {
            this.props.onChange?.(this.state.value);
          });
        }
      }
    };

    // if (defaultValue && defaultValue.length > 0) {
    //   if (defaultValue.some(value => value instanceof APIFile)) {
    //     console.log('api file');
    //   } else {
    //     console.log('form file');
    //   }
    // }

    return <>
      <div className={'file-input'}>
        <>
          {filenamesPreview}
          {addFiles} {/* only shown if available (empty list, or multiple=true) */}
        </>
      </div>
      <div className={'file-input-image-preview-container'}>
        {imagesPreview}
      </div>
      <input type="file" multiple={multiple}
        readOnly={readonly}
        ref={instance => this.fileRef = instance} onChange={handleChange} hidden/>
    </>;
  }
}