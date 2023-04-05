import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'react-bootstrap';

const ReviewContractForm = ({ selectedContract, handleApprove, handleReject, handleClose, showReviewForm }) => {
  return (
    <div>
      <Modal isOpen={showReviewForm} toggle={handleClose}>
        <ModalHeader toggle={handleClose}>Review Proof</ModalHeader>
        <ModalBody>
          {selectedContract && (
            <>
              {/* Show contract details */}
              {/* You can customize the contract detail display as needed */}
              <div className="contract-details">
                {/* Example of displaying contract details */}
                <p>Game title: {selectedContract.gameTitle.S}</p>
                <p>Player: {selectedContract.targetPlayer.S}</p>
                <p>Bid amount: {selectedContract.bidAmount.N}</p>
                <p>Requested by: {selectedContract.requestedBy.S}</p>
                <p>Contract conditions: {selectedContract.contractConditions.S}</p>
                <p>Status: {selectedContract.status.S}</p>
              </div>
              {/* iframe to show content from the verifyLink attribute */}
              {selectedContract.verifyLink.S ? (
                <iframe
                  src={selectedContract.verifyLink.S}
                  title="proof"
                  width="100%"
                  height="400"
                  frameBorder="0"
                ></iframe>
              ) : (
                <p>No verification link available.</p>
              )}
            </>
          )}
        </ModalBody>
        <ModalFooter>
          {/* Buttons for Approve, Reject, and Close */}
          <Button color="success" onClick={handleApprove}>
            Approve
          </Button>
          <Button color="danger" onClick={handleReject}>
            Reject
          </Button>
          <Button color="secondary" onClick={handleClose}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ReviewContractForm;
