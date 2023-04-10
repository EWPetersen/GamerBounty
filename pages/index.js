import { useEffect, useState, useRef, useCallback } from "react";
import {
  Container,
  Pagination,
  Spinner,
  Modal,
  Form,
  Button,
  Table
} from "react-bootstrap";
import axios from "axios";
import "tailwindcss/tailwind.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/Navbar";
import { Row, Col, List, Card } from "antd";
import { YoutubeOutlined } from "@ant-design/icons";

function Main() {
  const [contracts, setContracts] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState({ field: "", order: "" });
  const [show, setShow] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const observer = useRef();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/readContracts?page=${page}`);
        console.log("Contracts data:", response.data.data);
        const filteredData = response.data.data.filter(
          (contract) => contract.contractStatus?.S === "closed"
        );
        setContracts((prevContracts) => [...prevContracts, ...filteredData]);
        // Set hasMore to false if there are no more contracts
        setHasMore(filteredData.length > 0);
      } catch (error) {
        console.error("Error fetching contracts", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  const lastContractElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  function handlePaginationChange(newPagination) {
    setPagination(newPagination);
  }

  function handleSearch(event) {
    setSearchTerm(event.target.value);
  }

  function handleSort(field) {
    if (sort.field === field) {
      setSort({ ...sort, order: sort.order === "asc" ? "desc" : "asc" });
    } else {
      setSort({ field, order: "asc" });
    }
  }

  function handleViewContract(contract) {
    setSelectedContract(contract);
    setShow(true);
  }

  function handleClose() {
    setSelectedContract(null);
    setShow(false);
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

  function formatCurrency(amount) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US").format(date);
  }

  function getEmbedUrl(url) {
    // Use regex to extract YouTube video ID from the given URL
    const videoIdRegex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?/;
    const match = url.match(videoIdRegex);

    // Extract the timestamp parameter from the URL
    const timestampRegex = /[?&]t=(\d+)/;
    const timestampMatch = url.match(timestampRegex);
    const timestamp = timestampMatch ? timestampMatch[1] : null;

    if (match && match[1]) {
      // If the video ID is found, return the embed URL
      let embedUrl = "https://www.youtube.com/embed/" + match[1];

      // Append the timestamp parameter if it exists
      if (timestamp) {
        embedUrl += "?start=" + timestamp;
      }

      return embedUrl;
    } else {
      // If the video ID is not found, return the original URL (or an empty string if it's not a valid URL)
      return url ? url : "";
    }
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <Navbar />
      <Container className="bg-gray-900">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Completed Hit Feed
        </h1>
        <Form className="mb-4">
          <Form.Group controlId="search">
            <Form.Control
              className="bg-gray-700 border-gray-600 focus:border-blue-500 focus:ring-blue-500 text-white"
              type="text"
              placeholder="Search by game name"
              onChange={handleSearch}
            />
          </Form.Group>
        </Form>
        <Row gutter={[16, 16]}>
          {paginatedContracts.map((contract, index) => (
            <Col xs={24} sm={12} md={8} lg={6} key={contract.id.S}>
              <Card
                className="bg-gray-800" // Change the card theme to be dark
                title={contract.gameTitle.S}
              >
                <Card.Meta
                  avatar={<YoutubeOutlined />}
                  title={contract.targetPlayer.S}
                  description={contract.contractConditions.S}
                />
                <div style={{ marginTop: "1rem" }}>
                  Payout: {formatCurrency(contract.gameCurrencyAmount?.N)}
                </div>
                {/* Add the iframe for autoplay on hover */}
                <div
                  className="video-container"
                  onMouseEnter={(e) => {
                    e.currentTarget.querySelector("iframe").src +=
                      "&autoplay=1";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.querySelector("iframe").src =
                      e.currentTarget.querySelector("iframe").src.replace(
                        "&autoplay=1",
                        ""
                      );
                  }}
                >
                  <iframe
                    width="100%"
                    height="315"
                    src={getEmbedUrl(contract.verifyLink.S)}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                {/* Move the View Details button to the bottom of the card */}
                <Button
                  className="mt-4"
                  onClick={() => handleViewContract(contract)}
                >
                  View Details
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Contract Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5>Game Name:</h5>
            <p>{selectedContract?.gameTitle?.S}</p>
            <h5>Target Player:</h5>
            <p>{selectedContract?.targetPlayer?.S}</p>
            <h5>Contract Conditions</h5>
            <p>{selectedContract?.contractConditions?.S}</p>
            <h5>Proof of Hit</h5>
            <p>{selectedContract?.verifyLink?.S}</p>
            <h5>Bid Amount:</h5>
            <p>
              {selectedContract &&
                formatCurrency(selectedContract.bidAmount?.N)}
            </p>
            <h5>Expiration Date:</h5>
            <p>{selectedContract && formatDate(selectedContract.expDate?.S)}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
}

export default Main;
