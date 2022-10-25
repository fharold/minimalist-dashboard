import {AdapterListener} from "./ListAdapter";
import Entity from "../../../models/pagination/Entity";

export default class ListController<E extends Entity, L extends AdapterListener<E>> {
    constructor( listener?: AdapterListener<E>) {
    }
}