// gameTitleValidation.js
import axios from "axios";

const apiKey = process.env.NEXT_PUBLIC_IGDB_API_KEY;
const clientId = process.env.NEXT_PUBLIC_IGDB_CLIENT_ID;

export async function fetchGameSuggestions(gameTitle) {
  try {
    const response = await axios({
      url: "https://api.igdb.com/v4/games",
      method: "POST",
      headers: {
        "Client-ID": clientId,
        Authorization: `Bearer ${apiKey}`,
      },
      data: `search "${gameTitle}"; fields name; limit 5;`,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching game suggestions:", error);
    return [];
  }
}
