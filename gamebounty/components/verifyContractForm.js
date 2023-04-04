import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import 'tailwindcss/tailwind.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function VerifyContractForm({ show, handleClose, handleVerify, setShowVerifyForm, selectedContract }) {
  const [gameTitle, setgameTitle] = useState('');
  const [targetPlayer, setTargetPlayer] = useState('');
  const [contractConditions, setContractConditions] = useState('');
  const [expDate, setExpDate] = useState('');
  const [verifyNotes, setVerifyNotes] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [submitStatus, setSubmitStatus] = useState(null);
  const [verifyLink, setVerifyLink] = useState('');

  if (!show) {
    return null;
  }

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const isSuccess = true;
    if (isSuccess) {
        setSubmitStatus('success');
        setTimeout(() => {
          handleVerify({
            gameTitle,
            targetPlayer,
            contractConditions,
            expDate,
            bidAmount,
            acceptedBy: 'verify',
            verifyLink,
            verifyNotes,
            isVerified: 'false',
            contractStatus: 'open',
          });
          handleClose();
          setSubmitStatus(null);
        }, 2000);
      } else {
        setSubmitStatus('failure');
        setTimeout(() => {
          setSubmitStatus(null);
        }, 2000);
      }
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
              <Form.Control
                type="text"
                readOnly
                value={selectedContract?.gameTitle.S}
              />
            </Form.Group>
            <Form.Group controlId="targetPlayer">
              <Form.Label>Target Player</Form.Label>
              <Form.Control
                type="text"
                readOnly
                value={selectedContract?.targetPlayer.S}
              />
            </Form.Group>
            <Form.Group controlId="expDate">
              <Form.Label>Expiriation Date</Form.Label>
              <Form.Control
                type="text"
                readOnly
                value={selectedContract?.expDate.S}
              />
            </Form.Group>
            <Form.Group controlId="contractConditions">
              <Form.Label>Conditions</Form.Label>
              <Form.Control
                type="text"
                readOnly
                value={selectedContract?.contractConditions.S}
              />
            </Form.Group>
            <Form.Group controlId="bidAmount">
              <Form.Label>Bid Amount</Form.Label>
              <Form.Control
                type="number"
                readOnly
                value={selectedContract?.bidAmount.N}
              />
            </Form.Group>
            <Form.Group controlId="verifyLink">
              <Form.Label>Proof Verification</Form.Label>
              <Form.Control
                type="string"
                required
                placeholder="YouTube, Twitch, Vimeo - Upload date must be newer than contract date, and 60s or less."
                value={selectedContract?.verifyLink.S || ''}
                onChange={(event) => setVerifyLink(event.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="verifyNotes">
              <Form.Label>Job Notes</Form.Label>
              <Form.Control
                type="string"
                placeholder="Anything interesting about this contract? (under 100char)"
                value={selectedContract?.verifyNotes.S}
                onChange={(event) => setVerifyNotes(event.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Verify
            </Button>
            <Button variant="primary" type="submit">
              Reject
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
