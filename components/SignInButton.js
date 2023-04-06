import React from 'react';
import GoogleButton from 'react-google-button';
import { signIn } from 'next-auth/react';

const SignInButton = () => {
  const handleSignIn = () => {
    signIn('google');
  };

  return <GoogleButton onClick={handleSignIn} />;
};

export default SignInButton;