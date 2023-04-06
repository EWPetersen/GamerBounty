import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import 'tailwindcss/tailwind.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function CreateContractForm({ show, handleClose }) {
  const [gameTitle, setgameTitle] = useState('');
  const [targetPlayer, setTargetPlayer] = useState('');
  const [contractConditions, setContractConditions] = useState('');
  const [expDate, setExpDate] = useState('');
  const [bidAmount, setBidAmount] = useState('');

  if (!show) {
    return null;
  }

  async function handleCreate(contract) {
    try {
      const response = await axios.post('/api/writeContracts', {
        gameTitle: contract.gameTitle,
        targetPlayer: contract.targetPlayer,
        contractConditions: contract.contractConditions,
        expDate: contract.expDate,
        bidAmount: contract.bidAmount,
        requestedby: contract.requestedBy,
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
      const handleFormSubmit = (event) => {
        event.preventDefault();
        console.log('handleFormSubmit called');
        handleCreate({
          gameTitle,
          targetPlayer,
          contractConditions,
          expDate,
          bidAmount,
          requestedBy: 'eric.p.mail@gmail.com',
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
            <Button variant="success" type="submit">
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
    </>
  );
}

export default CreateContractForm;
