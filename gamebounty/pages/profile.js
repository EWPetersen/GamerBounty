import { useSession, signIn, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Modal, Table } from 'antd';
import Navbar from '../components/Navbar';
import { LoadingOutlined, CloseOutlined } from '@ant-design/icons';

const { confirm } = Modal;

const Profile = () => {
  const { data: session, status } = useSession();
  const [contracts, setContracts] = useState([]);
  const [contractDeleteStatus, setContractDeleteStatus] = useState({});

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
    {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      render: (record) => (
        <Button type="primary" onClick={() => showDeleteConfirm(record)}>
          Delete
        </Button>
      ),
    },
  ];

  const fetchContracts = async () => {
    try {
      const response = await axios.get('/api/viewContract');
      const filteredData = response.data.filter(
        (entry) => entry.requestedBy === session.user.email
      );
      setContracts(filteredData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (session) {
      fetchContracts();
    }
  }, [session]);

  const confirmDeleteContract = async (contractNumber) => {
    setContractDeleteStatus((prevStatus) => ({
      ...prevStatus,
      [contractNumber]: { status: 'loading' },
    }));

    try {
      const response = await axios.delete(`/api/deleteContract/${contractNumber}`);
      setContracts((prevContracts) =>
        prevContracts.filter((contract) => contract.contractNumber !== contractNumber)
      );
      setContractDeleteStatus((prevStatus) => ({
        ...prevStatus,
        [contractNumber]: { status: 'success' },
      }));
    } catch (error) {
      console.log(error);
      setContractDeleteStatus((prevStatus) => ({
        ...prevStatus,
        [contractNumber]: { status: 'error' },
      }));
    }
  };

  const deleteContract = async (contractNumber) => {
    setContractDeleteStatus((prevStatus) => ({
      ...prevStatus,
      [contractNumber]: { status: 'loading' },
    }));

    try {
      const response = await axios.delete(`/api/deleteContract/${contractNumber}`);
      setContracts((prevContracts) =>
        prevContracts.filter((contract) => contract.contractNumber !== contractNumber)
      );
      setContractDeleteStatus((prevStatus) => ({
        ...prevStatus,
        [contractNumber]: { status: 'success' },
      }));
    } catch (error) {
      console.log(error);
      setContractDeleteStatus((prevStatus) => ({
        ...prevStatus,
        [contractNumber]: { status: 'error' },
      }));
    }
  };

  const showDeleteConfirm = (record) => {
    confirm({
      title: 'Are you sure you want to delete this contract?',
      icon: 'warning',
      content: `Contract Number: ${record.contractNumber}`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteContract(record.contractNumber);
      },
    });
  };

  if (status === 'loading') {
    return <p>Loading...</p>;
  }
  
  if (!session) {
    return (
      <>
        <h1>Please sign in</h1>
        <button onClick={() => signIn()}>Sign in</button>
      </>
    );
  }

  return (
    <div>
      <Navbar />
      <h1>Welcome, {session && session.user ? session.user.name : 'Guest'}!</h1>
      <p>Email: {session && session.user ? session.user.email : 'Not available'}</p>
      <button onClick={() => signOut()}>Sign out</button>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {contracts
          .sort((a, b) => a.contractNumber - b.contractNumber)
          .map((contract) => (
            <Card
              key={contract._id}
              title={`Contract #${contract.contractNumber}`}
              style={{ width: 300, margin: '16px' }}
              sortOrder={'ascend'}
              sorter={(a, b) => a.contractNumber - b.contractNumber}
            >
              <p><strong>Game:</strong> {contract.gameName}</p>
              <p><strong>Target Player:</strong> {contract.targetPlayer}</p>
              <p><strong>Bid Amount:</strong> {contract.bidAmount}</p>
              <p><strong>Contract Status:</strong> {contract.contractStatus}</p>
              <p><strong>Verify Content Link:</strong> {contract.contentLink}</p>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="primary" onClick={() => showDeleteConfirm(contract)}>
                  Delete
                </Button>
                {contractDeleteStatus[contract.contractNumber] !== undefined && (
                  contractDeleteStatus[contract.contractNumber].status === 'loading' ? (
                    <LoadingOutlined style={{ marginLeft: '8px' }} />
                  ) : (
                    contractDeleteStatus[contract.contractNumber].status === 'success' ? (
                      <CheckOutlined style={{ marginLeft: '8px', color: 'green' }} />
                    ) : (
                      <CloseOutlined style={{ marginLeft: '8px', color: 'red' }} />
                    )
                  )
                )}
              </div>
            </Card>
          ))}
      </div>
    </div>
  );
};

export default Profile;