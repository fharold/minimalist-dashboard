export class Annotation {
    id: string;
    key: string;
    title: string;
    description: string;
    marker: string;
    equipment: string;
    style: string;
    createdAt: number;

    constructor(id: string, key: string, title: string, createdAt: number, description: string, style: string, marker: string, equipment: string) {
        this.id = id;
        this.key = key;
        this.marker = marker;
        this.style = style;
        this.title = title;
        this.description = description;
        this.createdAt = createdAt;
        this.equipment = equipment;
    }
}