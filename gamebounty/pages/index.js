import Head from 'next/head'

const Home = () => {
  return (
    <>
      <Head>
        <title>Home</title>
        <meta name="description" content="This is the home page of the Gamer Bounty app." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
            <h1>Welcome to Gamer Bounty!</h1>
      <p>Create a profile to get started and view bounties posted by other gamers.</p>
    </>
  );
};

export default Home;
