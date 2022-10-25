import React from "react";
import Entity from "../../../models/pagination/Entity";
import {APIPagination} from "../../../models/pagination/APIPagination";
import {PaginationController} from "../../../models/pagination/PaginationController";
import ButtonProps from "../Button/ButtonProps";
import PaginationComponent from "./PaginationComponent";

export interface ToolbarConfig<P extends APIPagination> {
    paginationController?: PaginationController<P>;
    onAddClick?: () => void;
    accessoryButton?: ButtonProps;
}

interface State {
    searchEnabled: boolean;
}

export default class ListToolbar<E extends Entity, P extends APIPagination> extends React.Component<ToolbarConfig<P>, State> {
    constructor(config: ToolbarConfig<P>, state: State) {
        super(config, state);

        this.state = {
            searchEnabled: false
        }
    }

    /**
     * _pagination
     * @param props
     * @returns {any}
     * @private
     */
    private _pagination = (props: { pagination?: APIPagination }): any => {
        const {paginationController} = this.props;

        if (!paginationController) {
            return <></>;
        }

        const {pagination} = paginationController;

        return <PaginationComponent
            paginationController={paginationController}
            key={pagination?.page}
        />
    };

    /**
     * render
     * @returns {any}
     */
    public render(): React.ReactNode {
        const {paginationController, accessoryButton} = this.props;

        return <div className={"toolbar"}>
            <div className={"group"}>
                {this.props.onAddClick && <img src={"/img/add.png"} alt={"add"} onClick={this.props.onAddClick}/>}
                <this._pagination pagination={paginationController?.pagination}/>
            </div>
            {/*<div className={"group"}>*/}
            {/*    {accessoryButton && <Button color={accessoryButton.color}*/}
            {/*                                labelAccessor={accessoryButton.labelAccessor}*/}
            {/*                                disabled={accessoryButton.disabled}*/}
            {/*                                onClick={accessoryButton.onClick}*/}
            {/*                                loading={accessoryButton.loading}*/}
            {/*                                key={accessoryButton.key}*/}
            {/*                                outline={accessoryButton.outline}*/}
            {/*                                icon={accessoryButton.icon}*/}
            {/*                                fullwidth={accessoryButton.fullwidth}/>}*/}
            {/*</div>*/}
        </div>
    }
}