import { useState } from 'react';
import axios from 'axios';

const test = () => {
  const [formData, setFormData] = useState({
    uid: '',
    contractNumber: '',
    gameName: '',
    targetPlayer: '',
    bidAmount: '',
  });

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('/api/dynamodb', formData);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <input type="text" name="uid" value={formData.uid} onChange={handleInputChange} />
      <input type="text" name="contractNumber" value={formData.contractNumber} onChange={handleInputChange} />
      <input type="text" name="gameName" value={formData.gameName} onChange={handleInputChange} />
      <input type="text" name="targetPlayer" value={formData.targetPlayer} onChange={handleInputChange} />
      <input type="text" name="bidAmount" value={formData.bidAmount} onChange={handleInputChange} />
      <button type="submit">Create Bounty</button>
    </form>
  );
};

export default test;