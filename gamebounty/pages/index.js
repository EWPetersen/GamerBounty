import { signIn, signOut, useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useState } from 'react';
import 'tailwindcss/tailwind.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from '../components/Navbar';
import CreateContractForm from './createContractForm';

export default function Index() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [showCreateForm, setShowCreateForm] = useState(false);

  function handleCloseCreateForm() {
    setShowCreateForm(false);
  }

  function handleCreateContract(newContract) {
    console.log("New contract created:", newContract);
  }

  const isAuthenticated = status === "authenticated";

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <Navbar />
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center pt-10">
          Bounty Board
        </h1>
        <p className="text-center mb-10">
          {isAuthenticated
            ? "Do you have a mark? Create a contract and a bid amount. Check out the dashboard to see closed out marks."
            : "Sign in to get started."}
        </p>
        <div className="flex justify-center">
          {isAuthenticated && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 ml-4 rounded"
            >
              Create Contract
            </button>
          )}
        </div>
      </div>
      <CreateContractForm
        show={showCreateForm}
        handleClose={handleCloseCreateForm}
        handleCreate={handleCreateContract}
        setShowCreateForm={setShowCreateForm}
      />
    </div>
  );
}