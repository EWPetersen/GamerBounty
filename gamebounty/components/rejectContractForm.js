import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const RejectContractForm = ({
  show,
  handleClose,
  selectedContract,
}) => {
  const [rejectReason, setRejectReason] = useState('');

  const handleRejectClick = async () => {
    if (rejectReason.trim()) {
      try {
        await axios.post('/api/updateContracts', {
          id: selectedContract?.id.S,
          gameTitle: selectedContract?.gameTitle.S,
          contractStatus: 'rejected',
          rejectReason,
        });

        handleClose();
      } catch (error) {
        console.error(`Error updating contract status: ${error.message}`);
      }
    } else {
      alert('Please provide a reason for rejecting the contract.');
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Reject Contract</Modal.Title>
      </Modal.Header>
      <Modal.Body>
          <h4>Enter a rejection reason to proceed.</h4> 
          <h6>Rejecting this contract cancels the contract and refunds all bids.  Are you sure?</h6>
          </Modal.Body>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Reason for Rejection</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
      <Button variant="danger" onClick={handleRejectClick}>
          Reject
        </Button>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RejectContractForm;
