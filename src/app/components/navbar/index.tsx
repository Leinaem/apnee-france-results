"use client"
import { useState } from "react";
import Link from "next/link";
import './style.scss';
import BurgerMenuIcon from "./../icons/BurgerMenuIcon";
import CloseMenuIcon from "./../icons/CloseMenuIcon";
import UserIcon from "./../icons/UserIcon";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className={`nav-bar menu-${isOpen ? 'is-open' : 'is-close'}`}>
      {/* #046db8 */}
      <div className="nav-bar--burger-icon">
        <BurgerMenuIcon />
      </div>

      <div className="nav-bar--burger-icon">
        <CloseMenuIcon />
      </div>

      <a href="/">
        <h1 className="nav-bar--main-title">Apnée france</h1>
      </a>

      <div className="nav-bar--links">
        <Link href="/">
          Accueil
        </Link>
        <Link href="/results">
          Résultats
        </Link>
        <Link href="/competitions">
          Liste des compétitions
        </Link>
      </div>
    </nav>      
  );
};
