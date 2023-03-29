import { Menu, Drawer, Button } from 'antd';
import { HomeOutlined, DashboardOutlined, EyeOutlined, UserOutlined, MenuOutlined } from '@ant-design/icons';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import tw from 'tailwind-styled-components';

const StyledMenu = tw(Menu)`
  border-none
  dark:bg-gray-900
  dark:text-white
`;

const StyledDrawer = tw(Drawer)`
  dark:bg-gray-900
  dark:text-white
`;

const Navbar = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (status !== 'authenticated') {
      router.push('/');
    }
  }, [status]);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  return (
    <>
      
      <StyledMenu mode="horizontal" theme="dark">
        <Menu.Item key="main" icon={<HomeOutlined />} className="ms-auto">
          <Link href="/">gamerBounty</Link>
        </Menu.Item>
        {status === 'authenticated' && (
          <Button type="primary" icon={<MenuOutlined />} onClick={showDrawer} className="ms-auto" />
        )}
        {status !== 'authenticated' && (
          <Button type="primary" icon={<MenuOutlined />} onClick={showDrawer} className="ms-auto">
            login
          </Button>
        )}
      </StyledMenu>
      {status === 'authenticated' && (
        <StyledDrawer title="Menu" placement="right" onClose={onClose} open={visible} style={{ width: 'fit-content' }}>
          <StyledMenu mode="inline" theme="dark" onClick={onClose}>
            <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
              <Link href="/dashboard">dashboard</Link>
            </Menu.Item>
            <Menu.Item key="contracts" icon={<EyeOutlined />}>
              <Link href="/getContracts">contracts</Link>
            </Menu.Item>
            <Menu.Item key="profile" icon={<UserOutlined />}>
              <Link href="/profile">myProfile</Link>
            </Menu.Item>
            <Menu.Item key="logout" onClick={() => signOut()}>
              logout
            </Menu.Item>
          </StyledMenu>
        </StyledDrawer>
      )}
      {status !== 'authenticated' && (
        <StyledDrawer title="Menu" placement="right" onClose={onClose} open={visible} style={{ width: 'fit-content' }}>
          <StyledMenu mode="inline" theme="dark" onClick={onClose}>
            <Menu.Item key="login" onClick={() => signIn('google')}>
              login with google
            </Menu.Item>
          </StyledMenu>
        </StyledDrawer>
      )}
    </>
  );
};

export default Navbar;
