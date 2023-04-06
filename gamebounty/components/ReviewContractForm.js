import React, { useEffect, useState } from 'react';
import { Modal, Button, table } from 'react-bootstrap';
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
          <Modal.Title>Review Proof</Modal.Title>
        </Modal.Header>
      {selectedContract ? (
        <>
          <div>
            <p>Game title: {selectedContract.gameTitle.S}</p>
            <p>Player: {selectedContract.targetPlayer.S}</p>
          </div>
          {selectedContract.verifyLink && selectedContract.verifyLink.S ? (
            <iframe
              src={getEmbedUrl(selectedContract.verifyLink.S)}
              title="proof"
              width="100%"
              height="400"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          ) : (
            <p>No verification link available.</p>
          )}
          {message && <p>{message}</p>}
          <RejectContractForm
            show={showRejectForm}
            handleClose={handleCloseRejectForm}
            selectedContract={selectedContract}
          />
          <Button onClick={handleApproveClick} className="mt-3 mr-2">
            Approve
          </Button>
          <Button variant="danger" onClick={handleShowRejectForm}>
            Reject
          </Button>
          <Button onClick={handleClose} className="mt-3">
            Close
          </Button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </Modal>
  );
};

export default ReviewContractForm;