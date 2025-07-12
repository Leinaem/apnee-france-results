import { prisma } from "@lib/database/prisma";
import { NextRequest, NextResponse } from "next/server";

type TableName = "competitions" | "results";

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
    // Référence dynamique au client Prisma
    const model = (prisma as any)[table];

    if (!model || typeof model.create !== "function") {
      return NextResponse.json(
        { error: `Table "${table}" introuvable.` },
        { status: 400 },
      );
    }

    // Insertion des données
    for (const row of data) {
      await model.create({ data: row });
    }

    return NextResponse.json({
      message: `Import de ${data.length} lignes dans "${table}" réussi.`,
    });
  } catch (err: any) {
    console.error(err);
    console.error("Erreur API upload:", err); //
    return NextResponse.json(
      { error: "Erreur serveur lors de l’import." },
      { status: 500 },
    );
  }
}
