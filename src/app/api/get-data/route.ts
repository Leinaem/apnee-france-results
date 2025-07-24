import { prisma } from "@lib/database/prisma";
import { NextResponse } from "next/server";

function buildSelect(columns: string[]) {
  return columns.reduce((acc, col) => {
    acc[col] = true;
    return acc;
  }, {} as Record<string, true>);
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    // Récupération des params
    const competitionIdParam = searchParams.get("competitionId");
    const firstNameParam = searchParams.get("firstName");
    const fieldsParam = searchParams.get("fields");

    // Construction du filtre where
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: Record<string, any> = {};
    if (competitionIdParam) {
      const compId = Number(competitionIdParam);
      if (!isNaN(compId)) {
        where.competitionId = compId;
      }
    }
    if (firstNameParam) {
      where.firstName = firstNameParam;
    }

    // Construction de select
    let select: Record<string, true> | undefined = undefined;
    if (fieldsParam) {
      const fields = fieldsParam.split(",").map(f => f.trim()).filter(Boolean);
      if (fields.length > 0) {
        select = buildSelect(fields);
      }
    }

    const results = await prisma.results.findMany({
      where,
      ...(select ? { select } : {}),
    });

    return NextResponse.json(results);

  } catch (error) {
    console.error("Erreur dans l'API results:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la récupération des résultats." },
      { status: 500 }
    );
  }
}