import { useState } from "react";
import { useSession } from "next-auth/react";

const CreateProfilePage = () => {
  const { data: session, status } = useSession();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [picture, setPicture] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add logic to save profile information to database
  };

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return <p>You must be signed in to view this page.</p>;
  }

  return (
    <div>
      <h1>Create Profile</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br />
        <label htmlFor="bio">Bio:</label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
        <br />
        <label htmlFor="picture">Profile Picture URL:</label>
        <input
          type="text"
          id="picture"
          value={picture}
          onChange={(e) => setPicture(e.target.value)}
        />
        <br />
        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
};

export default CreateProfilePage;
