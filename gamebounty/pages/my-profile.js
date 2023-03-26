import { useSession } from "next-auth/react";

const MyProfilePage = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return <p>You must be signed in to view this page.</p>;
  }

  return (
    <div>
      <h1>My Profile</h1>
      <p>Welcome, {session.user.name}!</p>
      <p>Email: {session.user.email}</p>
      <p>Profile Picture:</p>
      <img src={session.user.image} alt="Profile picture" />
    </div>
  );
};

export default MyProfilePage;
