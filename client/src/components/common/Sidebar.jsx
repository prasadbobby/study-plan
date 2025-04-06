// client/src/components/common/Sidebar.jsx
import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="sidebar d-none d-lg-block">
      <Nav className="flex-column">
        <Nav.Link as={Link} to="/">Dashboard</Nav.Link>
        <Nav.Link as={Link} to="/generate">Generate Plan</Nav.Link>
        <Nav.Link as={Link} to="/history">History</Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;