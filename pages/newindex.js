import { useEffect, useState } from 'react';
import axios from 'axios';
import 'tailwindcss/tailwind.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../components/Navbar';
import { Button, Card, Grid, Input, Pagination, Table, Text, useToasts, Search } from '@nextui-org/react';


function Main() {
    const [contracts, setContracts] = useState([]);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sort, setSort] = useState({ field: '', order: '' });
    const [show, setShow] = useState(false);
    const [selectedContract, setSelectedContract] = useState(null);
  
    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await axios.get('/api/readContracts');
          console.log('Contracts data:', response.data.data);
          const filteredData = response.data.data.filter(
            (contract) => contract.contractStatus?.S === 'closed'
          );
          setContracts(filteredData);
        } catch (error) {
          console.error('Error fetching contracts', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, []);
    const columns = [
      { title: 'Game', key: 'gameTitle', dataIndex: 'gameTitle.S', sorter: () => handleSort('gameTitle') },
      { title: 'Mark', key: 'targetPlayer', dataIndex: 'targetPlayer.S', sorter: () => handleSort('targetPlayer') },
      // Add more columns as needed
    ];

    function handlePaginationChange(newPagination) {
      console.log('handlePaginationChange - newPagination:', newPagination);
      setPagination(newPagination);
    }
  
    function handleSearch(event) {
      console.log('handleSearch - searchTerm:', event.target.value);
      setSearchTerm(event.target.value);
    }
  
    function handleSort(field) {
      console.log('handleSort - field:', field);
      if (sort.field === field) {
        setSort({ ...sort, order: sort.order === 'asc' ? 'desc' : 'asc' });
      } else {
        setSort({ field, order: 'asc' });
      }
    }
  
    function handleViewContract(contract) {
      console.log('handleViewContract - contract:', contract);
      setSelectedContract(contract);
      setShow(true);
    }
  
    function handleClose() {
      console.log('handleClose');
      setSelectedContract(null);
      setShow(false);
    }

    const filteredContracts = contracts.filter((contract) =>
      contract &&
      contract.gameTitle.S.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    const sortedContracts = sort.field
      ? filteredContracts.sort((a, b) => {
          if (sort.field === 'bidAmount') {
            const fieldA = parseFloat(a[sort.field].N);
            const fieldB = parseFloat(b[sort.field].N);
            return sort.order === 'asc' ? fieldA - fieldB : fieldB - fieldA;
          } else {
            const fieldA = a[sort.field].S.toLowerCase();
            const fieldB = b[sort.field].S.toLowerCase();
            if (fieldA < fieldB) {
              return sort.order === 'asc' ? -1 : 1;
            }
            if (fieldA > fieldB) {
              return sort.order === 'asc' ? 1 : -1;
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
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);
    }
  
    function formatDate(dateString) {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US').format(date);
    }
    
     function getEmbedUrl(url) {
      // Use regex to extract YouTube video ID from the given URL
      const videoIdRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?/;
      const match = url.match(videoIdRegex);
    
      // Extract the timestamp parameter from the URL
      const timestampRegex = /[?&]t=(\d+)/;
      const timestampMatch = url.match(timestampRegex);
      const timestamp = timestampMatch ? timestampMatch[1] : null;
    
      if (match && match[1]) {
        // If the video ID is found, return the embed URL
        let embedUrl = 'https://www.youtube.com/embed/' + match[1];
    
        // Append the timestamp parameter if it exists
        if (timestamp) {
          embedUrl += '?start=' + timestamp;
        }
    
        return embedUrl;
      } else {
        // If the video ID is not found, return the original URL (or an empty string if it's not a valid URL)
        return url ? url : '';
      }
    }
  
    return (
      <div className="bg-gray-900 min-h-screen text-white">
        <Navbar />
        <div className="container mx-auto px-4">
          <Grid.Container gap={2} alignItems="center" justifyContent="center">
            <Grid xs={12} md={6}>
              <Card hoverable className="w-full">
                <Text h3>Top Contractors</Text>
                <Text h5>by completion %</Text>
                <ul>
                  <li>1. n00bman</li>
                  <li>2. Assassin78</li>
                  <li>3. MemeLord72</li>
                </ul>
              </Card>
            </Grid>
            <Grid xs={12} md={6}>
              <Card hoverable className="w-full">
                <Text h3>Top Producer</Text>
                <Text h5>by completion %</Text>
                <ul className="text-right">
                  <li>1. catpissqueen</li>
                  <li>2. thundergunexpress</li>
                  <li>3. l33t af</li>
                </ul>
              </Card>
            </Grid>
          </Grid.Container>
          <div className="text-center mt-10">
            <Text h2 className="font-bold mb-8">Completed Hit Feed</Text>
          </div>
          <div className="mb-4">
            <Input
              className="bg-gray-700 text-white"
              placeholder="Search by game name"
              onChange={handleSearch}
              iconRight={<Search />}
              width="100%"
            />
          </div>
          <Table
            data={paginatedContracts.map(contract => ({
              ...contract,
              bidAmount: formatCurrency(contract.bidAmount.N),
            }))}
            columns={columns}
            striped
            hover
          />
          <div className="d-flex justify-content-center mt-4">
            <Pagination
              total={filteredContracts.length}
              pageSize={pagination.pageSize}
              initialPage={pagination.current}
              onChange={handlePaginationChange}
            />
          </div>
        </div>
      </div>
    );
  }
  
  export default Main;