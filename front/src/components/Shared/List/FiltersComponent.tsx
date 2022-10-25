import React from "react";
import {Criterion} from "../../../models/pagination/Criterion";
import Spinner from "../Spinner";

interface State {
    loading: boolean
    selectedCriterion?: Criterion<any>
}

interface Props {
    criteria: Criterion<any>[];
    onCriterionApplied: (criterion: Criterion<any>) => void;
}

export default class FiltersComponent extends React.Component<Props, State> {
    /**
     * constructor
     * @param props
     * @param state
     */
    public constructor(props: Props, state: State) {
        super(props, state);

        this.state = {
            selectedCriterion: props.criteria.length > 0 ? props.criteria[0] : undefined,
            loading: false
        }
    }

    /**
     * handleCheckboxClick
     * @param criterion
     * @return {Promise<void>}
     */
    public selectFilter = async (criterion: Criterion<any>) => {
        this.props.onCriterionApplied(criterion);
        await this.setState({selectedCriterion: criterion});
    };

    /**
     * render
     */
    public render() {
        const {loading, selectedCriterion} = this.state;
        const {criteria} = this.props;

        if (criteria.length === 0) return <></>;

        return <form className="menu-block filter-form">
            <p className="menu-label">searchFilterTitle</p>
            {loading && <Spinner/>}
            {criteria.map((criterion) => {
                const isActive = selectedCriterion?.translationKey === criterion.translationKey;
                // @ts-ignore
                const criterionValue = criterion.translationKey;

                return <p className={`menu-list-item ${isActive ? "selected" : "not-selected"}`}
                          key={criterion.translationKey}
                          onClick={() => this.selectFilter(criterion)}>
                    {criterionValue}
                </p>
            })}
        </form>
    }
}