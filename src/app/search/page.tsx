"use client"

import { useState, useEffect } from "react";

// Utils
import { buildQueryRangeSearchParams } from "../../../lib/database/dbutils";
import { scanRangeCommand } from "../../../lib/database/dbCommands";

// Components
import InputText from "../components/partials/InputText";

// Types
import { GenericStringIndex } from "@/app/type/generic";

const Search = () => {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState<GenericStringIndex[]>([]);
  const [suggestions, setSuggestions] = useState<GenericStringIndex[]>([]);

  const highlightWord = (text: string) => {
    const regex = new RegExp(`(${search})`, 'ig');
    const parts = text.split(regex);
    return parts.map((part, index) =>
      regex.test(part) ? <span className="search-suggestion-highlight" key={index}>{part}</span> : part
    );
  };

  useEffect(() => {
    const getData = async () => {

      let lastEvaluatedKey: object | undefined = undefined;
      let resultItems: GenericStringIndex[] = [];

      do {
        const params = buildQueryRangeSearchParams(search, lastEvaluatedKey);
        const result = await scanRangeCommand(params);
        resultItems = resultItems.concat(result.Items as GenericStringIndex[]);
        lastEvaluatedKey = result.LastEvaluatedKey;
      } while (lastEvaluatedKey !== undefined);

      setSearchResult(resultItems || []);
    }

    if (search.length > 2) {
      getData();
    } else {
      setSearchResult([]);
    }
  }, [search]);

  useEffect(() => {
    if (!searchResult.length) {
      setSuggestions([]);
    }

    const buildCharacterList: GenericStringIndex[] = [];
    searchResult.forEach((item) => {
      const duplicate = buildCharacterList.find((char) => char.firsName === item.fistName && char.lastName === item.lastName);
      if (!duplicate) {
        buildCharacterList.push({firstName: item.firstName, lastName: item.lastName});
      }
    });
    setSuggestions(buildCharacterList);
  }, [searchResult])

  return (
    <div className="page page-search">
      <h2 className="page page-title">Recherche</h2>
      <div className="search-container">
        <InputText
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          placeholder="Rechercher par nom ou prénom"
          value={search}
          icon='search'
        />
        {Boolean(suggestions.length) &&
          <div className="search-suggestion">
            {suggestions.map((sug, i) => <p className="search-suggestion-item" key={i}>{highlightWord(sug.firstName as string)} {highlightWord(sug.lastName as string)}</p>)}
          </div>
        }
      </div>
    </div>  
  )
}

export default Search;
