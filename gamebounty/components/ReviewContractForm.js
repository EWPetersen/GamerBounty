import React from 'react';

const ReviewContractForm = ({
  show,
  contract,
  onApprove,
  onReject,
  onClose,
}) => {
  if (!show || !contract) {
    return null;
  }

return (
    <div className="review-proof-modal"> 
    {showReviewForm && selectedReviewContract && (
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
      <iframe
        src={selectedReviewContract.verifyLink.S}
        width="100%"
        height="300px"
        title="Proof"
      ></iframe>
      {/* Buttons for Approve, Reject, and Close */}
      <button onClick={handleApprove}>Approve</button>
      <button onClick={handleReject}>Reject</button>
      <button onClick={() => setShowReviewForm(false)}>Close</button>
    </div>
      )}
  </div>
)
    }

export default ReviewContractForm;