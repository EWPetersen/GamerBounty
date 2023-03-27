import Navbar from "../components/Navbar";

export default function Home() {
  
  return (
    <div>
      <Navbar />
      <main>
        <section className="hero">
          <h1>Welcome to Gamer Bounty!</h1>
          <p>
            Create a profile to get started and view bounties posted by other gamers.
          </p>
        </section>
      </main>
      <footer>
        <p>&copy; 2023 Gamer Bounty</p>
      </footer>
    </div>
  );
}