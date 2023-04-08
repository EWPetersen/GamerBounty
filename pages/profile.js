// Import plugins
import React, { useEffect, useState } from 'react';
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import axios from 'axios';

// Import page styling 
import { Container, Table, Pagination, Modal, Form, Button } from 'react-bootstrap';

// Import CSS and Nav stuff
import 'tailwindcss/tailwind.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../components/Navbar';

// Import all the forms the buttons need
import ViewContractForm from '../components/ViewContractForm';
import ReviewContractForm from '../components/ReviewContractForm';
import VerifyContractForm from '../components/VerifyContractForm';

// This is the main function, everything the 'return (' is using is in here somewhere. It is also what is being exported (very last line)  
function Profile() {
  const [requestedContracts, setRequestedContracts] = useState([]);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [contracts, setContracts] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sort, setSort] = useState({ field: '', order: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedContract, setSelectedContract] = useState(null);
  const [showViewForm, setShowViewForm] = useState(false);
  const [selectedViewContract, setSelectedViewContract] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedReviewContract, setSelectedReviewContract] = useState(null);
  const [showVerifyForm, setShowVerifyForm] = useState(false);
  const [selectedVerifyContract, setSelectedVerifyContract] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [acceptedContracts, setAcceptedContracts] = useState([]);
  const [createdSort, setCreatedSort] = useState({ field: '', order: 'asc' });
  const [acceptedSort, setAcceptedSort] = useState({ field: '', order: 'asc' });

  const handleClose = () => {
    setShowModal(false);
    setSelectedContract(null);
  };

  const handleRejectClick = (contract) => {
    console.log(contract);
    setSelectedContract(contract);
    setShowModal(true);
  };
  
  const 
  handleCloseReviewForm = () => {
    setShowReviewForm(false);
    setSelectedContract(null);
  };

   // This button closes the 'Verify Contract' form pop-up
  const handleCloseVerifyForm = () => {
    setShowVerifyForm(false);
    setSelectedContract(null);
  };
  
  const handleCloseViewForm = () => {
    setShowViewForm(false);
    setSelectedContract(null);
  };

  
  // This is the API call that shows contract data to table displays inside the profile page
  useEffect(() => {
    if (session) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await axios.get('/api/readContracts');
          console.log('Contracts data:', response.data.data);
          // This table shows contracts that were created by the logged in user
          const requestedData = response.data.data.filter(
            (contract) =>
              contract.requestedBy?.S === session.user.email &&
              !contract.hasOwnProperty('isDeleted') &&
              (contract.contractStatus?.S === 'open' ||
                contract.contractStatus?.S === 'verified')
          );
          setRequestedContracts(requestedData);
          // This table shows contracts that were accepted by the logged in user
          const acceptedData = response.data.data.filter(
            (contract) =>
              contract.acceptedBy?.S === session.user.email &&
              !contract.hasOwnProperty('isDeleted') &&
              (contract.contractStatus?.S === 'accepted' ||
                contract.contractStatus?.S === 'rejected')
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
  
  
// This tells the page to display a loading bar if the data fetch is taking too long.  No one should be seeing this except under outrageous load
  if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen text-white text-center">
        <Navbar />
        <h1 className="text-3xl font-bold mt-8">Loading...</h1>
      </div>
    );
  };
// This tells the user to sign in, and displays a sign in button if there session doesn't exist
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
  };

// Pagination code
const requestedPagination = {
  current: 1,
  pageSize: 10,
};

// Pagination code
const acceptedPagination = {
  current: 1,
  pageSize: 10,
};

// I'm not sure what this does
   function handlePaginationChange(newPagination) {
    setPagination(newPagination);
  };

// This is the search bar function
  function handleSearch(event) {
    setSearchTerm(event.target.value);
  };

  const handleCreatedSort = (field) => {
    setCreatedSort({
      field,
      order: createdSort.field === field && createdSort.order === 'asc' ? 'desc' : 'asc',
    });
  };
  
  const handleAcceptedSort = (field) => {
    setAcceptedSort({
      field,
      order: acceptedSort.field === field && acceptedSort.order === 'asc' ? 'desc' : 'asc',
    });
  };

  // For requested contracts:
