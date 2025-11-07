import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ListGroup, Alert } from 'react-bootstrap';

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/items');
        setItems(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <Alert variant="danger">Error: {error}</Alert>;

  return (
    <ListGroup>
      {items.length > 0 ? (
        items.map(item => (
          <ListGroup.Item key={item.id}>
            {item.nama} - Stok: {item.stok}
          </ListGroup.Item>
        ))
      ) : (
        <ListGroup.Item>Belum ada item.</ListGroup.Item>
      )}
    </ListGroup>
  );
};

export default ItemList;