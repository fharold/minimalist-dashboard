export enum Order {
    ASC = "asc",
    DESC = "desc"
}

export default class Sort {
    public order: Order;
    public by: string;

    constructor(order: Order, by: string) {
        this.order = order;
        this.by = by;
    }
}