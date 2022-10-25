const regexPassword = /^(?=.*[A-Z])(?=.*[\W])(?=.*[0-9])(?=.*[a-z]).{8,32}$/;

export function isPasswordStrongEnough(password: string): boolean {
  return !!password.match(regexPassword);
}