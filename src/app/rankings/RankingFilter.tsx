
interface RankingFilterProps {
  withOpen: Boolean;
  setWithOpen: Function;
  withSelective: Boolean;
  setWithSelective: Function;
  withCupRound: Boolean;
  setWithCupRound: Function;
  rankingType: String;
  setRankingType: Function;
}

const RankingFilter = (props: RankingFilterProps) => {
  const {
    withOpen,
    setWithOpen,
    withSelective,
    setWithSelective,
    withCupRound,
    setWithCupRound,
    rankingType,
    setRankingType
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
            onChange={(e) => setRankingType(e.target.value)}
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
            onChange={(e) => setRankingType(e.target.value)}
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
            onChange={() => setWithSelective(!withSelective)}
          />
          <span>Sélective</span>
        </div>
        <div>
          <input
            type="checkbox"
            id="with-open"
            name="with-open"
            checked={withOpen}
            onChange={() => setWithOpen(!withOpen)}
          />
          <span>Open</span>
        </div>
        <div>
          <input
            type="checkbox"
            id="with-cup-round"
            name="with-cup-round"
            checked={withCupRound}
            onChange={() => setWithCupRound(!withCupRound)}
          />
          <span>Manches de coupe de France</span>
        </div>
      </fieldset>
    </div>
  )
}

export default RankingFilter;
