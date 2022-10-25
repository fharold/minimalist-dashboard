import equipment from "../webgl/components/Configuration/Equipment";

export namespace Annotation {
  export enum Style {
    defaultExpandable = 'defaultExpandable',
    blueHover = 'blueHover', // TODO CARSAT
    orangeHover = 'orangeHover', // TODO CARSAT
    dangerAlwaysOpened = 'dangerAlwaysOpened', // TODO CARSAT
    dangerClick = 'dangerClick', // TODO CARSAT
    orangeFixed = 'orangeFixed' // TODO CARSAT
  }

  export class DTO {
    constructor(id: string, key: string, title: string, description: string, marker: string, style: string, createdAt: number, equipment: string) {
      this.id = id;
      this.key = key;
      this.title = title;
      this.description = description;
      this.marker = marker;
      this.style = style;
      this.createdAt = createdAt;
      this.equipment = equipment;
    }

    id: string;
    key: string;
    title: string;
    description: string;
    marker: string;
    style: string;
    createdAt: number;
    equipment: string;
  }
}
