import { useEffect, useState } from "react";
import {
  Container,
  Table,
  Pagination,
  Spinner,
  Modal,
  Form,
  Button,
  Avatar,
  Grid,
  Card,
  Input,
  Text,
  Link,
} from "@nextui-org/react";
import axios from "axios";
import Navbar from "../components/Navbar";

function Main() {
  const [contracts, setContracts] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState({ field: "", order: "" });
  const [show, setShow] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/readContracts");
        console.log("Contracts data:", response.data.data);
        const filteredData = response.data.data.filter(
          (contract) => contract.contractStatus?.S === "closed"
        );
        setContracts(filteredData);
      } catch (error) {
        console.error("Error fetching contracts", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
    // Use regex toextract YouTube video ID from the given URL
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
    <div>
      <Navbar />
      <Container>
        <Grid.Container gap={2}>
          <Grid xs={24} md={12}>
            <Card shadow>
              <Card.Header>
                <Text h3>Top Contractors</Text>
                <Text small>by completion %</Text>
              </Card.Header>
              <Card.Body>
                <Grid.Container gap={1}>
                  <Grid xs={24}>
                    <Link>
                      <Text b>1. n00bman</Text>
                    </Link>
                  </Grid>
                  <Grid xs={24}>
                    <Link>
                      <Text b>2. Assassin78</Text>
                    </Link>
                  </Grid>
                  <Grid xs={24}>
                    <Link>
                      <Text b>3. MemeLord72</Text>
                    </Link>
                  </Grid>
                </Grid.Container>
              </Card.Body>
            </Card>
          </Grid>
          <Grid xs={24} md={12}>
            <Card shadow>
              <Card.Header>
                <Text h3>Top Producer</Text>
                <Text small>by completion %</Text>
              </Card.Header>
              <Card.Body>
                <Grid.Container gap={1}>
                  <Grid xs={24}>
                    <Link>
                      <Text b>1. catpissqueen</Text>
                    </Link>
                  </Grid>
                  <Grid xs={24}>
                    <Link>
                      <Text b>2. thundergunexpress</Text>
                    </Link>
                  </Grid>
                  <Grid xs={24}>
                    <Link>
                      <Text b>3. l33t af</Text>
                    </Link>
                  </Grid>
                </Grid.Container>
              </Card.Body>
            </Card>
          </Grid>
        </Grid.Container>
        
        <Text h1>Completed Hit Feed</Text>
        
        <Input
          label="Search by game name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          clearable
        />
          <Table responsive bordered hover variant="dark">
          <Table.Head>
            <Table.Row>
              <Table.Header
                className="cursor-pointer"
                onClick={() => handleSort("verifyLink")}
              >
                The Hit
                {sort.field === "verifyLink" &&
                  (sort.order === "asc" ? "↑" : "↓")}
              </Table.Header>
              <Table.Header
                className="cursor-pointer"
                onClick={() => handleSort("contractConditions")}
              >
                Conditions
                {sort.field === "contractConditions" &&
                  (sort.order === "asc" ? "↑" : "↓")}
              </Table.Header>
              <Table.Header
                className="cursor-pointer"
                onClick={() => handleSort("bidAmount")}
              >
                Payout
                {sort.field === "bidAmount" &&
                  (sort.order === "asc" ? "↑" : "↓")}
              </Table.Header>
              <Table.Header
                className="cursor-pointer"
                onClick={() => handleSort("targetPlayer")}
              >
                Mark
                {sort.field === "targetPlayer" &&
                  (sort.order === "asc" ? "↑" : "↓")}
              </Table.Header>
              <Table.Header
                className="cursor-pointer"
                onClick={() => handleSort("gameTitle")}
              >
                Game{" "}
                {sort.field === "gameTitle" &&
                  (sort.order === "asc" ? "↑" : "↓")}
              </Table.Header>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {paginatedContracts.map((contract) => (
              <Table.Row key={contract.id.S}>
                <Table.Cell>
                  {contract.verifyLink && (
                    <iframe
                      width="100%"
                      height="100"
                      src={getEmbedUrl(contract.verifyLink.S)}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  )}
                </Table.Cell>
                <Table.Cell>{contract.contractConditions.S}</Table.Cell>
                <Table.Cell>{formatCurrency(contract.bidAmount.N)}</Table.Cell>
                <Table.Cell>{contract.targetPlayer.S}</Table.Cell>
                <Table.Cell>{contract.gameTitle.S}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
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
                        onClick={() =>
                          setPagination({ ...pagination, current: i + 1 })
                        }
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
                    <p>
                      {selectedContract && formatDate(selectedContract.expDate?.S)}
                    </p>
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