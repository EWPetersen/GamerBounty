import React, { useEffect, useState } from 'react';
import { Modal, Button, table, Form } from 'react-bootstrap';
import axios from "axios";
import RejectContractForm from './RejectContractForm';

const ReviewContractForm = ({ show, handleClose, selectedContract }) => {
  const [message, setMessage] = useState('');
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleApproveClick = async () => {
    if (window.confirm('Are you sure you want to approve this contract?')) {
      try {
        await axios.post('/api/updateContracts', {
          id: selectedContract?.id.S,
          gameTitle: selectedContract?.gameTitle.S,
          contractStatus: 'closed',
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
    }
  };

  function getEmbedUrl(url) {
    // Use regex to extract YouTube video ID from the given URL
    const videoIdRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?/;
    const match = url.match(videoIdRegex);
  
    // Extract the timestamp parameter from the URL
    const timestampRegex = /[?&]t=(\d+)/;
    const timestampMatch = url.match(timestampRegex);
    const timestamp = timestampMatch ? timestampMatch[1] : null;
  
    if (match && match[1]) {
      // If the video ID is found, return the embed URL
      let embedUrl = 'https://www.youtube.com/embed/' + match[1];
  
      // Append the timestamp parameter if it exists
      if (timestamp) {
        embedUrl += '?start=' + timestamp;
      }
  
      return embedUrl;
    } else {
      // If the video ID is not found, return the original URL (or an empty string if it's not a valid URL)
      return url ? url : '';
    }
  }
  

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
        {submitStatus === 'success' && (
              <Alert variant="success">Contract successfully verified!</Alert>
            )}
            {submitStatus === 'failure' && (
              <Alert variant="danger">Failed to verify contract. Please try again.</Alert>
            )}
          <h6>Review the video in the player.  Does it satisfy the contract?</h6> 
          </Modal.Body>
        <Modal.Body>
          <Form>
              <Form.Group controlId="gameTitle">
              <Form.Label>Game</Form.Label>
              <h6>{selectedContract?.gameTitle.S}</h6>
            </Form.Group>
            <Form.Group controlId="targetPlayer">
              <Form.Label>Target Player</Form.Label>
              <h6>{selectedContract?.targetPlayer.S}</h6>
            </Form.Group>
             <Form.Group controlId="contractConditions">
              <Form.Label>Conditions</Form.Label>
              <h6>{selectedContract?.contractConditions.S}</h6>
            </Form.Group>
            <Form.Group controlId="bidAmount">
              <Form.Label>Bid Amount</Form.Label>
              <h6>{selectedContract?.bidAmount.N}</h6>
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
           <h6>Click approve to approve bids and pay the contractor.  Click reject to close and cancel the contract without pay.</h6>
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