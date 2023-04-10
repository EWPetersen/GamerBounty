import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { useSession } from "next-auth/react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import numeral from "numeral";
import { debounce } from "lodash";
import { Button, Text, Input, Textarea, Alert } from "@nextui-org/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [gameTitleValidationMessage, setGameTitleValidationMessage] =
    useState("");
  const showToast = (message, type) => toast(message, { type });

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
      const response = await axios.get(
        `/api/getTitleValidation?search=${encodeURIComponent(searchTerm)}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching game titles from API:", error);
      throw error;
    }
  };

  const validateGameTitle = debounce(async (title) => {
    if (!title) {
      setGameTitleValid(false);
      setGameTitleValidationMessage("Game title cannot be empty.");
      return;
    }

    try {
      const gameTitles = await fetchGameTitlesFromAPI(title);
      const matchingTitles = gameTitles.filter(
        (game) => game.name.toLowerCase() === title.toLowerCase()
      );

      if (matchingTitles.length > 0) {
        setGameTitleValid(true);
        setGameTitleValidationMessage("");
      } else {
        setGameTitleValid(false);
        setGameTitleValidationMessage(
          "Invalid game title. Please enter a valid game title."
        );
      }
    } catch (error) {
      console.error("Error validating game title:", error);
      setGameTitleValid(false);
      setGameTitleValidationMessage(
        "Error validating game title. Please try again."
      );
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
      showToast("Contract created successfully!", "success");
    } catch (error) {
      showToast("Error creating contract: " + error.message, "error");
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
          <Modal.Title style={{ color: "white" }}>Create Contract</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {submitStatus === "success" &&
            setToast({
              Text: "Contract successfully created!",
              type: "success",
              delay: 2000,
            })}
          {submitStatus === "failure" &&
            setToast({
              Text: "Failed to create contract. Please try again.",
              type: "error",
              delay: 2000,
            })}
          <form onSubmit={handleFormSubmit}>
            <Text color="white" level={4} mt={0}>
              Game:
            </Text>
            <Input
              id="gameTitle"
              placeholder="Which game is your Mark playing?"
              value={gameTitle || ""}
              onChange={(event) => setGameTitle(event.target.value)}
              onBlur={() => validateGameTitle(gameTitle)}
              width="100%"
            />
            {!gameTitleValid && gameTitleValidationMessage && (
              <p style={{ fontSize: "small", color: "red" }}>
                {gameTitleValidationMessage}
              </p>
            )}
            <Text color="white" level={4} mt={0}>
              The Mark:
            </Text>
            <Input
              id="targetPlayer"
              placeholder="Who is your target? (20char)"
              value={targetPlayer || ""}
              onChange={(event) => setTargetPlayer(event.target.value)}
              required // Added required attribute
              width="100%"
            />
            <Text color="white" level={4} mt={0}>
              Contract Expires:
            </Text>
            <DatePicker
              id="expDate"
              selected={expDate}
              onChange={(date) => setExpDate(date)}
              className="react-datepicker-wrapper"
              calendarClassName="dark-calendar"
              minDate={new Date()}
              dateFormat="yyyy-MM-dd"
            />
            <Text color="white" level={4} mt={0}>
              Additional Contract Conditions:
            </Text>
            <Textarea
              id="contractConditions"
              placeholder="Are there any additional requirements? (140char)"
              value={contractConditions}
              onChange={(event) => setContractConditions(event.target.value)}
              width="100%"
            />
            <Text color="white" level={4} mt={0}>
              USD or In-Game Currency for your opening bid?
            </Text>
            <select
              value={ingameCurrency ? "In-Game Currency" : "PayPal"}
              onChange={(event) =>
                setIngameCurrency(event.target.value === "In-Game Currency")
              }
            >
              <option value="In-Game Currency">In-Game Currency</option>
              <option value="PayPal" disabled>
                PayPal
              </option>
            </select>
            {ingameCurrency && (
              <>
                <Text color="white" level={4} mt={0}>
                  Currency Denomination:
                </Text>
                <Input
                  id="gameCurrencyDenom"
                  placeholder="Enter In-Game currency type (8char)"
                  value={gameCurrencyDenom}
                  onChange={(event) => setGameCurrencyDenom(event.target.value)}
                  width="100%"
                />
                <Text color="white" level={4} mt={0}>
                  Bid Amount:
                </Text>
                <Input
                  id="gameCurrencyAmount"
                  placeholder="Enter bid amount (16char)"
                  value={gameCurrencyAmount}
                  onChange={handleGameCurrencyAmountChange}
                  width="100%"
                />
              </>
            )}
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button color="primary" auto onPress={handleFormSubmit}>
            Create
          </Button>
          <Button color="secondary" auto onPress={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CreateContractForm;
