export interface ConfigurationDTO {
  key: string
  name: string
  room: string

  equipmentKeys: string[],
  crateKey: string,
  crateContentKey: string,

  dateCreated: number,
  pdf: string
}