import APIFile from './api/apifile';

export namespace Equipment {
  export enum FileType {
    PICTURE = 'PICTURE',
    DATASHEET = 'DATASHEET',
    MODEL = 'MODEL',
    ILLUSTRATION = 'ILLUSTRATION'
  }

  export class DTO {
    id: string;
    key: string;
    name: string;
    description: string;
    specs: string;
    createdAt: number;
    datasheets: Map<string, APIFile>;
    illustration?: APIFile;
    model?: APIFile;
    pictures: Map<string, Array<APIFile>>;
    videos: Map<string, string>;

    constructor(id: string, key: string, name: string, description: string, specs: string, createdAt: number, datasheets: Map<string, APIFile>, illustration: APIFile, model: APIFile, pictures: Map<string, Array<APIFile>>, videos: Map<string, string>) {
      this.id = id;
      this.key = key;
      this.name = name;
      this.createdAt = createdAt;
      this.description = description;
      this.specs = specs;
      this.datasheets = datasheets;
      this.illustration = illustration;
      this.model = model;
      this.pictures = pictures;
      this.videos = videos;
    }
  }
}
