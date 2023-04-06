// components/Navbar.js
import React from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

const NavbarLink = ({ href, children, extraClasses }) => (
  <Link href={href}>
    <span
      className={`cursor-pointer hover:text-blue-400 px-4 py-2 rounded-md ${extraClasses}`}
    >
      {children}
    </span>
  </Link>
);

const Navbar = () => {
  const { data: session } = useSession();

  const handleSignIn = () => {
    signIn("google");
  };

  const handleSignOut = () => {
    signOut();
  };

  return (
    <nav className="bg-gray-800 text-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-4">
          <NavbarLink href="/">Main</NavbarLink>
          {session && (
            <>
              <NavbarLink href="/dashboard">Dashboard</NavbarLink>
              <NavbarLink href="/contracts">Contracts</NavbarLink>
              <NavbarLink href="/profile">Profile</NavbarLink>
              <span
                onClick={handleSignOut}
                className="cursor-pointer hover:text-blue-400 px-4 py-2 rounded-md text-red-500 hover:text-red-700"
              >
                Sign Out
              </span>
            </>
          )}
          {!session && (
            <span
              onClick={handleSignIn}
              className="cursor-pointer hover:text-blue-400 px-4 py-2 rounded-md"
            >
              Sign In
            </span>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
