// components/SignOutButton.js
import React from 'react';
import { signOut } from 'next-auth/react';

const SignOutButton = () => {
  const handleSignOut = () => {
    signOut();
  };

  return <button onClick={handleSignOut}>Logout</button>;
};

export default SignOutButton;
