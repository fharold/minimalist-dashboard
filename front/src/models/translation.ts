import {objectAsMap} from "../utils/ArrayUtils";

export namespace Translation {
  export enum FieldType {
    PLAIN = "PLAIN",
    HTML = "HTML"
  }

  export class DTO {
    id: string;
    key: string;
    type: FieldType;
    values: Map<string, string>;

    constructor(id: string, key: string, type: FieldType, values: Map<string, string>) {
      this.id = id;
      this.key = key;
      this.type = type;
      this.values = values;
    }
  }

  export class Utils {
    static setNewValue(dto: DTO, lang: string, value: string): DTO {
      let map: Map<string, string> = objectAsMap(dto.values) || undefined;
      if (!map) return dto;

      map.set(lang, value);
      dto.values = map;
      return dto;
    }

    static getValue(dto: DTO, lang: string): string | undefined {
      const values: Map<string, string> = objectAsMap(dto.values);

      return values.get(lang) || undefined;
    }
  }
}