import Image from 'next/image';
import Link from "next/link";

// Utils
import { getAssetsUrl } from '../../../utils/utils';

interface navbarProps {
  isOpen: Boolean;
}

export const Navbar = (props: navbarProps) => {
  const { isOpen } = props;
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
          <Link href="/" className="nav-bar--link">
            Accueil
          </Link>
        </li>
        <li className="nav-bar--list-item">
          <Link href="/results" className="nav-bar--link">
            Résultats
          </Link>
        </li>
        <li className="nav-bar--list-item">
          <Link href="/competitions" className="nav-bar--link">
            Liste des compétitions
          </Link>
        </li>
      </ul>
    </nav>
  );
};
