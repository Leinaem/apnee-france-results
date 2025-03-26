import Image from 'next/image';
import Link from "next/link";

// Utils
import { getAssetsUrl } from '../../../utils/utils';

interface navbarProps {
  isOpen: Boolean;
  setIsOpen: Function
}

export const Navbar = (props: navbarProps) => {
  const { isOpen, setIsOpen } = props;
  return (
    <nav className={`nav-bar ${isOpen ? 'is-open' : 'is-close'}`}>
      <ul className={`nav-bar--list`}>
        <li>
          <div className="nav-bar--list-item nav-bar--gap">
          <Image
            src={getAssetsUrl('images/ffessm-apnee-2.jpg')}
            alt="S3-test-img"
            width={149}
            height={40}
            priority
        />
          </div>
        </li>
        <li className="nav-bar--list-item">
          <Link href="/" className="nav-bar--link" onClick={() => setIsOpen(false)}>
            Accueil
          </Link>
        </li>
        <li className="nav-bar--list-item">
          <Link href="/results" className="nav-bar--link" onClick={() => setIsOpen(false)}>
            Résultats
          </Link>
        </li>
        <li className="nav-bar--list-item">
          <Link href="/competitions" className="nav-bar--link" onClick={() => setIsOpen(false)}>
            Liste des compétitions
          </Link>
        </li>
        <li className="nav-bar--list-item">
          <Link href="/rankings" className="nav-bar--link" onClick={() => setIsOpen(false)}>
            Classements
          </Link>
        </li>
      </ul>
    </nav>
  );
};
