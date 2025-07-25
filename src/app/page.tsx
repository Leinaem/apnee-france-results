import Link from 'next/link';

export default function Home() {
  return (
    <div className="page homepage">
      <h2>Bienvenue sur Apnée France Results</h2>
      <p>
        Nous sommes ravis de vous accueillir sur notre plateforme dédiée à la
        mise en lumière des performances effectuées lors des compétitions
        nationales pour la saison 2024-2025.
      </p>
      <p>
        Que vous soyez compétiteurs, passionnés ou simplement curieux, vous êtes
        au bon endroit !
      </p>

      <p>Sur Apnée France Results vous pourrez consulter :</p>
      <ul>
        <li>
          La <Link href="/competitions">liste des compétitions</Link> sélectives,
          opens et manches de coupe de France.
        </li>
        <li>
          Les <Link href="/results">résultats</Link> de toutes les compétitions pour
          chacune des disciplines.
        </li>
        <li>
          Les <Link href="/rankings">classements</Link> par performances et/ou par
          compétiteurs.
        </li>
      </ul>

      <div className="bloc">
        <p>
          Nous tenons à préciser que les résultats présentés sur notre site
          n&apos;ont pas de valeur officielle.
        </p>
        <p>
          Ils proviennent directement des données publics fournies par la{" "}
          <Link
            target="_blank"
            href="https://apnee.ffessm.fr/la-commission-nationale-apnee"
            rel="noopener noreferrer"
          >
            comission national d&apos;apnée
          </Link>{" "}
          et sont compilés à des fins d&apos;information et de suivi.
        </p>
        <p>
          Nous faisons de notre mieux pour garantir l&apos;exactitude de ces
          informations.
        </p>
        <p>
          En cas de doute nous vous encourageons à consulter les sources
          officielles pour des résultats certifiés.
        </p>
      </div>
    </div>
  );
}
