import React, { useState } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import "tailwindcss/tailwind.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

function VerifyContractForm({ show, handleClose, selectedContract }) {
  const [verifyNotes, setVerifyNotes] = useState("");
  const [submitStatus, setSubmitStatus] = useState(null);
  const [verifyLink, setVerifyLink] = useState("");
  const [loading, setLoading] = useState(false);

  if (!show) {
    return null;
  }

  const validateYouTubeLink = (url) => {
    const regExp = /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:watch\?v=|embed\/|v\/)?([\w-]{11})(?:\S+)?$/;
    return url.match(regExp);
  };

  const submitVerification = async () => {
    setLoading(true);
    try {
      await axios.post("/api/updateContracts", {
        id: selectedContract?.id.S,
        gameTitle: selectedContract?.gameTitle.S,
        acceptedBy: selectedContract?.acceptedBy.S,
        verifyLink: verifyLink,
        verifyNotes: verifyNotes,
        contractStatus: "verified",
      });
      setLoading(false);
      setSubmitStatus("success");
      setTimeout(() => {
        handleClose(); // Close the form after a short delay
      }, 1000);
    } catch (error) {
      setLoading(false);
      setSubmitStatus("failure");
      console.error("Error updating contract", error);
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (validateYouTubeLink(verifyLink)) {
      submitVerification();
    } else {
      setSubmitStatus("invalid-link");
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} className="bg-gray-900">
        <Modal.Header closeButton>
          <Modal.Title>Submit Proof</Modal.Title>
        </Modal.Header>
        <div className="bg-gray-900">
          <Modal.Body>
            <h6>
              Step 1. Execute the contract and its conditions. Read them
              carefully.
            </h6>
            <h6>
              Step 2. Record Proof using Shadowplay or similar, and trim to less
              than 60 seconds.
            </h6>
            <h6>
              Step 3. Upload your clip to youtube, set visibility to unlisted or
              public.
            </h6>
          </Modal.Body>
          <Modal.Body>
            {submitStatus === "success" && (
              <Alert variant="success">Contract successfully verified!</Alert>
            )}
            {submitStatus === "failure" && (
              <Alert variant="danger">
                Failed to verify contract. Please try again.
              </Alert>
            )}
              {submitStatus === "invalid-link" && (
              <Alert variant="warning">
                Invalid YouTube link. Please enter a valid YouTube link.
              </Alert>
            )}
            <Form onSubmit={handleFormSubmit}>
              <Form.Group controlId="gameTitle">
                <Form.Label>Game:</Form.Label>
                <h6>{selectedContract?.gameTitle.S}</h6>
              </Form.Group>
              <Form.Group controlId="targetPlayer">
                <Form.Label>Mark:</Form.Label>
                <h6>{selectedContract?.targetPlayer.S}</h6>
              </Form.Group>
              <Form.Group controlId="contractConditions">
                <Form.Label>Conditions:</Form.Label>
                <h6>{selectedContract?.contractConditions.S}</h6>
              </Form.Group>
              <Form.Group controlId="verifyLink">
                <Form.Label>Proof Link:</Form.Label>
                <Form.Control
                  type="string"
                  required
                  placeholder="YouTube links only for now"
                  value={verifyLink}
                  onChange={(event) => setVerifyLink(event.target.value)}
                  className={submitStatus === "invalid-link" ? "invalid-input" : ""}
                />
              </Form.Group>
              <Form.Group controlId="verifyNotes">
                <Form.Label>Job Notes</Form.Label>
                <Form.Control
                  type="string"
                  placeholder="Anything interesting about this contract? (under 140char)"
                  value={verifyNotes}
                  onChange={(event) => setVerifyNotes(event.target.value)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
        </div>
        <Modal.Footer>
          <h6>
            The length must be less than 60 seconds, and the upload date must be
            after the contract creation date.
          </h6>
          <Button variant="success" onClick={handleFormSubmit}>
            Verify
          </Button>
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
