import { prisma } from "@lib/database/prisma";
import { NextResponse } from "next/server";
/* eslint-disable @typescript-eslint/no-explicit-any */

type ResultWithCompetition = {
  competition?: {
    name: string;
    city: string;
  };
  [key: string]: any;
};

function buildSelect(columns: string[], includeCompetition: boolean, includeDiscipline: boolean) {
  const baseSelect = columns.reduce((acc, col) => {
    acc[col] = true;
    return acc;
  }, {} as Record<string, any>);

  if (includeCompetition) {
    baseSelect.competition = {
      select: {
        name: true,
        city: true,
      },
    };
  }

  if (includeDiscipline) {
  baseSelect.discipline = {
    select: {
      name: true,
    },
  };
}

  return baseSelect;
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    // Récupération des params
    const competitionIdParam = searchParams.get("competitionId");
    const disciplineIdParam = searchParams.get("disciplineId");
    // const firstNameParam = searchParams.get("firstName");
    const searchParam = searchParams.get("search");
    const fieldsParam = searchParams.get("fields");
    const includeCompetition = searchParams.get("includeCompetition") === "true";
    const includeDiscipline = searchParams.get("includeDiscipline") === "true";

    // Construction du filtre where
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: Record<string, any> = {};
    if (competitionIdParam) {
      const compId = Number(competitionIdParam);
      if (!isNaN(compId)) {
        where.competitionId = compId;
      }
    }
    if (disciplineIdParam) {
      const discId = Number(disciplineIdParam);
      if (!isNaN(discId)) {
        where.disciplineId = discId;
      }
    }
    // if (firstNameParam) {
    //   where.firstName = firstNameParam;
    // }

        // Recherche par nom ou prénom
    if (searchParam && searchParam.trim() !== "") {
      where.OR = [
        { firstName: { contains: searchParam, mode: "insensitive" } },
        { lastName: { contains: searchParam, mode: "insensitive" } },
      ];
    }

// Construction de select
    let select: Record<string, any> | undefined = undefined;
    if (fieldsParam) {
      const fields = fieldsParam.split(",").map(f => f.trim()).filter(Boolean);
      if (fields.length > 0) {
        select = buildSelect(fields, includeCompetition, includeDiscipline);
      }
    } else if (includeCompetition) {
      // Si aucun champ demandé mais includeCompetition = true, on sélectionne tout + la relation
      select = buildSelect([], true, includeDiscipline);
    }

    // Requête principale
    const results = await prisma.result.findMany({
      where,
      ...(select ? { select } : {}),
    });

    const flattened = results.map((res: ResultWithCompetition) => {
    const { competition, discipline, ...rest } = res;

    return {
      ...rest,
      ...(competition && {
        competitionName: competition.name,
        city: competition.city,
      }),
      ...(discipline && {
        disciplineName: discipline.name
      })
    };
  });


    return NextResponse.json(flattened);
  } catch (error) {
    console.error("Erreur dans l'API results:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la récupération des résultats." },
      { status: 500 }
    );
  }
}
