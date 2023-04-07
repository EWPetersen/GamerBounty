// components/Navbar.js
import React from "react";
import Link from "next/link";
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import { useSession, signIn, signOut } from "next-auth/react";

const NavbarLink = ({ href, children, extraClasses, onClick }) => (
  <Link href={href}>
    <span
      onClick={onClick}
      className={`cursor-pointer hover:text-blue-400 px-4 py-2 rounded-md ${extraClasses}`}
    >
      {children}
    </span>
  </Link>
);

const Navbar = () => {
  const { data: session } = useSession();

  const handleSignIn = (e) => {
    e.preventDefault();
    signIn("google");
  };

  const handleSignOut = (e) => {
    e.preventDefault();
    signOut();
  };

  return (
    <nav className="bg-gray-800 text-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-4">

        
          <NavbarLink href="/">Main</NavbarLink>
          {session && (
            <>
            
            <Button variant="primary"
              onClick={() => setShowCreateForm(true)}
            >
              Create Contract
            </Button>
              <NavbarLink href="/contracts">Contracts</NavbarLink>
              <NavbarLink href="/profile">Profile</NavbarLink>
              <NavbarLink
                href="/"
                onClick={handleSignOut}
                extraClasses="text-red-500 hover:text-red-700"
              >
                Sign Out
              </NavbarLink>
            </>
            
          )}
          {!session && (
            <NavbarLink
              href="/"
              onClick={handleSignIn}
              extraClasses=""
            >
              Sign In
            </NavbarLink>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
