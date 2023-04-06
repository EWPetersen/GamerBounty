import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios'

const ViewContractForm = ({ show, handleClose, selectedContract }) => {
  const [deleteStatus, setDeleteStatus] = useState(false);

  const handleDeleteClick = async (selectedContract) => {
  if (!selectedContract) return;

  // Show a confirmation dialog
  const confirmation = window.confirm("Are you sure you want to delete this?");

  
  if (confirmation) {
    try {
      const response = await axios.post('/api/updateContracts', {
        id: selectedContract?.id.S,
        gameTitle: selectedContract?.gameTitle.S,
        isDeleted: true,
      });

      console.log('Delete contract response:', response.data);

      if (response.data.status === 'success') {
        setDeleteStatus('success');
        console.log('Contract marked deleted');

        // Close the modal and refresh the contracts data
        handleClose();
        } else {
        setDeleteStatus('error');

        // Display a detailed error message
        alert('Failed to delete contract. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting contract:', error.message);
      setDeleteStatus('error');

      // Display a detailed error message
      alert('Failed to delete contract. Please try again.');
    }
  }
};

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Contract Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
          <h4>Clicking the Delete button will remove the below contract from your profile and refund all bids. Are you sure?</h4>
          </Modal.Body>
      <Modal.Body>
          <Form>
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
            </Form>
          </Modal.Body>
          
      <Modal.Footer>
      <Button variant="danger" onClick={() => handleDeleteClick(selectedContract, handleClose)}>Delete</Button>
      <Button variant="secondary" onClick={handleClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewContractForm;

