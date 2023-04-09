import React, { useState } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import { useSession } from "next-auth/react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import numeral from "numeral";
import { debounce } from 'lodash';


function CreateContractForm({ show, handleClose }) {
  const [gameTitle, setGameTitle] = useState("");
  const [targetPlayer, setTargetPlayer] = useState("");
  const [contractConditions, setContractConditions] = useState("");
  const [expDate, setExpDate] = useState(new Date());
  const [ingameCurrency, setIngameCurrency] = useState(true);
  const [gameCurrencyDenom, setGameCurrencyDenom] = useState("");
  const [gameCurrencyAmount, setGameCurrencyAmount] = useState("");
  const [submitStatus, setSubmitStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { data: session, status } = useSession();
  const [gameTitleValid, setGameTitleValid] = useState(false);
  const [gameTitleValidationMessage, setGameTitleValidationMessage] = useState('');

  if (!show) {
    return null;
  }

  if (status === "loading") return null; // Do not render anything while the session is loading
  if (!session) {
    return (
      <Alert variant="danger">
        You must be signed in to create a contract.
      </Alert>
    );
  }

  const fetchGameTitlesFromAPI = async (searchTerm) => {
    try {
      const response = await axios.get(`/api/getTitleValidation?search=${encodeURIComponent(searchTerm)}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching game titles from API:', error);
      throw error;
    }
  };

  const validateGameTitle = debounce(async (title) => {
    if (!title) {
      setGameTitleValid(false);
      setGameTitleValidationMessage('Game title cannot be empty.');
      return;
    }
  
    try {
      const gameTitles = await fetchGameTitlesFromAPI(title);
      const matchingTitles = gameTitles.filter((game) => game.name.toLowerCase() === title.toLowerCase());
  
      if (matchingTitles.length > 0) {
        setGameTitleValid(true);
        setGameTitleValidationMessage('');
      } else {
        setGameTitleValid(false);
        setGameTitleValidationMessage('Invalid game title. Please enter a valid game title.');
      }
    } catch (error) {
      console.error('Error validating game title:', error);
      setGameTitleValid(false);
      setGameTitleValidationMessage('Error validating game title. Please try again.');
    }
  }, 300);

  const handleGameCurrencyAmountChange = (event) => {
    const value = event.target.value;
    const formattedValue = numeral(value).format("0,0");

    setGameCurrencyAmount(formattedValue);
  };

  async function handleCreate(contract) {
    try {
      const gameCurrencyAmountNumber = numeral(
        contract.gameCurrencyAmount
      ).value();

      console.log("Request data:", contract); // Log the request data
      const response = await axios.post("/api/writeContracts", {
        gameTitle: contract.gameTitle,
        targetPlayer: contract.targetPlayer,
        contractConditions: contract.contractConditions,
        expDate: contract.expDate,
        gameCurrencyDenom: contract.gameCurrencyDenom,
        gameCurrencyAmount: String(gameCurrencyAmountNumber),
        requestedBy: contract.requestedBy,
        contractStatus: contract.contractStatus,
      });

      console.log(response.data.data);
      setLoading(false);
      setSubmitStatus("success");
      setTimeout(() => {
        handleClose(); // Close the form after a short delay
      }, 2000);
    } catch (error) {
      setLoading(false);
      setSubmitStatus("failure");
      console.error("Error creating contract", error);
    }
  }

  const handleFormSubmit = (event) => {
    event.preventDefault();
    console.log("handleFormSubmit called");
    handleCreate({
      gameTitle,
      targetPlayer,
      contractConditions,
      expDate,
      gameCurrencyDenom,
      gameCurrencyAmount,
      requestedBy: session.user.email,
      contractStatus: "open",
    });
    setShowCreateForm(false);
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create Contract</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {submitStatus === "success" && (
            <Alert variant="success">Contract successfully created!</Alert>
          )}
          {submitStatus === "failure" && (
            <Alert variant="danger">
              Failed to create contract. Please try again.
            </Alert>
          )}
           <Form onSubmit={handleFormSubmit}>
            <Form.Group controlId="gameTitle">
              <Form.Label>Game: </Form.Label>
              <Form.Control
                type="text"
                maxLength="50"
                placeholder="Which game is your Mark playing?"
                value={gameTitle || ""}
                onChange={(event) => setGameTitle(event.target.value)}
                onBlur={() => validateGameTitle(gameTitle)}
              />
              {!gameTitleValid && gameTitleValidationMessage && (
                <Form.Text className="text-danger">
                  {gameTitleValidationMessage}
                </Form.Text>
              )}
            </Form.Group>
            <Form.Group controlId="targetPlayer">
              <Form.Label>The Mark:</Form.Label>
              <Form.Control
                type="text"
                maxLength="20"
                placeholder="Who is your target? (20char)"
                value={targetPlayer || ""}
                onChange={(event) => setTargetPlayer(event.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="expDate">
              <Form.Label>Contract Expires:</Form.Label>
              <div className="d-flex align-items-center">
                <Button
                  variant="primary"
                  onClick={() => {
                    document.getElementById("expDate").click();
                  }}
                >
                  Select Date
                </Button>
                <DatePicker
                  id="expDate"
                  name="expirationDate"
                  selected={expDate}
                  onChange={(date) => setExpDate(date)}
                  className="form-control ml-2 d-none"
                  calendarClassName="dark-calendar"
                  minDate={new Date()}
                  dateFormat="yyyy-MM-dd"
                />
              </div>
            </Form.Group>
            <Form.Group controlId="contractConditions">
              <Form.Label>Additional Contract Conditions:</Form.Label>
              <Form.Control
                type="text"
                maxLength="140"
                placeholder="Are there any additional requirements? (140char)"
                value={contractConditions}
                onChange={(event) => setContractConditions(event.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="bidType">
              <Form.Label>
                USD or In-Game Currency for your opening bid?
              </Form.Label>
              <Form.Check
                type="radio"
                label="In-Game Currency"
                checked={ingameCurrency}
                onChange={() => setIngameCurrency(true)}
              />
              <Form.Check
                type="radio"
                label="PayPal"
                checked={!ingameCurrency}
                readOnly
                disabled
              />
            </Form.Group>
            {ingameCurrency && (
              <>
                <Form.Group controlId="gameCurrencyDenom">
                  <Form.Label> Currency Denomination:</Form.Label>
                  <Form.Control
                    type="text"
                    maxLength="6"
                    placeholder="Enter In-Game currency type  (8char)"
                    value={gameCurrencyDenom}
                    onChange={(event) =>
                      setGameCurrencyDenom(event.target.value)
                    }
                  />
                </Form.Group>
                <Form.Group controlId="gameCurrencyAmount">
                  <Form.Label>Bid Amount:</Form.Label>
                  <Form.Control
                    type="text"
                    maxLength="16"
                    placeholder="Enter bid amount (16char)"
                    value={gameCurrencyAmount}
                    onChange={handleGameCurrencyAmountChange}
                  />
                </Form.Group>
              </>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleFormSubmit}>
            Create
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CreateContractForm;
