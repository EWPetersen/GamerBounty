import { useState } from 'react';
import Head from 'next/head';
import AWS from 'aws-sdk';
import { DynamoDB } from 'aws-sdk';

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dynamodb = new DynamoDB({
    region: 'us-east-1', // Replace with your region
  });

export default function Submit() {
  const [game, setGame] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [conditions, setConditions] = useState('');
  const [bid, setBid] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    const params = {
      Item: {
        Game: { S: game },
        PlayerName: { S: playerName },
        Conditions: { S: conditions },
        Bid: { N: bid },
      },
      TableName: 'gamerbounty',
    };

    try {
      await dynamodb.putItem(params).promise();
      setSuccess(true);
      setSubmitting(false);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Head>
        <title>Submit Contract | GamerBounty</title>
      </Head>

      <h1>Submit a Contract</h1>

      {success && <p>Contract submitted successfully!</p>}

      {error && <p>Error: {error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="game">Game:</label>
          <input
            type="text"
            id="game"
            value={game}
            onChange={(event) => setGame(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="playerName">Target Player Name:</label>
          <input
            type="text"
            id="playerName"
            value={playerName}
            onChange={(event) => setPlayerName(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="conditions">Conditions:</label>
          <textarea
            id="conditions"
            value={conditions}
            onChange={(event) => setConditions(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="bid">Bid Amount:</label>
          <input
            type="text"
            id="bid"
            value={bid}
            onChange={(event) => setBid(event.target.value)}
          />
        </div>

        <button type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Contract'}
        </button>
      </form>
    </div>
  );
}
