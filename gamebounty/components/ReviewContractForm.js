import React, { useEffect, useState } from 'react';
import { Modal, Button, table } from 'react-bootstrap';
import axios from "axios";



const getEmbedUrl = (url) => {
  const ytRegExp = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#&?]*).*/;
  const match = url.match(ytRegExp);
  const videoId = match && match[1].length === 11 ? match[1] : null;

  if (!videoId) {
    return null;
  }

  const urlObj = new URL(url);
  const startTime = urlObj.searchParams.get('t') || '';

  let embedUrl = `https://www.youtube.com/embed/${videoId}`;
  if (startTime) {
    embedUrl += `?start=${startTime}`;
  }

  return embedUrl;
};



const ReviewContractForm = ({
  show,
  handleClose,
  selectedContract,
  setSelectedContract,
}) => {
  const [embedUrl, setEmbedUrl] = useState(null);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Review Proof</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedContract && (
          <>
            <p>Game title: {selectedContract.gameTitle?.S}</p>
            <p>Player: {selectedContract.targetPlayer?.S}</p>
            <p>Bid Amount {selectedContract.bidAmount?.N}</p>
            {selectedContract.verifyLink.S ? (
              <iframe
                src={getEmbedUrl(selectedContract.verifyLink.S)}
                title="proof"
                width="100%"
                height="400"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <p>No verification link available.</p>
            )}
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={handleClose}>
          Approve
        </Button>
        <Button variant="danger" onClick={handleClose}>
          Reject
        </Button>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReviewContractForm;
