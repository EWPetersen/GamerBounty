import Navbar from "../components/Navbar";
import styled from "styled-components";

const StyledPage = styled.div`
  background-color: #1f2937;
  color: #fff;
  min-height: 100vh;
`;

const MainContainer = styled.div`
  max-width: 1024px;
  margin: 8;
  padding: 10rem 1rem;
`;

const Section = styled.section`
  text-align: center;
`;

const Title = styled.h1`
  font-size: 4rem;
  font-weight: bold;
  margin-bottom: 2rem;
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  margin-bottom: 4rem;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const GridBox = styled.div`
  background-color: #374151;
  padding: 1rem;
  border-radius: 0.5rem;
`;

const GridTitle = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 2rem;
`;

const GridText = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
`;

const Button = styled.button`
  background-color: #3b82f6;
  color: #fff;
  padding: 1rem 2rem;
  border-radius: 0.25rem;
  font-size: 1.25rem;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  &:hover {
    background-color: #2563eb;
  }
`;

const Footer = styled.footer`
  background-color: #374151;
  color: #fff;
  padding: 2rem;
  text-align: center;
`;

const Home = () => {
  return (
    <StyledPage>
      <Navbar />
      <MainContainer>
        <Section>
          <Title>Welcome to Gamer Bounty!</Title>
          <Subtitle>
            Create a profile to get started and view bounties posted by other gamers.
          </Subtitle>
            <GridBox>
              <GridTitle>Use the login button in the menu to see the contracts</GridTitle>
              < GridText>and to watch the dashboard for a live feed of closed out contracts</GridText>
            </GridBox>
        <GridContainer>
            <GridBox>
              <GridTitle>Earn money by accepting contracts</GridTitle>
              <GridText>
                Complete contracts to earn the bids and get paid for your gaming skills.
              </GridText>
              <Button>Learn More</Button>
            </GridBox>
            <GridBox>
              <GridTitle>Create contracts for players you want knocked off</GridTitle>
              <GridText>
                Pick the game, pick the price, and wait for your contractor to send you proof.
              </GridText>
              <Button>Learn More</Button>
            </GridBox>
        </GridContainer>
        </Section>
      </MainContainer>
      <Footer>&copy; 2023 Gamer Bounty</Footer>
    </StyledPage>
  );
};

export default Home;