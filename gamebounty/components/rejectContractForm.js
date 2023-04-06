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
          contractId: selectedContract.contractId.S,
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
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="danger" onClick={handleRejectClick}>
          Reject
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RejectContractForm;
