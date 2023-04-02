import { useEffect, useState } from 'react';
import { Container, Table, Pagination, Spinner, Modal, Form, Button } from 'react-bootstrap';
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import axios from 'axios';
import 'tailwindcss/tailwind.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../components/Navbar';

function GetContracts() {
  const { data: session, status } = useSession();
  const router = useRouter();
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
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [requestedContracts, setRequestedContracts] = useState([]);
  
  const requestedPagination = {
    current: 1,
    pageSize: 10,
  };

  const acceptedPagination = {
    current: 1,
    pageSize: 10,
  };const [acceptedContracts, setAcceptedContracts] = useState([]);

  const paginatedRequestedContracts = requestedContracts.slice(
    (requestedPagination.current - 1) * requestedPagination.pageSize,
    requestedPagination.current * requestedPagination.pageSize
  );
  
  const paginatedAcceptedContracts = acceptedContracts.slice(
    (acceptedPagination.current - 1) * acceptedPagination.pageSize,
    acceptedPagination.current * acceptedPagination.pageSize
  ); 

  useEffect(() => {
    if (session) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await axios.get('/api/readContracts');
          console.log('Contracts data:', response.data.data);
  
          const requestedData = response.data.data.filter(
            (contract) => contract.requestedBy?.S === 'eric.p.mail@gmail.com'
          );
          setRequestedContracts(requestedData);
  
          const acceptedData = response.data.data.filter(
            (contract) => contract.acceptedBy?.S === 'eric.p.mail@gmail.com'
          );
          setAcceptedContracts(acceptedData);
  
        } catch (error) {
          console.error('Error fetching contracts', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }
  }, [session]);
  

if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen text-white text-center">
        <Navbar />
        <h1 className="text-3xl font-bold mt-8">Loading...</h1>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="bg-gray-900 min-h-screen text-white text-center">
        <Navbar />
        <h1 className="text-3xl font-bold mt-8">Please sign in</h1>
        <button
          onClick={() => signIn()}
          className="text-xl px-8 py-2 rounded-lg mt-4 bg-blue-600 text-white"
        >
          Sign In
        </button>
      </div>
    );
  }

  const handleReviewClick = (contract) => {
    setModalVisible(true);
    setSelectedContract(contract);
  };
  

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

  async function handleAcceptContract(contract) {
    setSelectedContract(contract);
    setShow(true);
    await handleAccept();
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

  async function handleAccept() {
    try {
      const response = await axios.post('/api/updateContracts', {
        id: selectedContract?.id.S,
        gameTitle: selectedContract?.gameTitle.S,
        targetPlayer: selectedContract?.targetPlayer.S,
        contractConditions: selectedContract?.contractConditions.S,
        expDate: selectedContract?.expDate.S,
        bidAmount: selectedContract?.bidAmount.N,
        acceptedBy: 'accepted',
        verifyLink: selectedContract?.verifyLink.S,
        isVerified: 'false',
        contractStatus: 'accepted',
                
      });
      console.log(response.data.data);
      const newContracts = contracts.map((contract) => {
        if (contract.id.S === selectedContract.id.S) {
          return { ...contract, contractStatus: { S: 'accepted' } };
        } else {
          return contract;
        }
      });
      setContracts(newContracts);
      setSelectedContract(null);
      setShow(false);
      setSuccess(true);
    } catch (error) {
      console.error('Error updating contract', error);
      setSelectedContract(null);
      setShow(false);
      setSuccess(false);
    }
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

  const handleVerify = () => {
    // 1. Call the API or database function to update the "isVerified" boolean to 'true' for the selected contract
    // 2. Update the local state (requestedContracts) with the updated contract information
    // 3. Close the modal by calling `handleClose()`
  };

  const handleReject = () => {
    // 1. Call the API or database function to update the "isVerified" boolean to 'true' for the selected contract
    // 2. Update the local state (requestedContracts) with the updated contract information
    // 3. Close the modal by calling `handleClose()`
  };
  
 
  return (
       <div className="bg-gray-900 min-h-screen text-white">
      <Navbar />
      <Container className="bg-gray-900">
      <h1 className="text-3xl font-bold mb-8 text-center">Profile</h1>
      <div>
        <h3 className="text-center"> Manage Contracts</h3>
        </div>
      <h1 className="text-3xl font-bold mb-8 text-left">My Contracts</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
            <h3>Total Hits Completed</h3>
                <p>0</p> {/* Replace with the actual amount when you have the database code */}
        </div>
        <div>
            <h3>Contract rating</h3>
                <p>0%</p> {/* Replace with the actual rating when you have the database code */}
                </div>
        </div>
        
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
        <Table data={requestedContracts} responsive bordered hover variant="dark">
          <thead>
            <tr>
            <th className="cursor-pointer" onClick={() => handleSort('gameTitle')}>Game {sort.field === 'gameTitle' && (sort.order === 'asc' ? '↑' : '↓')}</th>
              <th className="cursor-pointer" onClick={() => handleSort('targetPlayer')}>The Mark {sort.field === 'targetPlayer' && (sort.order === 'asc' ? '↑' : '↓')}</th>
              <th className="cursor-pointer" onClick={() => handleSort('bidAmount')}>Contract Value {sort.field === 'bidAmount' && (sort.order === 'asc' ? '↑' : '↓')}</th>
              <th className="cursor-pointer" onClick={() => handleSort('contractConditions')}>Conditions {sort.field === 'contractConditions' && (sort.order === 'asc' ? '↑' : '↓')}</th>
              <th className="cursor-pointer" onClick={() => handleSort('expDate')}>Contract Expires {sort.field === 'expDate' && (sort.order === 'asc' ? '↑' : '↓')}</th>
              <th>Review</th>
            </tr>
          </thead>
          <tbody>
          {paginatedRequestedContracts.map((contract) => (
              <tr key={contract.id.S}>
                <td>{contract.gameTitle.S}</td>
                <td>{contract.targetPlayer.S}</td>
                <td> {(contract.bidAmount.N)}</td> 
                <td>{contract.contractConditions.S}</td>
                <td>{contract.expDate.S}</td>
                <td>
                <Button onClick={() => handleReviewClick(contract)}>Review</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div className="d-flex justify-content-center">
          <Pagination className="my-4">
  <Pagination.Prev
    onClick={() =>
      requestedPagination.current > 1 &&
      setRequestedPagination({ ...requestedPagination, current: requestedPagination.current - 1 })
    }
  />
  {[...Array(Math.ceil(requestedContracts.length / requestedPagination.pageSize))].map((x, i) => (
    <Pagination.Item
      key={i + 1}
      active={i + 1 === requestedPagination.current}
      onClick={() => setRequestedPagination({ ...requestedPagination, current: i + 1 })}
    >
      {i + 1}
    </Pagination.Item>
  ))}
  <Pagination.Next
    onClick={() =>
      requestedPagination.current < Math.ceil(requestedContracts.length / requestedPagination.pageSize) &&
      setRequestedPagination({ ...requestedPagination, current: requestedPagination.current + 1 })
    }
  />
</Pagination>
          </div>
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
        <h1 className="text-3xl font-bold mb-8 text-left">My Jobs</h1>
        <Form className="mb-4">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
                <h3>Money made from hits</h3>
                    <p>$0.00</p> {/* Replace with the actual amount when you have the database code */}
            </div>
            <div>
                <h3>Assassin rating</h3>
                    <p>0%</p> {/* Replace with the actual rating when you have the database code */}
            </div>
        </div>
          <Form.Group controlId="search">
            <Form.Control
              className="bg-gray-700 border-gray-600 focus:border-blue-500 focus:ring-blue-500 text-white"
              type="text"
              placeholder="Search by game title"
              onChange={handleSearch}
            />
          </Form.Group>
        </Form>
        <Table data={acceptedContracts} responsive bordered hover variant="dark">
          <thead>
            <tr>
              <th className="cursor-pointer" onClick={() => handleSort('gameTitle')}>Game {sort.field === 'gameTitle' && (sort.order === 'asc' ? '↑' : '↓')}</th>
              <th className="cursor-pointer" onClick={() => handleSort('targetPlayer')}>The Mark {sort.field === 'targetPlayer' && (sort.order === 'asc' ? '↑' : '↓')}</th>
              <th className="cursor-pointer" onClick={() => handleSort('bidAmount')}>Contract Value {sort.field === 'bidAmount' && (sort.order === 'asc' ? '↑' : '↓')}</th>
              <th className="cursor-pointer" onClick={() => handleSort('contractConditions')}>Conditions {sort.field === 'contractConditions' && (sort.order === 'asc' ? '↑' : '↓')}</th>
              <th className="cursor-pointer" onClick={() => handleSort('expDate')}>Contract Expires {sort.field === 'expDate' && (sort.order === 'asc' ? '↑' : '↓')}</th>
              <th>Submit Proof</th>
            </tr>
          </thead>
          <tbody>
            {paginatedAcceptedContracts.map((contract) => (
              <tr key={contract.id.S}>
                <td>{contract.gameTitle.S}</td>
                <td>{contract.targetPlayer.S}</td>
                <td> {(contract.bidAmount.N)}</td> 
                <td>{contract.contractConditions.S}</td>
                <td>{contract.expDate.S}</td>
                <td>
                  <Button variant="success" onClick={() => handleAcceptContract(contract)}>Accept</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div className="d-flex justify-content-center">
        <Pagination className="my-4">
  <Pagination.Prev
    onClick={() =>
      acceptedPagination.current > 1 &&
      setAcceptedPagination({ ...acceptedPagination, current: acceptedPagination.current - 1 })
    }
  />
  {[...Array(Math.ceil(acceptedContracts.length / acceptedPagination.pageSize))].map((x, i) => (
    <Pagination.Item
      key={i + 1}
      active={i + 1 === acceptedPagination.current}
      onClick={() => setAcceptedPagination({ ...acceptedPagination, current: i + 1 })}
    >
      {i + 1}
    </Pagination.Item>
  ))}
  <Pagination.Next
    onClick={() =>
      acceptedPagination.current < Math.ceil(acceptedContracts.length / acceptedPagination.pageSize) &&
      setAcceptedPagination({ ...acceptedPagination, current: acceptedPagination.current + 1 })
    }
  />
</Pagination>

          </div>
        <div className="mt-4 mb-4 text-center">
        </div>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Review Contract</Modal.Title>
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
           <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <Button onClick={handleVerify} type="primary">Verify</Button>
                <Button onClick={handleReject} danger>Reject</Button>
                <Button onClick={handleClose}>Close</Button>
            </div>
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