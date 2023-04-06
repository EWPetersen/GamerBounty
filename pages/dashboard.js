import { useEffect, useState } from 'react';
import { Container, Table, Pagination, Spinner, Modal, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import 'tailwindcss/tailwind.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../components/Navbar';
import { Row, Col, List } from 'antd';

function ClosedContracts() {
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
          const fieldA = parseFloat(a[sort.field].S);
          const fieldB = parseFloat(b[sort.field].S);
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
  
  function getYoutubeEmbedUrl(url) {
    const regex = /(?:https?:\/\/)?(?:www\.)?youtu(?:\.be\/|be\.com\/watch\?v=)([\w-]{11})/;
    const match = url.match(regex);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    return null;
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
        <h1 className="text-3xl font-bold mb-8 text-center">Contract Feed</h1>
  
        <Form className="mb-4">
          <Form.Group controlId="search">
            <Form.Control
              className="bg-gray-700 border-gray-600 focus:border-blue-500 focus:ring-blue-500 text-white"
              type="text"
              placeholder="Search by game name"
              onChange={handleSearch}
            />
          </Form.Group>
        </Form>
        <Table responsive bordered hover variant="dark">
          <thead>
            <tr>
              <th className="cursor-pointer" onClick={() => handleSort('gameTitle')}>Game {sort.field === 'gameTitle' && (sort.order === 'asc' ? '↑' : '↓')}</th>
              <th className="cursor-pointer" onClick={() => handleSort('verifyLink')}>Proof of Hit{sort.field === 'verifyLink' && (sort.order === 'asc' ? '↑' : '↓')}</th>
              <th className="cursor-pointer" onClick={() => handleSort('targetPlayer')}>The Mark{sort.field === 'targetPlayer' && (sort.order === 'asc' ? '↑' : '↓')}</th>
              <th className="cursor-pointer" onClick={() => handleSort('contractConditions')}>Contract Conditions{sort.field === 'contractConditions' && (sort.order === 'asc' ? '↑' : '↓')}</th>
              <th className="cursor-pointer" onClick={() => handleSort('bidAmount')}>Contract Value {sort.field === 'bidAmount' && (sort.order === 'asc' ? '↑' : '↓')}</th>
              
            </tr>
          </thead>
          <tbody>
            {paginatedContracts.map((contract) => (
              <tr key={contract.id.S}>
                <td>{contract.gameTitle.S}</td>
                <td>
                    {contract.verifyLink && (
                      <iframe
                        width="100%"
                        height="100"
                        src={getYoutubeEmbedUrl(contract.verifyLink.S)}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    )}
                  </td>
                <td>{contract.targetPlayer.S}</td>
                <td>{contract.contractConditions.S}</td>
                <td>{formatCurrency(contract.bidAmount.N)}</td>
                {/*<td>
                <Button variant="info" onClick={() => handleViewContract(contract)}>View Contract</Button>
                </td>*/}
              </tr>
            ))}
          </tbody>
        </Table>
        <div className="d-flex justify-content-center">
          <Pagination className="my-4">
            <Pagination.Prev
              onClick={() =>
                pagination.current > 1 &&
                setPagination({ ...pagination, current: pagination.current - 1 })
              }
            />
            {[...Array(Math.ceil(filteredContracts.length / pagination.pageSize))].map((x, i) => (
              <Pagination.Item
                key={i + 1}
                active={i + 1 === pagination.current}
                onClick={() => setPagination({ ...pagination, current: i + 1 })}
              >
                {i + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() =>
                pagination.current < Math.ceil(filteredContracts.length / pagination.pageSize) &&
                setPagination({ ...pagination, current: pagination.current + 1 })
              }
            />
          </Pagination>
        </div>
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Contract Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5>Game Name:</h5>
                <p>{selectedContract?.gameTitle?.S}</p>
                <h5>Target Player:</h5>
                <p>{selectedContract?.targetPlayer?.S}</p>
                <h5>Contract Conditions</h5>
                <p>{selectedContract?.contractConditions?.S}</p>
                <h5>Proof of Hit</h5>
                <p>{selectedContract?.verifyLink?.S}</p>
                <h5>Bid Amount:</h5>
                <p>{selectedContract && formatCurrency(selectedContract.bidAmount?.N)}</p>
                <h5>Expiration Date:</h5>
                <p>{selectedContract && formatDate(selectedContract.expDate?.S)}</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </Container>
      </div>
    );
  }

  export default ClosedContracts;
