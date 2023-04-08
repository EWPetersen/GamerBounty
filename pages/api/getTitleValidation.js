// gameTitleValidation.js
import axios from 'axios';

const apiKey = process.env.NEXT_PUBLIC_IGDB_API_KEY;
const clientId = process.env.NEXT_PUBLIC_IGDB_CLIENT_ID;

export async function isValidGameTitle(gameTitle) {
  try {
    const response = await axios({
      url: 'https://api.igdb.com/v4/games',
      method: 'POST',
      headers: {
        'Client-ID': clientId,
        'Authorization': `Bearer ${apiKey}`,
      },
      data: `search "${gameTitle}"; fields name; limit 1;`,
    });

    if (response.data.length > 0 && response.data[0].name === gameTitle.trim()) {
      return true;
    }
  } catch (error) {
    console.error('Error fetching game data:', error);
  }
  return false;
}
