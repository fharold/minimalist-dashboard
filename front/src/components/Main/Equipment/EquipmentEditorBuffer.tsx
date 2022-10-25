import {Translation} from 'models/translation';
import {Language} from 'models/language';

export class EquipmentEditorBuffer {
  public title: Translation.DTO | undefined = undefined;
  public description: Translation.DTO | undefined = undefined;
  public specs: Translation.DTO | undefined = undefined;
  public languages: Array<Language.DTO> | undefined = undefined;
}