import { useState } from 'react';
import axios from 'axios';

export default function UpdateTest() {
  const [formData, setFormData] = useState({
    uid: '',
    contractNumber: '',
    gameName: '',
    targetPlayer: '',
    bidAmount: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { uid, contractNumber, gameName, targetPlayer, bidAmount } = formData;
    const response = await axios.put('/api/updateContract', { uid, contractNumber, gameName, targetPlayer, bidAmount });
    console.log(response.data);
  };

  return (
    <div>
      <h1>Update Test</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>UID</label>
          <input type="text" name="uid" onChange={handleInputChange} />
        </div>
        <div>
          <label>Contract Number</label>
          <input type="text" name="contractNumber" onChange={handleInputChange} />
        </div>
        <div>
          <label>Game Name</label>
          <input type="text" name="gameName" onChange={handleInputChange} />
        </div>
        <div>
          <label>Target Player</label>
          <input type="text" name="targetPlayer" onChange={handleInputChange} />
        </div>
        <div>
          <label>Bid Amount</label>
          <input type="text" name="bidAmount" onChange={handleInputChange} />
        </div>
        <button type="submit">Update</button>
      </form>
    </div>
  );
}
