import APIFile from "./api/apifile";

export namespace Language {
  export class DTO {
    code: string;
    name: string;
    visible: boolean;
    icon?: APIFile;
    csv?: APIFile;

    constructor(code: string, name: string, visible: boolean, csv?: APIFile, icon?: APIFile) {
      this.code = code;
      this.name = name;
      this.visible = visible;
      this.icon = icon;
      this.csv = csv;
    }
  }
}