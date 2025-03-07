"use client"
import { useState } from "react";
import Link from "next/link";
import { Navbar } from "../navbar";
import BurgerMenuIcon from "./../icons/BurgerMenuIcon";
import CloseMenuIcon from "./../icons/CloseMenuIcon";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className={`header relative d-flex flex-ai-center ${isOpen ? 'is-open' : 'is-close'}`}>
      <Link href="/">
        <h1 className="f-title-01">Apnée france</h1>
      </Link>
      <Navbar isOpen={isOpen} />
      {
        isOpen ? (
          <div className="toggle-icon" onClick={() => setIsOpen(!isOpen)}>
            <CloseMenuIcon />
          </div>
        ) : (
          <div className="toggle-icon" onClick={() => setIsOpen(!isOpen)}>
            <BurgerMenuIcon />
          </div>
        )
      }
    </header>
  )
}

export default Header;
