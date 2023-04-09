import React, { useState } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import { useSession } from "next-auth/react";
import axios from 'axios';
import 'tailwindcss/tailwind.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function CreateContractForm({ show, handleClose }) {
  const [gameTitle, setgameTitle] = useState('');
  const [targetPlayer, setTargetPlayer] = useState('');
  const [contractConditions, setContractConditions] = useState('');
  const [expDate, setExpDate] = useState('');
  const [ingameCurrency, setIngameCurrency] = useState(true);
  const [gameCurrencyDenom, setGameCurrencyDenom] = useState('');
  const [gameCurrencyAmount, setGameCurrencyAmount] = useState('');
  const [submitStatus, setSubmitStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { data: session, status } = useSession();

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

  async function handleCreate(contract) {
    try {
      console.log('Request data:', contract); // Log the request data
      const response = await axios.post('/api/writeContracts', {
        gameTitle: contract.gameTitle,
        targetPlayer: contract.targetPlayer,
        contractConditions: contract.contractConditions,
        expDate: contract.expDate,
        ingameCurrency: contract.ingameCurrency,
        gameCurrencyDenom: contract.gameCurrencyDenom,
        gameCurrencyAmount: contract.gameCurrencyAmount,
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
      ingameCurrency,
      gameCurrencyDenom,
      gameCurrencyAmount,
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
                <Form.Group controlId="gameTitle">
                  <Form.Label>Game: </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Which game does their character live in?"
                    value={gameTitle}
                    onChange={(event) => setgameTitle(event.target.value)}
                  />
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
                    <DatePicker
                      id="expDate"
                      name="expirationDate"
                      selected={expDate}
                      onChange={date => setExpDate(date)}
                      className="form-control"
                      calendarClassName="dark-calendar"
                      minDate={new Date()}
                    />
                </Form.Group>
                <Form.Group controlId="contractConditions">
                  <Form.Label>Conditions:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Are there any additional requirements? (under 100char)"
                    value={contractConditions}
                    onChange={(event) => setContractConditions(event.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="bidType">
                  <Form.Label>Choose bid type</Form.Label>
                  <Form.Check
                    type="radio"
                    label="In-Game Currency"
                    checked={ingameCurrency}
                    onChange={() => setIngameCurrency(true)}
                  />
                  <Form.Check
                    type="radio"
                    label="PayPal"
                    checked={!ingameCurrency}
                    readOnly
                    disabled
                  />
                </Form.Group>
                {ingameCurrency && (
                  <>
                    <Form.Group controlId="gameCurrencyDenom">
                      <Form.Label>Game Currency Denomination:</Form.Label>
                      <Form.Control
                        type="text"
                        maxLength="6"
                        placeholder="Enter currency denomination"
                        value={gameCurrencyDenom}
                        onChange={(event) => setGameCurrencyDenom(event.target.value)}
                      />
                    </Form.Group>
                    <Form.Group controlId="gameCurrencyAmount">
                      <Form.Label>Game Currency Amount:</Form.Label>
                      <Form.Control
                        type="number"
                        maxLength="16"
                        placeholder="Enter currency amount"
                        value={gameCurrencyAmount}
                        onChange={(event) => setGameCurrencyAmount(event.target.value)}
                      />
                    </Form.Group>
                  </>
                )}
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