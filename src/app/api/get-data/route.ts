import { prisma } from "@lib/database/prisma";
import { NextRequest, NextResponse } from "next/server";

type TableName = "competitions" | "disciplines" | "results";

function buildSelect(columns: string[]) {
  return columns.reduce((acc, col) => {
    acc[col] = true;
    return acc;
  }, {} as Record<string, true>);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const table = searchParams.get("table") as TableName | null;
  const fields = searchParams.get('fields')?.split(',') ?? [];

  if (!table) {
    return NextResponse.json(
      { error: 'Paramètre "table" manquant.' },
      { status: 400 },
    );
  }

  const allowedTables: TableName[] = ["competitions", "disciplines", "results"];
  if (!allowedTables.includes(table)) {
    return NextResponse.json(
      { error: `Table "${table}" non autorisée.` },
      { status: 400 },
    );
  }

  try {
    // Accès dynamique au modèle Prisma
    const model = (prisma as any)[table];

    if (!model || typeof model.findMany !== "function") {
      return NextResponse.json(
        { error: `Table "${table}" introuvable.` },
        { status: 400 },
      );
    }


    const select = fields.length > 0
    ? { select: buildSelect(fields) }
    : undefined

    const data = await model.findMany(select);
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Erreur API get:", err);
    return NextResponse.json(
      { error: "Erreur serveur lors de la récupération." },
      { status: 500 },
    );
  }
}
