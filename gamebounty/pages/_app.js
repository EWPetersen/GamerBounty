import 'tailwindcss/tailwind.css';
import 'antd/dist/reset.css';
import { ConfigProvider } from 'antd';

function MyApp({ Component, pageProps }) {
  return (
    <ConfigProvider theme={{ dark: true }}>
      <Component {...pageProps} />
    </ConfigProvider>
  );
}

export default MyApp;