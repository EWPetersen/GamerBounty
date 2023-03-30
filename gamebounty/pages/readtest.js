import { useState, useEffect } from 'react';

function ReadContracts() {
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/readContracts?uid=1234567');
      const data = await res.json();
      setContracts(data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>UID</th>
            <th>Game Name</th>
            <th>Target Player</th>
            <th>Bid Amount</th>
            <th>Contract Status</th>
            <th>Requested By</th>
            <th>Contract Number</th>
          </tr>
        </thead>
        <tbody>
          {contracts.map((contract) => (
            <tr key={contract.key}>
              <td>{contract.key}</td>
              <td>{contract.gameName}</td>
              <td>{contract.targetPlayer}</td>
              <td>{contract.bidAmount}</td>
              <td>{contract.contractStatus}</td>
              <td>{contract.requestedBy}</td>
              <td>{contract.contractNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReadContracts;
