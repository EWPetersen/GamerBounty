import React, { useContext } from 'react';

const ViewContractForm = ({ contract }) => {
  if (!contract) return null;

  return (
    <div>
      <p><strong>Game Title:</strong> {contract.gameTitle.S}</p>
      <p><strong>Target Player:</strong> {contract.targetPlayer.S}</p>
      <p><strong>Contract Conditions:</strong> {contract.contractConditions.S}</p>
      <p><strong>Bid Amount:</strong> {contract.bidAmount.N}</p>
      <p><strong>Expiration Date:</strong> {contract.expDate.S}</p>
    </div>
  );
};

export default ViewContractForm;
