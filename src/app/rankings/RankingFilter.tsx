
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
    <div>
      <fieldset>
        <legend></legend>
        <div>
          <input
            type="radio"
            id="performance"
            name="type"
            value="performance"
            onChange={(e) => updateRankingType(e.target.value)}
            checked={rankingType === 'performance'}
          />
          <label htmlFor="performance">Performances</label>
        </div>
        <div>
          <input
            type="radio"
            id="competitor"
            name="type"
            value="competitor"
            onChange={(e) => updateRankingType(e.target.value)}
            checked={rankingType === 'competitor'}
          />
        <label htmlFor="competitor">Competiteurs</label>
        </div>
      </fieldset>
      <fieldset>
      <legend></legend>
        <div>
          <input
            type="checkbox"
            id="wwith-selective"
            name="with-selective"
            checked={withSelective}
            onChange={() => updateWithSelective(!withSelective)}
          />
          <span>Sélective</span>
        </div>
        <div>
          <input
            type="checkbox"
            id="with-open"
            name="with-open"
            checked={withOpen}
            onChange={() => updateWithOpen(!withOpen)}
          />
          <span>Open</span>
        </div>
        <div>
          <input
            type="checkbox"
            id="with-cup-round"
            name="with-cup-round"
            checked={withCupRound}
            onChange={() => updateWithCupRound(!withCupRound)}
          />
          <span>Manches de coupe de France</span>
        </div>
      </fieldset>
    </div>
  )
}

export default RankingFilter;
