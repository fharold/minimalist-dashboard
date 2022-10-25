export interface InputValidator<T> {
  checkValidity: () => boolean;
  getValue: () => T | undefined;
  id: () => string | undefined;
}