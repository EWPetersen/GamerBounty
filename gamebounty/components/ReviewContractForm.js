import React, { useEffect, useState } from 'react';
import { Modal, Button, table, Form } from 'react-bootstrap';
import axios from "axios";
import RejectContractForm from './RejectContractForm';

const ReviewContractForm = ({ show, handleClose, selectedContract }) => {
  const [message, setMessage] = useState('');

  const handleApproveClick = async () => {
    if (window.confirm('Are you sure you want to approve this contract?')) {
      try {
        await axios.post('/api/updateContracts', {
          id: selectedContract?.id.S,
          gameTitle: selectedContract?.gameTitle.S,
          contractStatus: 'payment',
        });
  
        setMessage('Contract status updated successfully.');
        setTimeout(() => {
          handleClose();
        }, 2000);
      } catch (error) {
        setMessage(`Error updating contract status: ${error.message}`);
      }
    }
  };

  const getEmbedUrl = (url) => {
    if (!url) return "";
    
    const urlParts = url.split("/");
    if (urlParts.length < 4) return "";

    const videoId = url.split('youtu.be/')[1].split('?')[0];
    const startTime = url.split('t=')[1];
    const embedUrl = `https://www.youtube.com/embed/${videoId}${startTime ? `?start=${startTime}` : ''}`;

    return embedUrl;
  };

  const [showRejectForm, setShowRejectForm] = useState(false);

  const handleShowRejectForm = () => {
    setShowRejectForm(true);
  };
  
  const handleCloseRejectForm = () => {
    setShowRejectForm(false);
  };

  return (
    <Modal show={show} onHide={handleClose} className="bg-gray-900">
        <Modal.Header closeButton>
          <Modal.Title>Approve Proof</Modal.Title>
        </Modal.Header>
      {selectedContract ? (
        <>
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
             <Form.Group controlId="contractConditions">
              <Form.Label>Conditions</Form.Label>
              <p>{selectedContract?.contractConditions.S}</p>
            </Form.Group>
            <Form.Group controlId="bidAmount">
              <Form.Label>Bid Amount</Form.Label>
              <p>{selectedContract?.bidAmount.N}</p>
            </Form.Group>
            <Form.Group controlId="verifyLink">
              <Form.Label>Proof Link </Form.Label>
              <p>{selectedContract.verifyLink && selectedContract.verifyLink.S ? (
            <iframe
              src={getEmbedUrl(selectedContract.verifyLink.S)}
              title="proof"
              width="100%"
              height="360"
              allowFullScreen
            ></iframe>
          ) : (
            <p>No verification link available.</p>
          )}
          {message && <p>{message}</p>}</p>
            </Form.Group>
            </Form>
          </Modal.Body>
           <Modal.Footer>
          <Button variant="success" onClick={handleApproveClick}>
            Approve
          </Button>
          <Button variant="danger" onClick={handleShowRejectForm}>
            Reject
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
      </Modal.Footer>
          
          
          <RejectContractForm
            show={showRejectForm}
            handleClose={handleCloseRejectForm}
            selectedContract={selectedContract}
          />
         </>
      ) : (
        <p>Loading...</p>
      )}
    </Modal>
  );
};

export default ReviewContractForm;