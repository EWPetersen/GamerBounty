import { useSession, signIn, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Table } from 'antd';

const columns = [
  {
    title: 'Contract Number',
    dataIndex: 'contractNumber',
    key: 'contractNumber',
    sorter: (a, b) => a.contractNumber - b.contractNumber,
  },
  {
    title: 'Game',
    dataIndex: 'gameName',
    key: 'gameName',
    sorter: (a, b) => a.gameName.localeCompare(b.gameName),
  },
  {
    title: 'Target Player',
    dataIndex: 'targetPlayer',
    key: 'targetPlayer',
    sorter: (a, b) => a.targetPlayer.localeCompare(b.targetPlayer),
  },
  {
    title: 'Bid Amount',
    dataIndex: 'bidAmount',
    key: 'bidAmount',
    sorter: (a, b) => a.bidAmount - b.bidAmount,
  },
  {
    title: 'Contract Status',
    dataIndex: 'contractStatus',
    key: 'contractStatus',
    sorter: (a, b) => a.contractStatus.localeCompare(b.contractStatus),
  },
  {
    title: 'Verify Content Link',
    dataIndex: 'contentLink',
    key: 'contentLink',
    sorter: (a, b) => a.contentLink.localeCompare(b.contentLink),
  },
];

const Profile = () => {
  const { data: session } = useSession();
  const [contracts, setEntries] = useState([]);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await axios.get('/api/viewContract');
        const filteredData = response.data.filter(entry => entry.requestedBy === session.user.email);
        setEntries(filteredData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchContracts();
  }, [session]);

  if (!session) {
    return (
      <div>
        <h1>You need to sign in to view this page.</h1>
        <button onClick={() => signIn('google')}>Sign in</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome, {session.user.name}!</h1>
      <p>Email: {session.user.email}</p>
      <button onClick={() => signOut()}>Sign out</button>
      <Table dataSource={contracts} columns={columns} />
    </div>
  );
};

export default Profile;
