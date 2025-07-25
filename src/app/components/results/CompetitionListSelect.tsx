"use client"
import { useRouter, useParams } from "next/navigation";

// Components
import InputSelect from "../partials/inputSelect";

// Types
import { GenericStringIndex } from "@/app/type/generic";

interface Props {
  options: GenericStringIndex[];
}
const CompetitionListSelect = ({ options }: Props) => {
  const router = useRouter();
  const params = useParams();
  const competitionId = parseInt(params.competitionId as string, 10);

  return (
    <InputSelect
      id="competition-list"
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
        const newId = Number(e.target.value);
        router.push(`/results/${newId || ''}`);
      }}
      value={competitionId || ''}
      defaultText="Choisissez une comptétition"
      options={options}
      schema="competition-name"
    />
  ) ;
}

export default CompetitionListSelect;
