export namespace URLs {
  export namespace API {
    export const LOGIN = "/auth/login";
    export const REFRESH = "/auth/refresh";
    export const RESET_PASSWORD = "/auth/password/reset";
    export const LOGOUT = "/auth/logout";

    export const USERS = "/users";
    export const USER = "/users/:userId";
    export const USER_PASSWORD = "/users/:userId/password";
    export const SEND_ACCESS_USER = "/users/:userId/access";
    export const GET_CURRENT_USER_PROFILE = "/users/me";
    export const GET_COMPANIES = "/users/companies";

    export const LANGUAGES = "/languages";
    export const LANGUAGE = "/languages/:languageCode";
    export const LANGUAGE_ATTACH_FILE = "/languages/:languageCode/:fileType";

    export const ANNOTATIONS = "/annotations";
    export const ANNOTATION = "/annotations/:annotationId"; // TODO rename to configuration (singular)?

    export const CONFIGURATIONS = "/configurations";
    export const CONFIGURATION = "/configurations/:configurationId"; // TODO rename to configuration (singular)?
    export const CONFIGURATION_DATASHEET = "/configurations/:configurationId/datasheet"; // TODO rename to configuration (singular)?
    export const CONFIGURATION_ATTACH_FILE = "/configurations/:configurationCode/:fileType";
    export const CONFIGURATION_CLONE = "/configurations/clone"; // TODO rename to configuration (singular)?


    export const TRANSLATIONS = "/translations";
    export const TRANSLATION_DL = "/translations";
    export const TRANSLATION = "/translations/:key";
    export const TRANSLATION_INTERFACE = "/translations/interface";

    export const EQUIPMENTS = "/equipments";
    export const EQUIPMENTS_FOR_ROOM = "/equipments/room/:name";
    export const EQUIPMENT = "/equipments/:id";
    export const EQUIPMENT_ATTACH_FILE = "/equipments/:id/:fileType";
    export const EQUIPMENT_DELETE_FILE = "/equipments/:id/:fileType/:key";
    export const EQUIPMENT_ATTACH_LOCALIZED_FILE = "/equipments/:id/:fileType/:lang";
    export const EQUIPMENT_DELETE_LOCALIZED_FILE = "/equipments/:id/:fileType/:key/:lang";

  }

  export namespace Front {
    export const LOGIN = "/login"
    export const ROOT = "/"
    export const RESET_PASSWORD = "/password/reset/:token"
  }
}
