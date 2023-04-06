// Import modules
import React, { useEffect, useState } from 'react';
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import axios from 'axios';

// Import page styling 
import { Container, Table, Pagination, Modal, Form, Button } from 'react-bootstrap';

// Import CSS stuff
import 'tailwindcss/tailwind.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Import my navbar
import Navbar from '../components/Navbar';

// Import all the forms the buttons need
import ViewContractForm from '../components/ViewContractForm';
import ReviewContractForm from '../components/ReviewContractForm';
import VerifyContractForm from '../components/VerifyContractForm';

// This is the main function, everything the 'return (' is using is in here somewhere. It is also what is being exported (very last line)  
function Profile() {
  const [requestedContracts, setRequestedContracts] = useState([]);
  const [show, setShow] = useState(false);
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
  const [showVerifyForm, setShowVerifyForm] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  
 
  // Pagination code
  const requestedPagination = {
    current: 1,
    pageSize: 10,
  };

  // Pagination code
  const acceptedPagination = {
    current: 1,
    pageSize: 10,
  };const [acceptedContracts, setAcceptedContracts] = useState([]);
 
  // Theres a crapload of code for pagination, I don't know why
  const paginatedRequestedContracts = requestedContracts.slice(
    (requestedPagination.current - 1) * requestedPagination.pageSize,
    requestedPagination.current * requestedPagination.pageSize
  );
  
  // More pagination code.
  const paginatedAcceptedContracts = acceptedContracts.slice(
    (acceptedPagination.current - 1) * acceptedPagination.pageSize,
    acceptedPagination.current * acceptedPagination.pageSize
  ); 

  // This allows the table to show different buttons depending on the item status in the user created contracts table
  const renderActionButton = (contractStatus) => {
    if (contractStatus === 'open') {
      return (
        <button className="your-button-class">View Contract</button>
      );
    } else if (contractStatus === 'verified') {
      return (
        <button className="your-button-class">Review Proof</button>
      );
    } else {
      return null;
    }
  };

  // These are button actions for marking a form as deleted.  The form itself is stored here in Profile.js down in the return statements -
  // This button brings up the 'View Contract' form pop-up 
  const handleViewContractClick = (contract) => {
    setSelectedContract(contract);
    console.log('Selected contract:', contract);
    setShowViewForm(true);
  };

  // This button closes the 'View Contract' form pop-up
  const handleCloseViewForm = () => {
    setShowViewForm(false);
    setSelectedContract(null);
  };

   // This button sends an API call to updateContracts.js to write 'true' to the 'isDeleted' attribute in the db
   const handleDeleteClick = async () => {
    if (!selectedContract) return;
  
    // Show a confirmation dialog
    const confirmation = window.confirm("Are you sure you want to delete this?");
  
    if (confirmation) {
      try {
        const response = await axios.post('/api/updateContracts', {
          id: selectedContract.id.S,
          gameTitle: selectedContract.gameTitle.S,
          isDeleted: true,
        });
  
        console.log('Delete contract response:', response.data);
  
        if (response.data.status === 'success') {
          setDeleteStatus('success');
          console.log('Contract marked deleted');
  
          // Close the modal and refresh the contracts data
          handleCloseViewForm();
          } else {
          setDeleteStatus('error');
  
          // Display a detailed error message
          alert('Failed to delete contract. Please try again.');
        }
      } catch (error) {
        console.error('Error deleting contract:', error);
        setDeleteStatus('error');
  
        // Display a detailed error message
        alert('Failed to delete contract. Please try again.');
      }
    }
  };
  
 
  // These are button actions for submitting verification links.  This form is from ViewContractForm.js -
  
  // This button brings up the 'Verify Contract' form pop-up 
  const handleVerifyClick = (contract) => {
    setSelectedContract(contract);
    setShowVerifyForm(true);
  };

   // This button closes the 'Verify Contract' form pop-up
  const handleCloseVerifyForm = () => {
    setShowVerifyForm(false);
    setSelectedContract(null);
  };

  const handleReviewProofClick = (contract) => {
    setSelectedContract(contract);
    setShowReviewForm(true);
  };

  const handleCloseReviewForm = () => {
    setShowReviewForm(false);
    setSelectedContract(null);
  };

  const handleApprove = async () => {
    console.log('Approve clicked');
    // Your implementation for approving the contract
  };
  
  const handleReject = async () => {
    console.log('Reject clicked');
    // Your implementation for rejecting the contract
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
            (contract) => contract.requestedBy?.S === 'eric.p.mail@gmail.com'  &&
            !contract.hasOwnProperty('isDeleted') &&
            contract.contractStatus?.S === 'open' ||
            contract.contractStatus?.S === 'verified'
          );
          setRequestedContracts(requestedData);
          // This table shows contracts that were accepted by the logged in user
          const acceptedData = response.data.data.filter(
            (contract) =>
              contract.acceptedBy?.S  === 'eric.p.mail@gmail.com'  &&
              !contract.hasOwnProperty('isDeleted') &&
              contract.contractStatus?.S === 'accepted'
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

// I'm not sure what this does
   function handlePaginationChange(newPagination) {
    setPagination(newPagination);
  };
// This is the search bar function
  function handleSearch(event) {
    setSearchTerm(event.target.value);
  };
// This handles the sorting for the tables
  function handleSort(field) {
    if (sort.field === field) {
      setSort({ ...sort, order: sort.order === 'asc' ? 'desc' : 'asc' });
    } else {
      setSort({ field, order: 'asc' });
    }
  };
 
const filteredContracts = contracts.filter((contract) =>
  contract &&
  contract.gameTitle.S.toLowerCase().includes(searchTerm.toLowerCase())
);

// I have no idea what voodoo is going on here, but it has to do with allowing the fields to be sorted by alphabet or number (from the bid field)
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

  // This tells the page to display the bidAmount as USD on the page.  It doesnt seem like it does anything though...
  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // This is where the page is drawn.  Whatever you see in the browser is in here somewhere.
  return (
    <div className="bg-gray-900 min-h-screen text-white">
    <Navbar />
    <Container className="bg-gray-900">
      <Modal show={showViewForm} onHide={() => setShowViewForm(false)}>
      <Modal.Header closeButton>
        <Modal.Title>View Contract</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ViewContractForm contract={selectedContract} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleDeleteClick}>Delete</Button>
        <Button variant="secondary" onClick={handleCloseViewForm}>Close</Button>
      </Modal.Footer>
      </Modal>
      <Modal show={showVerifyForm} onHide={() => setShowVerifyForm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Verify Contract</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <VerifyContractForm selectedContract={selectedContract} />
        </Modal.Body>
      </Modal>
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
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
        {paginatedRequestedContracts.map((contract) => (
            <tr key={contract.id.S}>
              <td>{contract.gameTitle.S}</td>
              <td>{contract.targetPlayer.S}</td>
              <td>{(contract.bidAmount.N)}</td> 
              <td>{contract.contractConditions.S}</td>
              <td>{contract.expDate.S}</td>
              <td>
                {contract.contractStatus.S === 'open' ? (
                  <Button onClick={() => handleViewContractClick(contract)}>View Contract</Button>
                ) : contract.contractStatus.S === 'verified' ? (
                  <Button onClick={() => handleReviewProofClick(contract)}>Review Proof</Button>
                ) : null}
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
              <td>{(contract.bidAmount.N)}</td> 
              <td>{contract.contractConditions.S}</td>
              <td>{contract.expDate.S}</td>
              <td>
              <Button
                variant="outline-primary"
                className="mr-2"
                onClick={() => handleVerifyClick(contract)}
              >
                Link Your Proof
              </Button>
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
        <VerifyContractForm
          show={showVerifyForm}
          handleClose={handleCloseVerifyForm}
          setShow={setShow}
          setShowVerifyForm={setShowVerifyForm}
          selectedContract={selectedContract}
          setSelectedContract={setSelectedContract}
        />
        <ViewContractForm
          show={showViewForm}
          handleClose={handleCloseViewForm}
          setShow={setShow}
          setShowViewForm={setShowViewForm}
          selectedContract={selectedContract}
          setSelectedContract={setSelectedContract}
        />
        <ReviewContractForm
        show={showReviewForm}
        handleClose={handleCloseReviewForm}
        setShow={setShow}
        setShowReviewForm={setShowReviewForm}
        selectedContract={selectedContract} 
        setSelectedContract={setSelectedContract}
      />
    </div>
  );

}

export default Profile;