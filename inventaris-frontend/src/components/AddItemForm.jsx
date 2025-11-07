import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';

const AddItemForm = () => {
  const [nama, setNama] = useState('');
  const [stok, setStok] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logika untuk mengirim data ke API akan ditambahkan di sini
    console.log({ nama, stok });
    setNama('');
    setStok('');
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>Tambah Item Baru</Card.Title>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formItemName">
            <Form.Label>Nama Item</Form.Label>
            <Form.Control
              type="text"
              placeholder="Masukkan nama item"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formItemStock">
            <Form.Label>Stok</Form.Label>
            <Form.Control
              type="number"
              placeholder="Masukkan jumlah stok"
              value={stok}
              onChange={(e) => setStok(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Tambah Item
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default AddItemForm;