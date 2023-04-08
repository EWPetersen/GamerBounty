import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import { useSession } from "next-auth/react";
import axios from 'axios';
import 'tailwindcss/tailwind.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { fetchGameSuggestions } from '../pages/api/getTitleValidation';
import DateTimePicker from 'react-datetime-picker';

function CreateContractForm({ show, handleClose }) {
  const [gameTitle, setGameTitle] = useState('');
  const [targetPlayer, setTargetPlayer] = useState('');
  const [contractConditions, setContractConditions] = useState('');
  const [expDate, setExpDate] = useState(new Date());
  const [bidAmount, setBidAmount] = useState('');
  const [submitStatus, setSubmitStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { data: session, status } = useSession();
  const [gameSuggestions, setGameSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const gameTitleInputRef = useRef(null);

  if (!show) {
    return null;
  }

  if (status === "loading") return null; // Do not render anything while the session is loading
  if (!session) {
    return (
      <Alert variant="danger">
        You must be signed in to create a contract.
      </Alert>
    );
  }

  if (!show) {
    return null;
  }

  useEffect(() => {
    if (gameTitle.length <= 2) {
      setShowSuggestions(false);
      return;
    }
  
    const fetchSuggestions = async () => {
      const suggestions = await fetchGameSuggestions(gameTitle);
      setGameSuggestions(suggestions);
      setShowSuggestions(true);
    };
  
    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [gameTitle]);
  
  const handleSuggestionClick = (suggestedTitle) => {
    setGameTitle(suggestedTitle);
    setShowSuggestions(false);
  };
  
  const handleClickOutside = (event) => {
    if (gameTitleInputRef.current && !gameTitleInputRef.current.contains(event.target)) {
      setShowSuggestions(false);
    }
  };
  
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  async function handleCreate(contract) {
    try {
      console.log('Request data:', contract); // Log the request data
      const response = await axios.post('/api/writeContracts', {
        gameTitle: contract.gameTitle,
        targetPlayer: contract.targetPlayer,
        contractConditions: contract.contractConditions,
        expDate: contract.expDate,
        bidAmount: contract.bidAmount,
        requestedBy: contract.requestedBy,
        contractStatus: contract.contractStatus,
      });

      console.log(response.data.data);
      setLoading(false);
      setSubmitStatus('success');
      setTimeout(() => {
        handleClose(); // Close the form after a short delay
      }, 2000);
    } catch (error) {
      setLoading(false);
      setSubmitStatus('failure');
      console.error('Error creating contract', error);
    }
  }    
  
  const handleFormSubmit = (event) => {
    event.preventDefault();
    console.log('handleFormSubmit called');
    handleCreate({
      gameTitle,
      targetPlayer,
      contractConditions,
      expDate,
      bidAmount,
      requestedBy: session.user.email,
      contractStatus: 'open',
      });
      setShowCreateForm(false);
      };
      
      return (
      <>
      <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
      <Modal.Title>Create Contract</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      {submitStatus === 'success' && (
      <Alert variant="success">Contract successfully created!</Alert>
      )}
      {submitStatus === 'failure' && (
      <Alert variant="danger">Failed to create contract. Please try again.</Alert>
      )}
      <Form onSubmit={handleFormSubmit}>
      <Form.Group controlId="gameTitle" ref={gameTitleInputRef}>
                <Form.Label>Game:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Which game does their character live in?"
                  value={gameTitle}
                  onChange={(event) => setGameTitle(event.target.value)}
                />
                {showSuggestions && (
                  <div className="absolute mt-2 w-full bg-white border border-gray-300 rounded-md shadow z-10">
                    {gameSuggestions.map((suggestion, index) => (
                      <p
                        key={index}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                        onClick={() => handleSuggestionClick(suggestion.name)}
                      >
                        {suggestion.name}
                      </p>
                    ))}
                  </div>
                )}
              </Form.Group>
              <Form.Group controlId="targetPlayer">
                <Form.Label>Mark:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Who is your target?"
                  value={targetPlayer}
                  onChange={(event) => setTargetPlayer(event.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="expDate">
                <Form.Label>Expiriation:</Form.Label>
                <DateTimePicker
                  onChange={setExpDate}
                  value={expDate}
                  disablePast={true}
                  format="dd/MM/yyyy hh:mm:ss a"
                  />
                  </Form.Group>    
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="success" onClick={handleFormSubmit}>
                  Create
                </Button>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          </>
          );
          }
          
          export default CreateContractForm;
