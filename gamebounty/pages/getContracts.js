import { useEffect, useState } from 'react';
import { Table, Pagination, Spin, Input } from 'antd';
import 'antd/dist/reset.css';
import { ConfigProvider } from 'antd';
import { createFromIconfontCN } from '@ant-design/icons';
import axios from 'axios';

import 'tailwindcss/tailwind.css';


const { Search } = Input;
const MyIcon = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2772871_gwg6om9poz.js',
});

function GetContracts() {
  const [contracts, setContracts] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setLoading(true);
    axios.get('/api/readContracts')
      .then(response => {
        console.log('Contracts data:', response.data.data);
        const filteredData = response.data.data.filter(contract => contract.contractStatus?.S === 'open');
        setContracts(filteredData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching contracts', error);
        setLoading(false);
      });
  }, []);

  const columns = [
    {
      title: 'Game Name',
      dataIndex: 'gameName',
      key: 'gameName',
      sorter: (a, b) => a.gameName.localeCompare(b.gameName),
    },
    {
      title: 'Player Target',
      dataIndex: 'targetPlayer',
      key: 'targetPlayer',
      sorter: (a, b) => a.targetPlayer.localeCompare(b.targetPlayer),
    },
    {
      title: 'Bid Amount',
      dataIndex: 'bidAmount',
      key: 'bidAmount',
      sorter: (a, b) => a.bidAmount.localeCompare(b.bidAmount),
    },
  ];

  function handlePaginationChange(newPagination) {
    setPagination(newPagination);
  }

  function handleSearch(value) {
    setSearchTerm(value);
  }

  const filteredContracts = contracts.filter(contract => contract.gameName.S.toLowerCase().includes(searchTerm.toLowerCase()));
  const paginatedContracts = filteredContracts.slice((pagination.current - 1) * pagination.pageSize, pagination.current * pagination.pageSize);

  return (
    <ConfigProvider theme={{ dark: true }}>
      <div className="bg-gray-900 min-h-screen text-white">
        <div className="flex justify-center">
          <div className="max-w-screen-lg w-full">
            <h1 className="text-3xl font-bold mb-8 text-center">All Open Contracts</h1>
            <div className="flex justify-end mb-4">
              <Search placeholder="Search by game name" onSearch={handleSearch} style={{ width: 300 }} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              <Spin spinning={loading}>
                {paginatedContracts.map(contract => (
                  <div className="flex flex-col bg-gray-800 rounded-md p-4 hover:shadow-lg transition-shadow duration-300">
                    <div className="font-bold mb-2">{contract.gameName.S}</div>
                    <div className="mb-2">Target Player: {contract.targetPlayer.S}</div>
                    <div>Bid Amount: {contract.bidAmount.S}</div>
                  </div>
                ))}
              </Spin>
            </div>
            <div className="flex justify-center mt-8">
              <Pagination
                current={pagination.current}
                pageSize={pagination.pageSize}
                total={filteredContracts.length}
                onChange={handlePaginationChange}
                showSizeChanger={false}
                style={{ marginBottom: 20 }}
              />
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}

export default GetContracts;