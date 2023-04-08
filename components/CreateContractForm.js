import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import { useSession } from "next-auth/react";
import axios from "axios";
import Autosuggest from "react-autosuggest"; // Add this line
import "tailwindcss/tailwind.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { fetchGameSuggestions } from "../pages/api/getTitleValidation";
import moment from "moment";
import Datepicker from "@flowbite/daterangepicker";

import "@flowbite/daterangepicker/dist/style.css";

// Add this function to render the suggestions
function renderSuggestion(suggestion) {
  return <div>{suggestion.name}</div>;
}

function CreateContractForm({ show, handleClose }) {
  const [gameTitle, setgameTitle] = useState("");
  const [targetPlayer, setTargetPlayer] = useState("");
  const [contractConditions, setContractConditions] = useState("");
  const [expDate, setExpDate] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [submitStatus, setSubmitStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { data: session, status } = useSession();
  const [gameSuggestions, setGameSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (gameTitle.length <= 2) {
      setShowSuggestions(false);
      return;
    }

    const fetchSuggestions = async () => {
      const suggestions = await fetchGameSuggestions(gameTitle);
      setGameSuggestions(suggestions);
      setShowSuggestions(true);
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [gameTitle]);

  const onSuggestionsFetchRequested = async ({ value }) => {
    if (value.length <= 2) {
      setShowSuggestions(false);
      return;
    }
    const suggestions = await fetchGameSuggestions(value);
    setGameSuggestions(suggestions);
    setShowSuggestions(true);
  };

  const onSuggestionsClearRequested = () => {
    setShowSuggestions(false);
  };

  const onChange = (event, { newValue }) => {
    setgameTitle(newValue);
  };

  const inputProps = {
    placeholder: "Which game does their character live in?",
    value: gameTitle,
    onChange: onChange,
  };

  if (!show) {
    return <></>;
  }

  return (
    <>
      {show && !session && <NotSignedInAlert />}
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
          <Form onSubmit={CreateContractForm}>
            <Form.Group controlId="gameTitle">
              <Form.Label>Game:</Form.Label>
              <Autosuggest
                suggestions={gameSuggestions}
                onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                onSuggestionsClearRequested={onSuggestionsClearRequested}
                getSuggestionValue={(suggestion) => suggestion.name}
                renderSuggestion={renderSuggestion}
                inputProps={inputProps}
              />
            </Form.Group>
            <Form.Group controlId="targetPlayer">
              <Form.Label>Mark:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Who is your target?"
                value={targetPlayer}
                onChange={(event) => setTargetPlayer(event.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="expDate">
              <Form.Label>Expiration:</Form.Label>
              <DatePicker
                showTime={{ format: "HH:mm:ss" }}
                format="YYYY-MM-DD HH:mm:ss"
                value={expDate}
                onChange={(date) => setExpDate(date)}
                disabledDate={(current) => {
                  // Disable selection of dates that are before the current date
                  return current && current < moment().startOf("day");
                }}
              />
            </Form.Group>

            <Form.Control
              type="text"
              placeholder="Are there any additional requirements? (under 140 char)"
              maxLength={140}
              value={contractConditions}
              onChange={(event) => setContractConditions(event.target.value)}
            />
            <Form.Group controlId="bidAmount">
              <Form.Label>Opening Bid:</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter bid amount"
                value={bidAmount}
                onChange={(event) => setBidAmount(event.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={CreateContractForm}>
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
