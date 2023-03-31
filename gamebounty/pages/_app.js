import 'bootstrap/dist/css/bootstrap.min.css';
import 'tailwindcss/tailwind.css';
import { ConfigProvider } from 'antd';

function MyApp({ Component, pageProps }) {
  return (
    <ConfigProvider theme={{ dark: true }}>
      <Component {...pageProps} />
      <style jsx global>{`
        body {
          background-color: #1f2937;
        }
      `}</style>
    </ConfigProvider>
  );
}

export default MyApp;