"use client"
import { useState } from "react";
import Link from "next/link";
import Image from 'next/image';

// Components
import BurgerMenuIcon from "./../icons/BurgerMenuIcon";
import CloseMenuIcon from "./../icons/CloseMenuIcon";
import { Navbar } from "../navbar";

// Utils
import { getAssetsUrl } from '../../../utils/utils';

const Header = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <header className={`header relative d-flex flex-ai-center ${isOpen ? 'is-open' : 'is-close'}`}>
      <Link href="/">
        <h1>
          <span>
            apnée france
          </span>
          <Image
            src={getAssetsUrl('images/ffessm-apnee-2.jpg')}
            alt="logo-ffessm"
            width={268}
            height={72}
            priority
          />
        </h1>
      </Link>
      <Navbar isOpen={isOpen} updateIsOpen={(newValue: boolean) => setIsOpen(newValue)} />
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
