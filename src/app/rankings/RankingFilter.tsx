import InputRadio from "../components/partials/InputRadio";
import InputCheckBox from "../components/partials/InputCheckbox";

interface RankingFilterProps {
  withOpen: boolean;
  updateWithOpen(newState: boolean): void;
  withSelective: boolean;
  updateWithSelective(newState: boolean): void;
  withCupRound: boolean;
  updateWithCupRound(newState: boolean): void;
  rankingType: string;
  updateRankingType(newState: string): void;
}

const RankingFilter = (props: RankingFilterProps) => {
  const {
    withOpen,
    updateWithOpen,
    withSelective,
    updateWithSelective,
    withCupRound,
    updateWithCupRound,
    rankingType,
    updateRankingType
  } = props;

  return (
    <div className="filter-container">
      <div>
        <legend>Classements par :</legend>
        <div className="radio-container">
          <InputRadio
            id="performance"
            name="type"
            value="performance"
            onChange={(e) => updateRankingType(e.target.value)}
            checked={rankingType === 'performance'}
            labelText="Performances"
            labelHtmlFor="performance"
          />
          <InputRadio
            id="competitor"
            name="type"
            value="competitor"
            onChange={(e) => updateRankingType(e.target.value)}
            checked={rankingType === 'competitor'}
            labelText="Competiteurs"
            labelHtmlFor="competitor"
          />
        </div>
      </div>
      <div>
        <legend>Type de compétitions :</legend>
        <div className="checkbox-container">
          <InputCheckBox
            id="with-selective"
            name="with-selective"
            checked={withSelective}
            readOnly={true}
            labelText="Sélective"
            labelOnClick={() => updateWithSelective(!withSelective)}
          />
          <InputCheckBox
            id="with-open"
            name="with-open"
            checked={withOpen}
            readOnly={true}
            labelText="Open"
            labelOnClick={() => updateWithOpen(!withOpen)}
          />
          <InputCheckBox
            id="with-cup-round"
            name="with-cup-round"
            checked={withCupRound}
            readOnly={true}
            labelText="Manches de coupe de France"
            labelOnClick={() => updateWithCupRound(!withCupRound)}
          />
        </div>
      </div>
    </div>
  )
}

export default RankingFilter;
