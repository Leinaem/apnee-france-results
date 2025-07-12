import { prisma } from "@lib/database/prisma";
import { NextRequest, NextResponse } from "next/server";

type TableName = "competitions" | "disciplines" | "results";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const table = searchParams.get("table") as TableName | null;

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

    const data = await model.findMany();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Erreur API get:", err);
    return NextResponse.json(
      { error: "Erreur serveur lors de la récupération." },
      { status: 500 },
    );
  }
}
