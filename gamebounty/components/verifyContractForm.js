import React, { useState } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import 'tailwindcss/tailwind.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

function VerifyContractForm({ show, handleClose, selectedContract }) {
  const [verifyNotes, setVerifyNotes] = useState('');
  const [submitStatus, setSubmitStatus] = useState(null);
  const [verifyLink, setVerifyLink] = useState('');
  const [loading, setLoading] = useState(false);

  if (!show) {
    return null;
  }

  const submitVerification = async () => {
    setLoading(true);
    try {
      await axios.post('/api/updateContracts', {
        id: selectedContract?.id.S,
        gameTitle: selectedContract?.gameTitle.S,
        acceptedBy: selectedContract?.acceptedBy.S,
        verifyLink: verifyLink,
        isVerified: true,
        verifyNotes: verifyNotes,
        contractStatus: 'verified'
      });
      setLoading(false);
      setSubmitStatus('success');
      setTimeout(() => {
        handleClose(); // Close the form after a short delay
      }, 2000);
    } catch (error) {
      setLoading(false);
      setSubmitStatus('failure');
      console.error('Error updating contract', error);
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    submitVerification();
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} className="bg-gray-900">
        <Modal.Header closeButton>
          <Modal.Title>Verify Contract</Modal.Title>
        </Modal.Header>
        <div className="bg-gray-900">
          <Modal.Body>
            {submitStatus === 'success' && (
              <Alert variant="success">Contract successfully verified!</Alert>
            )}
            {submitStatus === 'failure' && (
              <Alert variant="danger">Failed to verify contract. Please try again.</Alert>
            )}
            <Form onSubmit={handleFormSubmit}>
            <Form.Group controlId="gameTitle">
              <Form.Label>Game</Form.Label>
              <p>{selectedContract?.gameTitle.S}</p>
            </Form.Group>
            <Form.Group controlId="targetPlayer">
              <Form.Label>Target Player</Form.Label>
              <p>{selectedContract?.targetPlayer.S}</p>
            </Form.Group>
            <Form.Group controlId="expDate">
              <Form.Label>Expiriation Date</Form.Label>
              <p>{selectedContract?.expDate.S}</p>
            </Form.Group>
            <Form.Group controlId="contractConditions">
              <Form.Label>Conditions</Form.Label>
              <p>{selectedContract?.contractConditions.S}</p>
            </Form.Group>
            <Form.Group controlId="bidAmount">
              <Form.Label>Bid Amount</Form.Label>
              <p>{selectedContract?.bidAmount.N}</p>
            </Form.Group>
            <Form.Group controlId="verifyLink">
              <Form.Label>Proof Link</Form.Label>
              <Form.Control
                type="string"
                required
                placeholder="YouTube, Twitch, Vimeo - Upload date must be newer than contract date, and 60s or less."
                value={verifyLink}
                onChange={(event) => setVerifyLink(event.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="verifyNotes">
              <Form.Label>Job Notes</Form.Label>
              <Form.Control
                type="string"
                placeholder="Anything interesting about this contract? (under 100char)"
                value={verifyNotes}
                onChange={(event) => setVerifyNotes(event.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify'}
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

export default VerifyContractForm;
