import Link from 'next/link';
import { Menu } from 'antd';
import { HomeOutlined, DashboardOutlined, EyeOutlined, FormOutlined, UserOutlined } from '@ant-design/icons';

const Navbar = () => {
  return (
    <Menu mode="horizontal">
      <Menu.Item key="main" icon={<HomeOutlined />}>
        <Link href="/">gamerBounty</Link>
      </Menu.Item>
      <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
        <Link href="/dashboard">liveDashboard</Link>
      </Menu.Item>
      <Menu.Item key="view" icon={<EyeOutlined />}>
        <Link href="/openContracts">openContracts</Link>
      </Menu.Item>
      <Menu.Item key="submit" icon={<FormOutlined />}>
        <Link href="/submitContract">submitContract</Link>
      </Menu.Item>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        <Link href="/profile">myProfile</Link>
      </Menu.Item>
    </Menu>
  );
};

export default Navbar;
