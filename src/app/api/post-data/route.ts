import { prisma } from "@lib/database/prisma";
import { NextRequest, NextResponse } from "next/server";

type TableName = "competitions" | "results";

const modelMap = {
  competitions: prisma.competitions,
  results: prisma.results,
} as const;


export async function POST(req: NextRequest) {
  const { table, data } = await req.json();

  if (!table || !data || !Array.isArray(data)) {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  // Sécurité : limiter aux tables connues
  const allowedTables: TableName[] = ["competitions", "results"];
  if (!allowedTables.includes(table)) {
    return NextResponse.json(
      { error: `Table "${table}" non autorisée.` },
      { status: 400 },
    );
  }

  try {
    const model = modelMap[table as TableName];

    if (!model || typeof model.create !== "function") {
      return NextResponse.json(
        { error: `Table "${table}" introuvable.` },
        { status: 400 },
      );
    }

    // Insertion des données
    if (table === "competitions") {
      for (const row of data) {
        await prisma.competitions.create({ data: row });
      }
    } else if (table === "results") {
      for (const row of data) {
        await prisma.results.create({ data: row });
      }
    }

    return NextResponse.json({
      message: `Import de ${data.length} lignes dans "${table}" réussi.`,
    });
  } catch (err: unknown) {
    console.error(err);
    console.error("Erreur API upload:", err); //
    return NextResponse.json(
      { error: "Erreur serveur lors de l’import." },
      { status: 500 },
    );
  }
}
