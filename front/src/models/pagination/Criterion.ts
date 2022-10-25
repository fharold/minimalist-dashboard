export class Criterion<T> {
    constructor(relatedFilterKey: string, translationKey: string, value: T) {
        this.relatedFilterKey = relatedFilterKey;
        this.value = value;
        this.translationKey = translationKey;
    }

    relatedFilterKey: string;
    value: T
    translationKey: string
}