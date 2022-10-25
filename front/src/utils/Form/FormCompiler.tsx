import {InputValidator} from "./InputValidator";

export class FormCompiler {
  private _inputs: Array<InputValidator<any>> = [];

  public register = (input: InputValidator<any>) => {
    this._inputs.push(input);
  }

  public checkFormValidity = (): boolean => {
    for (let input of this._inputs) {
      if (!input.checkValidity())
        return false;
    }

    return true;
  }

  public compile<DTO>(ids: string[]): DTO {
    const object: any = {};

    for (let input of this._inputs) {
      const value = input.getValue();
      const id = input.id();

      if (id === undefined) continue;

      const isValid = input.checkValidity()

      if (ids.includes(id)) {
        //hack to get it sending "false" instead of undefined.
        object[id] = isValid && !value ? false : value;
      }
    }

    return object as DTO;
  }

  public compileSpecificInput<T>(id: string): T | undefined {
    for (let input of this._inputs) {
      const value = input.getValue();

      console.log("id: ", id, " input.id():", input.id())
      if (input.id() === id) {
        return value;
      }
    }

    return undefined;
  }
}