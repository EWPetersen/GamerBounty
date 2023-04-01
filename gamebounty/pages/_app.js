import 'bootstrap/dist/css/bootstrap.min.css';
import 'tailwindcss/tailwind.css';
import { ConfigProvider } from 'antd';
import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';

function MyApp({ Component, pageProps: { session, ...pageProps }, }) {
  return (
    <ConfigProvider theme={{ dark: true }}>
      <SessionProvider session={session}>
        <Component {...pageProps} />
        <style jsx global>{`
          body {
            background-color: #1f2937;
          }
          body, h1, h2, h3, h4, h5, h6, p, span, a {
            color: #E5E7EB; /* Light gray color */
          }
        `}</style>
      </SessionProvider>
    </ConfigProvider>
  );
}

export default MyApp;
