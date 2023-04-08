// components/Navbar.js
import React, { useState } from "react";
import Link from "next/link";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import { useSession, signIn, signOut } from "next-auth/react";

import CreateContractForm from "./CreateContractForm";

function handleCreateContract(newContract) {
  console.log("New contract created:", newContract);
}

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
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCreateContract, setSelectedCreateContract] = useState(null);

  const handleSignIn = (e) => {
    e.preventDefault();
    signIn("google");
  };

  const handleSignOut = (e) => {
    e.preventDefault();
    signOut();
  };

  const handleClose = () => {
    setShowCreateForm(false);
  };

  return (
    <>
      <nav className="bg-gray-800 text-white py-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex space-x-4">
            <Button variant="primary" onClick={() => setShowCreateForm(true)}>
              Create Contract
            </Button>
            <NavbarLink href="/">Main</NavbarLink>
            {session && (
              <>
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
              <NavbarLink href="/" onClick={handleSignIn} extraClasses="">
                Sign In
              </NavbarLink>
            )}
          
            <style global jsx>{`
              .modal-content,
              .form-control {
                background-color: #1f2937;
                color: #ffffff;
              }
              .alert-success {
                background-color: #10b981;
                color: #ffffff;
              }
              .alert-danger {
                background-color: #ef4444;
                color: #ffffff;
              }
              table thead th {
                cursor: pointer;
                font-weight: 600;
                text-transform: uppercase;
              }
              table tbody tr:hover {
                background-color: rgba(255, 255, 255, 0.1);
              }
            `}</style>
          </div>
        </div>
      </nav>
      {showCreateForm && (
         <CreateContractForm
         show={showCreateForm}
         handleClose={handleClose}
         setShowCreateForm={setShowCreateForm}
       />
      )}
    </>
  );
};

export default Navbar;
