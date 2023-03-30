import 'antd/dist/reset.css';
import { Table, Modal, Button } from 'antd';
import styles from '/styles/ContractsPage.module.css';
import { useState, useEffect } from 'react';
import Navbar from '/components/Navbar';

const columns = (showModal) => [  {    title: 'Game Name',    dataIndex: 'gameName',    sorter: (a, b) => a.gameName.localeCompare(b.gameName),    sortDirections: ['ascend', 'descend'],
    className: styles.gameNameColumn,
  },
  {
    title: 'Target Player',
    dataIndex: 'targetPlayer',
    sorter: (a, b) => a.targetPlayer.localeCompare(b.targetPlayer),
    sortDirections: ['ascend', 'descend'],
    className: styles.targetPlayerColumn,
  },
  {
    title: 'Bid Amount',
    dataIndex: 'bidAmount',
    sorter: (a, b) => parseFloat(b.bidAmount.replace(/[^0-9.-]+/g, '')) - parseFloat(a.bidAmount.replace(/[^0-9.-]+/g, '')),
    sortDirections: ['descend', 'ascend'],
    className: styles.bidAmountColumn,
  },
  {
    title: 'View',
    key: 'view',
    render: (text, record) => (
      <Button type="primary" onClick={() => showModal(record)}>
        View Contract
      </Button>
    ),
  },
];

export default function ContractsPage() {
  const [contracts, setContracts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);

  const getDataFromDynamoDB = async () => {
    const res = await fetch('/api/readContracts');
    const data = await res.json();
    return data.map((item) => ({
      key: item.key,
      gameName: item.gameName,
      targetPlayer: item.targetPlayer,
      bidAmount: item.bidAmount,
      contractStatus: item.contractStatus,
      requestedBy: item.requestedBy,
      contractNumber: item.contractNumber,
    }));
  };
  

  const showModal = (contract) => {
    setSelectedContract(contract);
    setModalVisible(true);
  };

  const handleOk = () => {
    setModalVisible(false);
  };

  const handleAcceptContract = async (uid) => {
    
    const isAssigned = 'yes';
  
    const payload = {
      TableName: 'bountyContracts',
      Key: { uid: uid },
      UpdateExpression: 'set isAssigned = :a',
      ExpressionAttributeValues: {
        ':a': isAssigned,
             },
    };
  
    try {
      const dynamoDB = new AWS.DynamoDB.DocumentClient();
      await dynamoDB.update(payload).promise();
      setContracts((prevContracts) =>
        prevContracts.map((c) => (c.uid === uid ? { ...c, isAssigned } : c))
      );
      setModalVisible(false);
    } catch (err) {
      console.error('Unable to update contract', err);
    }
  };
  
  

  useEffect(() => {
    async function fetchData() {
      const data = await getDataFromDynamoDB();
      setContracts(data);
    }
    fetchData();
  }, []);

  return (
    <>
    <Navbar/>
    <div className={styles.container}>
      <h1 className={styles.title}>View and Accept Contracts</h1>
      <Table
        columns={columns(showModal)}
        dataSource={contracts}
        pagination={false}
        className={styles.table}
        rowKey={(record) => record.uid}
        expandable={{
          expandedRowRender: (record) => (
            <div className={styles.contractDetails}>
              <p>Contract Status: {record.contractStatus}</p>
            </div>
          ),
          rowExpandable: (record) => record.contractStatus !== 'expired',
        }}
        onRow={(record) => {
          return {
            onClick: () => showModal(record),
          };
        }}
      />
      <Modal
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleOk}
        title={`Contract # ${selectedContract ? selectedContract.contractNumber : ''}`}
        >
        <p>Game Name: {selectedContract ? selectedContract.gameName : ''}</p>
        <p>Target Player: {selectedContract ? selectedContract.targetPlayer : ''}</p>
        <p>Bid Amount: {selectedContract ? selectedContract.bidAmount : ''}</p>
        <p>Contract Status: {selectedContract ? selectedContract.contractStatus : ''}</p>
        {selectedContract && selectedContract.contractStatus !== 'expired' && (
            <Button type="primary" onClick={() => handleAcceptContract(selectedContract.uid)}>
            Accept Contract
          </Button>
        )}
        </Modal>
    </div>
    </>
  );
}
