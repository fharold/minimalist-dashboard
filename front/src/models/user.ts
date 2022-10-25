import Entity from "./pagination/Entity";

export namespace User {
  export enum Role {
    ANONYMOUS = "ANONYMOUS",
    STANDARD = "STANDARD",//AKA CUSTOMERS
    SALES_REP = "SALES_REP",
    CEVA_ADMIN = "CEVA_ADMIN",
    SUPER_ADMIN = "SUPER_ADMIN"
  }

  export interface Profile {
    phone: string
  }

  export interface CustomerProfile extends Profile {
    company: string
    hatchery: string
    addressLine1: string
    addressLine2?: string
    zipCode: string
    city: string
    country: string
  }

  export interface SalesProfile extends Profile {
  }

  export enum Status {
    DISABLED = "DISABLED",
    ENABLED = "ENABLED"
  }

  export class DTO implements Entity {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    referentUserId?: string;
    preferredLanguage: string;
    shouldUpdatePassword: boolean;
    createdAt: number;
    createdBy?: string;
    role: Role;
    status: Status;
    profile?: Profile;
    lastLogin?: number;
    expireAt: number;

    constructor(id: string,
                firstName: string, lastName: string, email: string,
                referentUserId: string, preferredLanguage: string,
                shouldUpdatePassword: boolean, createdAt: number,
                profile: Profile | undefined,
                createdBy: string, role: User.Role, status: User.Status,
                expireAt: number, lastLogin: number) {
      this.id = id;
      this.firstName = firstName;
      this.lastName = lastName;
      this.email = email;
      this.referentUserId = referentUserId;
      this.preferredLanguage = preferredLanguage;
      this.shouldUpdatePassword = shouldUpdatePassword;
      this.createdAt = createdAt;
      this.createdBy = createdBy;
      this.profile = profile;
      this.role = role;
      this.status = status;
      this.expireAt = expireAt;
      this.lastLogin = lastLogin;
    }
  }

  export function prettyName(user?: User.DTO): string {
    if (!user) return "";
    return user.firstName + " " + user.lastName;
  }
}