const filteredRequestedContracts = requestedContracts.filter((contract) =>
contract &&
contract.gameTitle.S.toLowerCase().includes(searchTerm.toLowerCase())
);

const sortedRequestedContracts = createdSort.field
  ? filteredRequestedContracts.sort((a, b) => {
      if (createdSort.field === 'bidAmount') {
        const fieldA = parseFloat(a[createdSort.field].N);
        const fieldB = parseFloat(b[createdSort.field].N);
        return createdSort.order === 'asc' ? fieldA - fieldB : fieldB - fieldA;
      } else {
        const fieldA = a[createdSort.field].S.toLowerCase();
        const fieldB = b[createdSort.field].S.toLowerCase();
        if (fieldA < fieldB) {
          return createdSort.order === 'asc' ? -1 : 1;
        }
        if (fieldA > fieldB) {
          return createdSort.order === 'asc' ? 1 : -1;
        }
        return 0;
      }
    })
  : filteredRequestedContracts;

const paginatedRequestedContracts = sortedRequestedContracts.slice(
(requestedPagination.current - 1) * requestedPagination.pageSize,
requestedPagination.current * requestedPagination.pageSize
);

// For accepted contracts:
const filteredAcceptedContracts = acceptedContracts.filter((contract) =>
contract &&
contract.gameTitle.S.toLowerCase().includes(searchTerm.toLowerCase())
);

const sortedAcceptedContracts = acceptedSort.field
  ? filteredAcceptedContracts.sort((a, b) => {
      if (acceptedSort.field === 'bidAmount') {
        const fieldA = parseFloat(a[acceptedSort.field].N);
        const fieldB = parseFloat(b[acceptedSort.field].N);
        return acceptedSort.order === 'asc' ? fieldA - fieldB : fieldB - fieldA;
      } else {
        const fieldA = a[acceptedSort.field].S.toLowerCase();
        const fieldB = b[acceptedSort.field].S.toLowerCase();
        if (fieldA < fieldB) {
          return acceptedSort.order === 'asc' ? -1 : 1;
        }
        if (fieldA > fieldB) {
          return acceptedSort.order === 'asc' ? 1 : -1;
        }
        return 0;
      }
    })
  : filteredAcceptedContracts;

const paginatedAcceptedContracts = sortedAcceptedContracts.slice(
(acceptedPagination.current - 1) * acceptedPagination.pageSize,
acceptedPagination.current * acceptedPagination.pageSize
);
 
