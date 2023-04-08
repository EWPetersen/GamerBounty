import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Row, Col, List } from 'antd';
import {
  Container,
  Button,
  Input,
  Card,
  Spacer,
  Table,
  Text,
  Modal,
} from '@nextui-org/react';

function Main() {
    const [contracts, setContracts] = useState([]);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sort, setSort] = useState({ field: '', order: '' });
    const [show, setShow] = useState(false);
    const [selectedContract, setSelectedContract] = useState(null);
  
    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await axios.get('/api/readContracts');
          console.log('Contracts data:', response.data.data);
          const filteredData = response.data.data.filter(
            (contract) => contract.contractStatus?.S === 'closed'
          );
          setContracts(filteredData);
        } catch (error) {
          console.error('Error fetching contracts', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, []);
  
    function handlePaginationChange(newPagination) {
      setPagination(newPagination);
    }
  
    function handleSearch(event) {
      setSearchTerm(event.target.value);
    }
  
    function handleSort(field) {
      if (sort.field === field) {
        setSort({ ...sort, order: sort.order === 'asc' ? 'desc' : 'asc' });
      } else {
        setSort({ field, order: 'asc' });
      }
    }
  
    function handleViewContract(contract) {
      setSelectedContract(contract);
      setShow(true);
    }
  
    function handleClose() {
      setSelectedContract(null);
      setShow(false);
    }
  
    const filteredContracts = contracts.filter((contract) =>
      contract &&
      contract.gameTitle.S.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    const sortedContracts = sort.field
      ? filteredContracts.sort((a, b) => {
          if (sort.field === 'bidAmount') {
            const fieldA = parseFloat(a[sort.field].N);
            const fieldB = parseFloat(b[sort.field].N);
            return sort.order === 'asc' ? fieldA - fieldB : fieldB - fieldA;
          } else {
            const fieldA = a[sort.field].S.toLowerCase();
            const fieldB = b[sort.field].S.toLowerCase();
            if (fieldA < fieldB) {
              return sort.order === 'asc' ? -1 : 1;
            }
            if (fieldA > fieldB) {
              return sort.order === 'asc' ? 1 : -1;
            }
            return 0;
          }
        })
      : filteredContracts;
    const paginatedContracts = sortedContracts.slice(
      (pagination.current - 1) * pagination.pageSize,
      pagination.current * pagination.pageSize
    );
  
    function formatCurrency(amount) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);
    }
  
    function formatDate(dateString) {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US').format(date);
    }
    
     function getEmbedUrl(url) {
      // Use regex to extract YouTube video ID from the given URL
      const videoIdRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?/;
      const match = url.match(videoIdRegex);
    
      // Extract the timestamp parameter from the URL
      const timestampRegex = /[?&]t=(\d+)/;
      const timestampMatch = url.match(timestampRegex);
      const timestamp = timestampMatch ? timestampMatch[1] : null;
    
      if (match && match[1]) {
        // If the video ID is found, return the embed URL
        let embedUrl = 'https://www.youtube.com/embed/' + match[1];
    
        // Append the timestamp parameter if it exists
        if (timestamp) {
          embedUrl += '?start=' + timestamp;
        }
    
        return embedUrl;
      } else {
        // If the video ID is not found, return the original URL (or an empty string if it's not a valid URL)
        return url ? url : '';
      }
    }
  

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <Navbar />
      <Container className="bg-gray-900">
      <Row gutter={16}>
      <Col span={12}>
        <h2>Top Contractors</h2>
        <h6>by completion %</h6>
        <List
          dataSource={[
            { name: 'n00bman', rank: 1 },
            { name: 'Assassin78', rank: 2 },
            { name: 'MemeLord72', rank: 3 },
          ]}
          renderItem={item => (
            <List.Item>
              <span>{item.rank}. {item.name}</span>
            </List.Item>
          )}
        />
      </Col>
      <Col span={12}>
      <div style={{ textAlign: 'right' }}>
        <h2>Top Producer</h2>
        <h6>by completion %</h6>
        <List
          dataSource={[
            { name: 'catpissqueen', rank: 1 },
            { name: 'thundergunexpress', rank: 2 },
            { name: 'l33t af', rank: 3 },
          ]}
          renderItem={item => (
            <List.Item style={{ justifyContent: 'flex-end', display: 'flex' }}> {/* Apply style to List.Item */}
              <span>{item.rank}. {item.name}</span>
            </List.Item>
          )}
        />
        </div>
      </Col>
    </Row>
        <h1 className="text-3xl font-bold mb-8 text-center">Completed Hit Feed</h1>

        <div className="mb-4">
          <Input
            className="bg-gray-700 border-gray-600 focus:border-blue-500 focus:ring-blue-500 text-white"
            placeholder="Search by game name"
            onChange={handleSearch}
          />
        </div>
        <Table
          data={paginatedContracts.map((contract) => ({
            ...contract,
            bidAmount: formatCurrency(contract.bidAmount.N),
          }))}
          columns={[
            { title: 'The Hit', dataIndex: 'verifyLink', sorter: true, render: (src) => <iframe
              width="100%"
              height="100"
              src={getEmbedUrl(src.S)}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe> },
            { title: 'Conditions', dataIndex: 'contractConditions', sorter: true },
            { title: 'Payout', dataIndex: 'bidAmount', sorter: true },
            { title: 'Mark', dataIndex: 'targetPlayer', sorter: true },
            { title: 'Game', dataIndex: 'gameTitle', sorter: true },
          ]}
          onRow={(record) => ({ onClick: () => handleViewContract(record) })}
          pagination={{
            pageSize: pagination.pageSize,
            total: filteredContracts.length,
            current: pagination.current,
            onChange: handlePaginationChange,
          }}
          sort={sort}
          onSortChange={(newSort) => setSort(newSort)}
        />
        <Spacer y={2} />
        <Modal open={show} onClose={handleClose} size="large">
          <Modal.Title>Contract Details</Modal.Title>
          <Modal.Content>
            <Text h5>Game Name:</Text>
            <Text>{selectedContract?.gameTitle?.S}</Text>
            <Text h5>Target Player:</Text>
            <Text>{selectedContract?.targetPlayer?.S}</Text>
            <Text h5>Contract Conditions</Text>
            <Text>{selectedContract?.contractConditions?.S}</Text>
            <Text h5>Proof of Hit</Text>
            <Text>{selectedContract?.verifyLink?.S}</Text>
            <Text h5>Bid Amount:</Text>
            <Text>{selectedContract && formatCurrency(selectedContract.bidAmount?.N)}</Text>
            <Text h5>Expiration Date:</Text>
            <Text>{selectedContract && formatDate(selectedContract.expDate?.S)}</Text>
          </Modal.Content>
          <Modal.Action passive onClick={handleClose}>
            Close
          </Modal.Action>
        </Modal>
      </Container>
    </div>
     );
    }
  
    export default Main;
