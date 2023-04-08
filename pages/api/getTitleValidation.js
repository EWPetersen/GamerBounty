import axios from "axios";

export default async function getTitleValidation(req, res) {
  const { search } = req.query;

  try {
    const response = await axios.post(
      "https://api.igdb.com/v4/games",
      {
        fields: "name",
        search: search,
      },
      {
        headers: {
          "Client-ID": process.env.IGDB_CLIENT_ID,
          Authorization: `Bearer ${process.env.IGDB_ACCESS_TOKEN}`,
        },
      }
    );
    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting game titles" });
  }
}