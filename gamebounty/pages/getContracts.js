import { useEffect, useState } from 'react';
import axios from 'axios';

function renderContractsTable(contracts) {
  return (
    <table>
      <thead>
        <tr>
          <th>Game Name</th>
          <th>Player Target</th>
          <th>Bid Amount</th>
        </tr>
      </thead>
      <tbody>
        {contracts.map(contract => (
          <tr key={contract.contractNumber.S}>
            <td>{contract.gameName.S}</td>
            <td>{contract.targetPlayer.S}</td>
            <td>{contract.bidAmount.S}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function GetContracts() {
  const [contracts, setContracts] = useState([]);
  

  useEffect(() => {
    axios.get('/api/readContracts')
      .then(response => {
        console.log('Contracts data:', response.data.data);
        const filteredData = response.data.data.filter(contract => contract.contractStatus?.S === 'open');
        setContracts(filteredData); // update contracts state with filtered data
      })
      .catch(error => {
        console.error('Error fetching contracts', error);
      });
  }, []);

  return (
    <div>
      <h1>All Open Contracts</h1>
      {renderContractsTable(contracts)}
    </div>
  );
}

export default GetContracts;
