import React from 'react';
import styles from '../styles/ReviewContractForm.module.css';

const ReviewContractForm = (props) => {
  const {
    selectedReviewContract,
    handleApprove,
    handleReject,
    handleClose,
  } = props;

  return (
    <div className={styles.container}>
      {props.showReviewForm && selectedReviewContract ? (
        <div className="review-proof-modal">
          <h2>Review Proof</h2>
          {/* Show contract details */}
          {/* You can customize the contract detail display as needed */}
          <div className="contract-details">
            {/* Example of displaying contract details */}
            <p>Game title: {selectedReviewContract.gameTitle.S}</p>
            <p>Player: {selectedReviewContract.targetPlayer}</p>
          </div>
          {/* iframe to show content from the verifyLink attribute */}
          {selectedReviewContract.verifyLink.S ? (
            <iframe
              src={selectedReviewContract.verifyLink.S}
              title="proof"
              width="100%"
              height="400"
              frameBorder="0"
            ></iframe>
          ) : (
            <p>No verification link available.</p>
          )}
          {/* Buttons for Approve, Reject, and Close */}
          <button onClick={handleApprove}>Approve</button>
          <button onClick={handleReject}>Reject</button>
          <button onClick={handleClose}>Close</button>
        </div>
      ) : null}
    </div>
  );
};

export default ReviewContractForm;