const filteredContracts = contracts.filter((contract) =>
  contract &&
  contract.gameTitle.S.toLowerCase().includes(searchTerm.toLowerCase())
);

  // This tells the page to display the bidAmount as USD on the page.  It doesnt seem like it does anything though...
  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

 
  return (
    <div className="bg-gray-900 min-h-screen text-white">
    <Navbar />
    <Container className="bg-gray-900">
     <h1 className="text-3xl font-bold mb-8 text-center">Profile</h1>
      <div>
        <h3 className="text-center">{(session.user.email)}</h3>
      </div>
    <h1 className="text-3xl font-bold mb-8 text-right">My Hits</h1>
    {/*// Put some cool user profile stats here */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
               <div>
            <h6>Contract Creator Rating **</h6>
                <p>Total Closed Contracts: 9</p>
                <p>Completion % : 78</p> 
                <p>Average Time to Payment: 18 hours</p>
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
      {/*// This is the created contracts table */}
      <Table data={requestedContracts} responsive bordered hover variant="dark">
        <thead>
          <tr>
            <th className="cursor-pointer" onClick={() => handleCreatedSort('gameTitle')}>Game {sort.field === 'gameTitle' && (sort.order === 'asc' ? '↑' : '↓')}</th>
            <th className="cursor-pointer" onClick={() => handleCreatedSort('targetPlayer')}>Mark {sort.field === 'targetPlayer' && (sort.order === 'asc' ? '↑' : '↓')}</th>
            <th className="cursor-pointer" onClick={() => handleCreatedSort('bidAmount')}>Current Bid {sort.field === 'bidAmount' && (sort.order === 'asc' ? '↑' : '↓')}</th>
            <th>Action</th>
            <th className="cursor-pointer" onClick={() => handleCreatedSort('expDate')}>Expiriation {sort.field === 'expDate' && (sort.order === 'asc' ? '↑' : '↓')}</th>
          </tr>
        </thead>
        <tbody>
        {paginatedRequestedContracts.map((contract) => (
            <tr key={contract.id.S}>
              <td>{contract.gameTitle.S}</td>
              <td>{contract.targetPlayer.S}</td>
              <td>{(contract.bidAmount.N)}</td> 
               <td>
                {contract.contractStatus.S === 'open' ? (
                  <Button variant="info"
                  onClick={() => {
                    setSelectedViewContract(contract);
                    setShowViewForm(true);
                    console.log('clicked this contract to view:',contract)
                  }}
                >
                  View Contract
                </Button>
                ) : contract.contractStatus.S === 'verified' ? (
                  <Button variant="success"
                    onClick={() => {
                      setSelectedReviewContract(contract);
                      setShowReviewForm(true);
                      console.log('clicked this contract to review:',contract)
                    }}
                  >
                    Approve Proof
                  </Button>
                ) : null}
              </td>
              <td>{contract.expDate.S}</td>
              </tr>
          ))}
        </tbody>
      </Table>

      {/* I'm not sure this is working */}
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
            <h6>Contractor Rating **</h6>
                <p>Total Closed Contracts: 12</p>
                <p>Completion % : 56</p> 
                <p>Average Time to Verified: 32 hours</p>
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
            <th className="cursor-pointer" onClick={() => handleAcceptedSort('gameTitle')}>Game {sort.field === 'gameTitle' && (sort.order === 'asc' ? '↑' : '↓')}</th>
            <th className="cursor-pointer" onClick={() => handleAcceptedSort('targetPlayer')}>Mark {sort.field === 'targetPlayer' && (sort.order === 'asc' ? '↑' : '↓')}</th>
            <th className="cursor-pointer" onClick={() => handleAcceptedSort('bidAmount')}>Current Bid {sort.field === 'bidAmount' && (sort.order === 'asc' ? '↑' : '↓')}</th>
            <th>Action</th>
            <th className="cursor-pointer" onClick={() => handleAcceptedSort('expDate')}>Expiriation {sort.field === 'expDate' && (sort.order === 'asc' ? '↑' : '↓')}</th>
            </tr>
        </thead>
        <tbody>
          {paginatedAcceptedContracts.map((contract) => (
            <tr key={contract.id.S}>
              <td>{contract.gameTitle.S}</td>
              <td>{contract.targetPlayer.S}</td>
              <td>{(contract.bidAmount.N)}</td> 
              <td>
                {contract.contractStatus.S === 'accepted' ? (
                    <Button variant="warning"
                    onClick={() => {
                      setSelectedVerifyContract(contract);
                      setShowVerifyForm(true);
                      console.log('clicked this contract to submit proof',contract)
                    }}
                  >
                    Submit Proof
                  </Button>
                ) : contract.contractStatus.S === 'rejected' ? (
                  <Button variant="danger" onClick={() => handleRejectClick(contract)}>
                  Rejected!
                </Button>
                ) : null}
              </td>
              <td>{contract.expDate.S}</td>
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
      </Container>
      <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Rejected Contract</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{selectedContract?.rejectReason.S}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
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
        <ReviewContractForm
          show={showReviewForm}
          handleClose={handleCloseReviewForm}
          setShowReviewForm={setShowReviewForm}
          selectedContract={selectedReviewContract}
          setSelectedContract={setSelectedReviewContract}
        />
        <VerifyContractForm
          show={showVerifyForm}
          handleClose={handleCloseVerifyForm}
          setShowForm={setShowVerifyForm}
          selectedContract={selectedVerifyContract}
          setSelectedContract={setSelectedVerifyContract}
        />
        <ViewContractForm
          show={showViewForm}
          handleClose={handleCloseViewForm}
          selectedContract={selectedViewContract}
        />

    </div>
  );

}

export default Profile;