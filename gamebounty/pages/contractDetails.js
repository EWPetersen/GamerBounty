import { useEffect, useState } from 'react';
import { Descriptions } from 'antd';

export default function ContractDetails({ contractId }) {
  const [contract, setContract] = useState(null);

  useEffect(() => {
    fetch(`/api/viewContracts?id=${contractId}`)
      .then((res) => res.json())
      .then((data) => {
        setContract(data[0]);
      })
      .catch((error) => console.error(error));
  }, [contractId]);

  if (!contract) {
    return null;
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <Descriptions title="Contract Details" column={1}>
        <Descriptions.Item label="Game Name">{contract.gameName}</Descriptions.Item>
        <Descriptions.Item label="Target Player">{contract.targetPlayer}</Descriptions.Item>
        <Descriptions.Item label="Bid Amount">{contract.bidAmount}</Descriptions.Item>
        <Descriptions.Item label="Expiration Date">{contract.expDate}</Descriptions.Item>
        <Descriptions.Item label="Contract Conditions">{contract.contractConditions}</Descriptions.Item>
        <Descriptions.Item label="Multi-Bid">{contract.multiBid}</Descriptions.Item>
        <Descriptions.Item label="Multi-Submit">{contract.multiSubmit}</Descriptions.Item>
      </Descriptions>
    </div>
  );
}
