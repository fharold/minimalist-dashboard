export const arrayEquals = (a: unknown, b: unknown): boolean => {
  return Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index]);
};

export const arrayItemEquals = (a: unknown, b: unknown): boolean => {
  return Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every(value => b.includes(value)) && // b contains all a values
    b.every(value => a.includes(value)); // but also a contains all b values
};

export function objectAsMap<T>(obj: any): Map<string, T> {
  if (obj instanceof Map) return obj;
  const safeMap = new Map<string, T>();
  Object.keys(obj).forEach(key => {
    safeMap.set(key, obj[key]);
  });
  return safeMap;
}