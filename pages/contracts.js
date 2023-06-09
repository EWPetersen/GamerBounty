import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import {
  Container,
  Table,
  Pagination,
  Spinner,
  Modal,
  Form,
  Button,
} from "react-bootstrap";
import axios from "axios";

import "tailwindcss/tailwind.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/Navbar";

import AcceptContractForm from "../components/AcceptContractForm";

function GetContracts() {
  const { data: session, status } = useSession();
  const [contracts, setContracts] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState({ field: "", order: "" });
  const [show, setShow] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showAcceptForm, setShowAcceptForm] = useState(false);
  const [selectedAcceptContract, setSelectedAcceptContract] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/readContracts");
        console.log("Contracts data:", response.data.data);
        const filteredData = response.data.data.filter(
          (contract) =>
            contract.contractStatus?.S === "open" &&
            !contract.hasOwnProperty("isDeleted")
        );
        setContracts(filteredData);
      } catch (error) {
        console.error("Error fetching contracts", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // Added this line
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen text-white text-center">
        <Navbar />
        <h1 className="text-3xl font-bold mt-8">Loading...</h1>
      </div>
    );
  }
  // This tells the user to sign in, and displays a sign in button if there session doesn't exist
  if (!session) {
    return (
      <div className="bg-gray-900 min-h-screen text-white text-center">
        <Navbar />
        <h1 className="text-3xl font-bold mt-8">Please sign in</h1>
        <button
          onClick={() => signIn()}
          className="text-xl px-8 py-2 rounded-lg mt-4 bg-blue-600 text-white"
        >
          Sign In
        </button>
      </div>
    );
  }

  const handleCloseAcceptForm = () => {
    setShowAcceptForm(false);
    setSelectedContract(null);
  };

  function handleSearch(event) {
    setSearchTerm(event.target.value);
  }

  function handlePaginationChange(newPagination) {
    setPagination(newPagination);
  }

  function handleSort(field) {
    if (sort.field === field) {
      setSort({ ...sort, order: sort.order === "asc" ? "desc" : "asc" });
    } else {
      setSort({ field, order: "asc" });
    }
  }

  const filteredContracts = contracts.filter(
    (contract) =>
      contract &&
      contract.gameTitle.S.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedContracts = sort.field
    ? filteredContracts.sort((a, b) => {
        if (sort.field === "bidAmount") {
          const fieldA = parseFloat(a[sort.field].N);
          const fieldB = parseFloat(b[sort.field].N);
          return sort.order === "asc" ? fieldA - fieldB : fieldB - fieldA;
        } else {
          const fieldA = a[sort.field].S.toLowerCase();
          const fieldB = b[sort.field].S.toLowerCase();
          if (fieldA < fieldB) {
            return sort.order === "asc" ? -1 : 1;
          }
          if (fieldA > fieldB) {
            return sort.order === "asc" ? 1 : -1;
          }
          return 0;
        }
      })
    : filteredContracts;
  const paginatedContracts = sortedContracts.slice(
    (pagination.current - 1) * pagination.pageSize,
    pagination.current * pagination.pageSize
  );

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <Navbar />
      <Container className="bg-gray-900">
        <div className="text-center my-4">
          {successMessage && (
            <div className="alert alert-success" role="alert">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}
        </div>
        <h1 className="text-3xl font-bold mb-8 text-center">Open Contracts</h1>
        <Form className="mb-4">
          <Form.Group controlId="search">
            <Form.Control
              className="bg-gray-700 border-gray-600 focus:border-blue-500 focus:ring-blue-500 text-black"
              type="text"
              placeholder="Search by game title"
              onChange={handleSearch}
            />
          </Form.Group>
        </Form>
        <Table responsive bordered hover variant="dark">
          <thead>
            <tr>
              <th
                className="cursor-pointer"
                onClick={() => handleSort("gameTitle")}
              >
                Game{" "}
                {sort.field === "gameTitle" &&
                  (sort.order === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="cursor-pointer"
                onClick={() => handleSort("targetPlayer")}
              >
                Mark{" "}
                {sort.field === "targetPlayer" &&
                  (sort.order === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="cursor-pointer"
                onClick={() => handleSort("gameCurrencyAmount")}
              >
                Payout{" "}
                {sort.field === "gameCurrencyAmount" &&
                  (sort.order === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="cursor-pointer"
                onClick={() => handleSort("expDate")}
              >
                Days Left{" "}
                {sort.field === "expDate" && (sort.order === "asc" ? "↑" : "↓")}
              </th>
              <th>Action</th>
              <th
                className="cursor-pointer"
                onClick={() => handleSort("contractConditions")}
              >
                Conditions{" "}
                {sort.field === "contractConditions" &&
                  (sort.order === "asc" ? "↑" : "↓")}
              </th>
             
            </tr>
          </thead>
          <tbody>
            {paginatedContracts.map((contract) => (
              <tr key={contract.id.S}>
                <td>{contract.gameTitle.S}</td>
                <td>{contract.targetPlayer.S}</td>
                <td>
                  {new Intl.NumberFormat().format(
                    contract.gameCurrencyAmount?.N
                  )}
                  <h6>{contract.gameCurrencyDenom?.S}</h6>
                </td>
                <td>
                  {Math.ceil(
                    (new Date(contract.expDate.S).getTime() -
                      new Date().getTime()) /
                      (1000 * 3600 * 24)
                  )}
                </td>
                <td>
                  <Button
                    variant="success"
                    onClick={() => {
                      setSelectedAcceptContract(contract);
                      setShowAcceptForm(true);
                      console.log("clicked this contract to accept:", contract);
                    }}
                  >
                    Accept Contract
                  </Button>
                </td>
                <td>{contract.contractConditions.S}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div className="d-flex justify-content-center">
          <Pagination className="my-4">
            <Pagination.Prev
              onClick={() =>
                pagination.current > 1 &&
                setPagination({
                  ...pagination,
                  current: pagination.current - 1,
                })
              }
            />
            {[
              ...Array(
                Math.ceil(filteredContracts.length / pagination.pageSize)
              ),
            ].map((x, i) => (
              <Pagination.Item
                key={i + 1}
                active={i + 1 === pagination.current}
                onClick={() => setPagination({ ...pagination, current: i + 1 })}
              >
                {i + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() =>
                pagination.current <
                  Math.ceil(filteredContracts.length / pagination.pageSize) &&
                setPagination({
                  ...pagination,
                  current: pagination.current + 1,
                })
              }
            />
          </Pagination>
        </div>
        <div className="mt-4 mb-4 text-center">
          <AcceptContractForm
            show={showAcceptForm}
            handleClose={handleCloseAcceptForm}
            setShowForm={setShowAcceptForm}
            selectedContract={selectedAcceptContract}
            setSelectedContract={setSelectedAcceptContract}
          />
        </div>
      </Container>
      <style global jsx>{`
        .modal-content,
        .form-control {
          background-color: #1f2937;
          color: #ffffff;
        }
        .alert-success {
          background-color: #10b981;
          color: #ffffff;
        }
        .alert-danger {
          background-color: #ef4444;
          color: #ffffff;
        }
        table thead th {
          cursor: pointer;
          font-weight: 600;
          text-transform: uppercase;
        }
        table tbody tr:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
}

export default GetContracts;
