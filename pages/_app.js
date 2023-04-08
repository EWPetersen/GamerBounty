import "tailwindcss/tailwind.css";
import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
      <style jsx global>{`
        body {
          background-color: #1f2937;
        }
        body,
        h1,
        h2,
        h3,
        h4,
        h5,
        p,
        span,
        a {
          color: #e5e7eb; /* Light gray color */
        }
        h6 {
          color: #ffc933; /* Replace with the desired color for h6 elements */
        }
      `}</style>
    </SessionProvider>
  );
}

export default MyApp;
