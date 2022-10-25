//region DTO
export default class APIFile {
  size: number;
  key: string;
  originalname: string;
  mimetype: string;
  createdAt: number;

  constructor(size: number, key: string, originalname: string, mimetype: string, createdAt: number) {
    this.size = size;
    this.key = key;
    this.originalname = originalname;
    this.mimetype = mimetype;
    this.createdAt = createdAt;
  }

  static isAnAPIFile(obj: any): boolean {
    if (!obj) return false;

    let apiFilePropNames = ['_id', 'size', 'key', 'originalname', 'mimetype', 'createdAt'];
    let fileToCheckPropNames = Object.getOwnPropertyNames(obj);

    for (let value of apiFilePropNames) {
      if (!fileToCheckPropNames.includes(value)) {
        return false;
      }
    }

    return true;
  }

  static equals(compare: APIFile, to: APIFile | File) {
    if (APIFile.isAnAPIFile(compare) && APIFile.isAnAPIFile(to)) {
      return (
        compare.key === (to as APIFile).key &&
        compare.originalname === (to as APIFile).originalname &&
        compare.size === (to as APIFile).size &&
        compare.mimetype === (to as APIFile).mimetype &&
        compare.createdAt === (to as APIFile).createdAt
      );
    } else { // File
      return (
        compare.size === (to as File).size &&
        compare.originalname === (to as File).name &&
        compare.mimetype === (to as File).type
      );
    }
  };
}