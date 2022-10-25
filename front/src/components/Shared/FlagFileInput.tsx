import React from "react";
import {MimeTypes} from "../../utils/MimeTypes";
import "./FileInput.scss"
import {Input} from "../../utils/Form/Input";
import {InputValidator} from "../../utils/Form/InputValidator";
import {InputState} from "./TextInput";
import APIFile from "../../models/api/apifile";
import {FileService} from "../../services/fileService";
import {ServiceRepository} from "../../services/serviceRepository";

export interface FileInputProps extends Input<File | APIFile> {
  placeholder: string,
  multiple: boolean,
  acceptedFileTypes: Array<MimeTypes>
}

export interface FlagFileInputState extends InputState<File | APIFile> {
  iconPreviewSrc: string | undefined;
}

export default class FlagFileInput extends React.Component<FileInputProps, FlagFileInputState> implements InputValidator<File | APIFile> {
  fileRef: HTMLInputElement | null = null;

  constructor(props: FileInputProps, state: FlagFileInputState) {
    super(props, state);

    this.state = {
      error: 0,
      value: props.defaultValue,
      iconPreviewSrc: undefined
    }
  }


  componentDidUpdate(prevProps: Readonly<FileInputProps>, prevState: Readonly<FlagFileInputState>, snapshot?: any) {
    super.componentDidUpdate?.(prevProps, prevState, snapshot);

    if (this.props.defaultValue !== prevProps.defaultValue) {
      this.setState({value: this.props.defaultValue});
    }
  }

  render() {
    const {acceptedFileTypes, multiple, readonly} = this.props;
    const {value, iconPreviewSrc} = this.state;
    const authSvc = ServiceRepository.getInstance().authSvc;

    const handleChange = (e: any) => {
      if (e.target.files) {
        for (let file of e.target.files) {
          console.log(file.type)
          if (!acceptedFileTypes.includes(file.type)) {
            const allowedExtensions = acceptedFileTypes.map(item => item.substring(item.indexOf("/") + 1)).join(", ");
            return alert(`Only ${allowedExtensions} are accepted.`);
          }
        }

        const fileAsArray = Array.from(e.target.files) as Array<File>;
        if (fileAsArray.length > 0) {
          let reader = new FileReader();
          reader.addEventListener("load",
            ev => {
              this.setState({
                value: fileAsArray[0],
                iconPreviewSrc: ev.target?.result?.toString()
              })
            })
          reader.readAsDataURL(fileAsArray[0]);
        }
      }
    };

    let file = value;
    let isAnAPIFile = APIFile.isAnAPIFile(file);

    return <>
      {/*{this.state.error && this.state.error !== 0 && <p>{this.state.error}</p>}*/}
      {!file &&
        <>
          <div className={"language-icon-add"} onClick={() => this.fileRef?.click()}>
            <img className={"add"} src={"/assets/img/icon_add.png"} alt={"plus_icon"}/>
            <img className={"flag"} src={"/assets/img/ukflag.png"} alt={"ukflag_icon"}/>
          </div>
          <input type="file" readOnly={readonly} multiple ref={instance => this.fileRef = instance}
                 onChange={handleChange} hidden/></>
      }
      {!!file && !isAnAPIFile &&
        <div className={"language-icon-add"} onClick={() => this.setState({value: undefined})}>
          <img className={"delete"} src={"/assets/img/icon_close.png"} alt={"cross_icon"}/>
          <img className={"flag"} src={iconPreviewSrc} alt={"ukflag_icon"}/>
        </div>
      }
      {!!file && isAnAPIFile &&
        <div className={"language-icon-add"} onClick={() => this.setState({value: undefined})}>
          <img className={"delete"} src={"/assets/img/icon_close.png"} alt={"cross_icon"}/>
          <img className={"flag"} src={FileService.getFileURL((file as APIFile).key, authSvc)} alt={"flag"}/>
        </div>
      }

      <input type="file" readOnly={readonly} multiple={multiple} ref={instance => this.fileRef = instance}
             onChange={handleChange} hidden/>
    </>;
  }

  checkValidity(): boolean {
    const isValid = this.props.validation?.(this.state.value) || !this.props.validation;

    this.setState({
      error: isValid ? 0 : 422
    })

    return isValid;
  }

  getValue(): File | APIFile | undefined {
    return this.state.value;
  }

  id(): string | undefined {
    if (this.props.defaultValue === this.state.value) return undefined;

    return this.props.id;
  }
}