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
    title: 'Content Link',
    dataIndex: 'contentLink',
    render: (text) => <a href={text}>Link</a>,
  },
  {
    title: 'Requested By',
    dataIndex: 'requestedBy',
  },
];

function DashboardPage() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/viewContract');
        setEntries(response.data.filter(entry => entry.contractStatus === 'closed'));
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Navbar />
      <h1>Live Feed - Closed Contracts</h1>
      <Table columns={columns} dataSource={entries} />
    </div>
  );
}

export default DashboardPage;
