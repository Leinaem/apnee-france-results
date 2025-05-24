import Image from 'next/image';
import Link from "next/link";

// Utils
import { getAssetsUrl } from '../../../utils/utils';

interface navbarProps {
  isOpen: boolean;
  updateIsOpen(newValue: boolean): void;
}

export const Navbar = (props: navbarProps) => {
  const { isOpen, updateIsOpen } = props;
  return (
    <nav className={`nav-bar ${isOpen ? 'is-open' : 'is-close'}`}>
      <ul className={`nav-bar--list`}>
        <li>
          <div className="nav-bar--list-item nav-bar--gap">
          <Image
            src={getAssetsUrl('images/ffessm-apnee-2.jpg')}
            alt="logo-ffessm-navbar"
            width={149}
            height={40}
            priority
        />
          </div>
        </li>
        <li className="nav-bar--list-item">
          <Link href="/" className="nav-bar--link" onClick={() => updateIsOpen(false)}>
            Accueil
          </Link>
        </li>
        <li className="nav-bar--list-item">
          <Link href="/competitions" className="nav-bar--link" onClick={() => updateIsOpen(false)}>
            Liste des compétitions
          </Link>
        </li>
        <li className="nav-bar--list-item">
          <Link href="/results" className="nav-bar--link" onClick={() => updateIsOpen(false)}>
            Résultats
          </Link>
        </li>
        <li className="nav-bar--list-item">
          <Link href="/rankings" className="nav-bar--link" onClick={() => updateIsOpen(false)}>
            Classements
          </Link>
        </li>
        <li className="nav-bar--list-item">
          <Link href="/search" className="nav-bar--link" onClick={() => updateIsOpen(false)}>
            Recherche
          </Link>
        </li>
      </ul>
    </nav>
  );
};
