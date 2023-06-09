import React, { useState } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import { useSession } from "next-auth/react";
import "tailwindcss/tailwind.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

function AcceptContractForm({ show, handleClose, selectedContract }) {
  const [submitStatus, setSubmitStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();

  if (!show) {
    return null;
  }

  const submitAccept = async () => {
    if (window.confirm("Are you sure you want to accept this contract?")) {
      setLoading(true);
      try {
        await axios.post("/api/updateContracts", {
          id: selectedContract?.id.S,
          gameTitle: selectedContract?.gameTitle.S,
          acceptedBy: session.user.email,
          contractStatus: "accepted",
        });
        setLoading(false);
        setSubmitStatus("success");
        setTimeout(() => {
          handleClose(); // Close the form after a short delay
        }, 2000);
      } catch (error) {
        setLoading(false);
        setSubmitStatus("failure");
        console.error("Error updating contract", error);
      }
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    submitAccept();
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} className="bg-gray-900">
        <Modal.Header closeButton>
          <Modal.Title>Accept Contract</Modal.Title>
        </Modal.Header>
        <div className="bg-gray-900">
          <Modal.Body>
            {submitStatus === "success" && (
              <Alert variant="success">Contract successfully accepted!</Alert>
            )}
            {submitStatus === "failure" && (
              <Alert variant="danger">
                Failed to Accept contract. Please try again.
              </Alert>
            )}
            <Form onSubmit={handleFormSubmit}>
              <Form.Group controlId="gameTitle">
                <Form.Label>
                  Game:<h6>{selectedContract?.gameTitle.S}</h6>
                </Form.Label>
              </Form.Group>
              <Form.Group controlId="targetPlayer">
                <Form.Label>
                  The Mark:<h6>{selectedContract?.targetPlayer.S}</h6>
                </Form.Label>
              </Form.Group>
              <Form.Group controlId="expDate">
                <Form.Label>
                  Expiriation:<h6>{selectedContract?.expDate.S}</h6>
                </Form.Label>
              </Form.Group>
              <Form.Group controlId="contractConditions">
                <Form.Label>
                  Conditions:<h6>{selectedContract?.contractConditions.S}</h6>
                </Form.Label>
              </Form.Group>
              <Form.Group controlId="bidAmount">
                <Form.Label>
                  Current Bid:
                  <h6>
                    {new Intl.NumberFormat().format(
                      selectedContract?.gameCurrencyAmount?.N
                    )}{" "}
                    {selectedContract?.gameCurrencyDenom?.S}
                  </h6>
                </Form.Label>
              </Form.Group>
            </Form>
          </Modal.Body>
        </div>
        <Modal.Footer>
          <Button variant="success" onClick={submitAccept}>
            Accept
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

export default AcceptContractForm;
