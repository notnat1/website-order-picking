import React from 'react';
import { Navbar, Container } from 'react-bootstrap';

const Header = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="#home">Aplikasi Inventaris</Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default Header;