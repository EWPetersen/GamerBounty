import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import 'tailwindcss/tailwind.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function CreateContractForm({ show, handleClose, handleCreate, setShowCreateForm }) {
  const [gameTitle, setgameTitle] = useState('');
  const [targetPlayer, setTargetPlayer] = useState('');
  const [contractConditions, setContractConditions] = useState('');
  const [expDate, setExpDate] = useState('');
  const [bidAmount, setBidAmount] = useState('');

  if (!show) {
    return null;
  }

  const handleFormSubmit = (event) => {
    event.preventDefault();
    handleCreate({
      gameTitle,
      targetPlayer,
      contractConditions,
      expDate,
      bidAmount,
      acceptedBy: 'create',
      verifyLink: 'create',
      verifyNotes: 'create',
      isVerified: 'false',
      contractStatus: 'open',
    });
    handleClose();
  };

  return (
    <>
    <Modal show={show} onHide={handleClose} className="bg-gray-900">
      <Modal.Header closeButton>
        <Modal.Title>Create Contract</Modal.Title>
      </Modal.Header>
      <div className="bg-gray-900">
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
      </div>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
      <style jsx>{`
        .modal-content {
          --bs-modal-bg: #1f2937;
        }
      `}</style>
    </>
  );
}

export default CreateContractForm;
