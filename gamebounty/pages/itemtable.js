import React, { useState, useEffect } from 'react';

function ItemTable() {
    const [items, setItems] = useState(null);

  const [sortField, setSortField] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    async function fetchItems() {
      const response = await fetch('/api/items');
      const data = await response.json();
      if (Array.isArray(data)) {
        setItems(data);
      }
    }
    fetchItems();
  }, []);

  function handleSort(field) {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  }

  function sortItems(items) {
    const sortedItems = [...items];
    sortedItems.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (aValue < bValue) {
        return sortOrder === 'asc' ? -1 : 1;
      } else if (aValue > bValue) {
        return sortOrder === 'asc' ? 1 : -1;
      } else {
        return 0;
      }
    });
    return sortedItems;
  }

  const sortedItems = sortItems(items);

  return (
    <div>
      <h1>Item Table</h1>
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('id')}>ID</th>
            <th onClick={() => handleSort('name')}>Name</th>
            <th onClick={() => handleSort('price')}>Price</th>
            <th onClick={() => handleSort('quantity')}>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {sortedItems.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.price}</td>
              <td>{item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ItemTable;
