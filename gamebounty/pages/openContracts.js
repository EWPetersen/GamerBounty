import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Tag } from 'antd';
import Navbar from '../components/Navbar';

const columns = [
  {
    title: 'Contract Number',
    dataIndex: 'contractNumber',
    sorter: (a, b) => a.contractNumber - b.contractNumber,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: 'Game Name',
    dataIndex: 'gameName',
  },
  {
    title: 'Target Player',
    dataIndex: 'targetPlayer',
  },
  {
    title: 'Contract Conditions',
    dataIndex: 'contractConditions',
  },
  {
    title: 'Bid Amount',
    dataIndex: 'bidAmount',
    sorter: (a, b) => a.bidAmount - b.bidAmount,
    sortDirections: ['descend', 'ascend'],
    render: (text, record) => (
      <Tag color={record.bidAmount > 500 ? 'red' : 'green'}>
        ${record.bidAmount}
      </Tag>
    ),
  },
  {
    title: 'Contract Status',
    dataIndex: 'contractStatus',
  },
 
  {
    title: 'Requested By',
    dataIndex: 'requestedBy',
  },
  {
    title: 'Multi Bid',
    dataIndex: 'multiBid',
  },
  {
    title: 'Multi Submit',
    dataIndex: 'multiSubmit',
  },
];

function ViewPage() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/viewContract');
        const filteredData = response.data.filter(entry => entry.contractStatus === "open");
        setEntries(filteredData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Navbar />
      <h1>Gamer Bounties</h1>
      <Table columns={columns} dataSource={entries} />
    </div>
  );
}

export default ViewPage;
