import { useEffect, useState } from 'react';
import { Container, Table, Pagination, Spinner, Modal, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import 'tailwindcss/tailwind.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../components/Navbar';

function GetContracts() {
  const [contracts, setContracts] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sort, setSort] = useState({ field: '', order: '' });
  const [show, setShow] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/readContracts');
        console.log('Contracts data:', response.data.data);
        const filteredData = response.data.data.filter(
          (contract) => contract.contractStatus?.S === 'open'
        );
        setContracts(filteredData);
      } catch (error) {
        console.error('Error fetching contracts', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData(); // Added this line
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

  function handleOk() {
    handleClose();
  }

  function handleClose() {
    setSelectedContract(null);
    setShow(false);
    setSuccessMessage('');
    setErrorMessage('');
  }

  function handleCloseCreateForm() {
    setShowCreateForm(false);
    setSuccessMessage('');
    setErrorMessage('');
  }

  async function handleCreate(contract) {
    try {
      const response = await axios.post('/api/writeContracts', {
        gameTitle: contract.gameTitle,
        targetPlayer: contract.targetPlayer,
        contractConditions: contract.contractConditions,
        expDate: contract.expDate,
        bidAmount: contract.bidAmount,
        acceptedby: contract.acceptedBy,
        verifyLink: contract.verifyLink,
        isVerified: contract.isVerified,
        contractStatus: contract.contractStatus
      });

      console.log(response.data.data);
      setContracts([...contracts, response.data.data]);
      setSuccess(true);
    } catch (error) {
      console.error('Error creating contract', error);
      setSuccess(false);
    }
  }

  function CreateContractForm({ show, handleClose, handleCreate }) {
  const [gameTitle, setgameTitle] = useState('');
  const [targetPlayer, setTargetPlayer] = useState('');
  const [contractConditions, setContractConditions] = useState('');
  const [expDate, setExpDate] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  
    const handleFormSubmit = (event) => {
      event.preventDefault();
      console.log('handleFormSubmit called');
      handleCreate({
        gameTitle,
        targetPlayer,
        contractConditions,
        expDate,
        bidAmount,
        acceptedBy: 'create',
        verifyLink: 'create',
        isVerified: 'false',
        contractStatus: 'open',
        });
      setShowCreateForm(false);
    };

    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create Contract</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group controlId="gameTitle">
              <Form.Label>Game Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Which game does their character live in?"
                value={gameTitle}
                onChange={(event) => setgameTitle(event.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="targetPlayer">
              <Form.Label>Target Player</Form.Label>
              <Form.Control
                type="text"
                placeholder="What is the name of your target?"
                value={targetPlayer}
                onChange={(event) => setTargetPlayer(event.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="expDate">
              <Form.Label>Expiriation Date</Form.Label>
              <Form.Control
                type="text"
                placeholder="When will this contract expire?"
                value={expDate}
                onChange={(event) => setExpDate(event.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="contractConditions">
              <Form.Label>Conditions</Form.Label>
              <Form.Control
                type="text"
                placeholder="Are there any additional requirements? (under 100char)"
                value={contractConditions}
                onChange={(event) => setContractConditions(event.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="bidAmount">
              <Form.Label>Bid Amount</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter bid amount"
                value={bidAmount}
                onChange={(event) => setBidAmount(event.target.value)}
              />
            </Form.Group>
            <Form.Group>
              ---
            </Form.Group>
            <Button variant="primary" type="submit">
              Create
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
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
  
  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <Navbar />
      <CreateContractForm show={showCreateForm} handleClose={handleCloseCreateForm} handleCreate={handleCreate} />
      <Container className="bg-gray-900">
        <div className="text-center my-4">
            {successMessage && (
            <div className="alert alert-success" role="alert">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}
        </div>
        <h1 className="text-3xl font-bold mb-8 text-center">Open Contracts</h1>
        <CreateContractForm
          show={showCreateForm}
          handleClose={handleCloseCreateForm}
          handleCreate={handleCreate}
        />

        <Form className="mb-4">
          <Form.Group controlId="search">
            <Form.Control
              className="bg-gray-700 border-gray-600 focus:border-blue-500 focus:ring-blue-500 text-white"
              type="text"
              placeholder="Search by game title"
              onChange={handleSearch}
            />
          </Form.Group>
        </Form>
        <Table responsive bordered hover variant="dark">
          <thead>
            <tr>
              <th className="cursor-pointer" onClick={() => handleSort('gameTitle')}>Game {sort.field === 'gameTitle' && (sort.order === 'asc' ? '↑' : '↓')}</th>
              <th className="cursor-pointer" onClick={() => handleSort('targetPlayer')}>The Mark {sort.field === 'targetPlayer' && (sort.order === 'asc' ? '↑' : '↓')}</th>
              <th className="cursor-pointer" onClick={() => handleSort('bidAmount')}>Contract Value {sort.field === 'bidAmount' && (sort.order === 'asc' ? '↑' : '↓')}</th>
              <th className="cursor-pointer" onClick={() => handleSort('contractConditions')}>Conditions {sort.field === 'contractConditions' && (sort.order === 'asc' ? '↑' : '↓')}</th>
              <th>Grab a Contract!</th>
            </tr>
          </thead>
          <tbody>
            {paginatedContracts.map((contract) => (
              <tr key={contract.id.S}>
                <td>{contract.gameTitle.S}</td>
                <td>{contract.targetPlayer.S}</td>
                <td> {formatCurrency(contract.bidAmount.N)}</td> {/* Changed this line */}
                <td>{contract.contractConditions.S}</td>
                <td>
                  <h3>button here</h3>
                </td>
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
        <div className="mt-4 mb-4 text-center">
        <Button
        variant="primary"
        onClick={() => setShowCreateForm(!showCreateForm)}
        className="text-xl px-8 py-2 rounded-lg" // Added classes for bigger and dynamic button
      >
        Create Contract
      </Button>
        </div>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Contract Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5>Game Title:</h5>
            <p>{selectedContract?.gameTitle.S}</p>
            <h5>Target Player:</h5>
            <p>{selectedContract?.targetPlayer.S}</p>
            <h5>Conditions:</h5>
            <p>{selectedContract?.contractConditions.S}</p>
            <h5>Expiriation Date:</h5>
            <p>{selectedContract?.expDate.S}</p>
            <h5>Bid Amount:</h5>
            <p>${selectedContract?.bidAmount.N}</p>
           </Modal.Body>
           <Modal.Footer>
  <Button variant="secondary" onClick={handleClose}>
    Close
  </Button>
  </Modal.Footer>
        </Modal>
      </Container>
      <style global jsx>{`
        .modal-content,
        .form-control {
          background-color: #1f2937;
          color: #ffffff;
        }
        .alert-success {
          background-color: #10b981;
          color: #ffffff;
        }
        .alert-danger {
          background-color: #ef4444;
          color: #ffffff;
        }
        table thead th {
          cursor: pointer;
          font-weight: 600;
          text-transform: uppercase;
        }
        table tbody tr:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
}

export default GetContracts;