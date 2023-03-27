import { providers, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Login({ providers }) {
  const router = useRouter();
  const { error, provider } = router.query;

  useEffect(() => {
    // If the user is already signed in, redirect to their profile page
    if (session) {
      router.push("/my-profile");
    }
    // If there was an error during sign in, display it
    if (error) {
      alert(error);
    }
  }, [error, session]);

  const handleSignIn = async (provider) => {
    await signIn(provider.id, {
      callbackUrl: `${window.location.origin}/my-profile`,
    });
  };

  return (
    <div className="container">
      <h1>Login</h1>
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button onClick={() => handleSignIn(provider)}>
            Sign in with {provider.name}
          </button>
        </div>
      ))}
    </div>
  );
}

export async function getServerSideProps(context) {
  const providers = await providers(context);
  return {
    props: { providers },
  };
}
