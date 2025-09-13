import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <div className="page page-results">
      <h2 className="page page-title">Résultats</h2>
      <div className="results-container">
        {children}
      </div>
    </div>
  );
}
