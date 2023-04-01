import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { MenuIcon } from "@heroicons/react/outline";
import { XIcon } from "@heroicons/react/solid";
import { useState } from "react";

function Navbar() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" passHref>
              <button className="text-white font-bold text-xl">
                Bounty Board
              </button>
            </Link>
          </div>
          <div className="hidden sm:ml-6 sm:block">
            {isAuthenticated && (
              <>
                <Link href="/dashboard" passHref>
                  <button className="text-white px-3 py-2 rounded-md text-sm font-medium">
                    Dashboard
                  </button>
                </Link>
                <Link href="/contracts" passHref>
                  <button className="text-white px-3 py-2 rounded-md text-sm font-medium">
                    Contracts
                  </button>
                </Link>
                <Link href="/profile" passHref>
                  <button className="text-white px-3 py-2 rounded-md text-sm font-medium">
                    Profile
                  </button>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign Out
                </button>
              </>
            )}
            {!isAuthenticated && (
              <button
                onClick={() => signIn()}
                className="text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign In
              </button>
            )}
          </div>
          <div className="-mr-2 flex sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {menuOpen ? (
                <XIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <MenuIcon className="block h-6 w-6" aria-hidden="true" />
              )}
                       </button>
          </div>
        </div>
      </div>
      <div className={`sm:hidden ${menuOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          {isAuthenticated && (
            <>
              <Link href="/dashboard" passHref>
                <button className="text-white block px-3 py-2 rounded-md text-base font-medium">
                  Dashboard
                </button>
              </Link>
              <Link href="/contracts" passHref>
                <button className="text-white block px-3 py-2 rounded-md text-base font-medium">
                  Contracts
                </button>
              </Link>
              <Link href="/profile" passHref>
                <button className="text-white block px-3 py-2 rounded-md text-base font-medium">
                  Profile
                </button>
              </Link>
              <button
                onClick={() => signOut()}
                className="text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                Sign Out
              </button>
            </>
          )}
          {!isAuthenticated && (
            <button
              onClick={() => signIn()}
              className="text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
