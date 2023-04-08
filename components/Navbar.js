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
  const { data: session, status } = useSession();
  const [showCreateForm, setShowCreateForm] = useState(false);

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
            {/* Other NavbarLinks */}
            {/* Remove CreateContractForm from here */}
          </div>
        </div>
      </nav>
      {/* Keep this CreateContractForm component */}
      <CreateContractForm
        show={showCreateForm}
        handleClose={handleClose}
        session={session}
        status={status}
      />
    </>
  );
};

export default Navbar;
