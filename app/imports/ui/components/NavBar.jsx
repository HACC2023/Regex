import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { NavLink } from 'react-router-dom';
import { Roles } from 'meteor/alanning:roles';
import { Container, Nav, Navbar, NavDropdown, Button, Image } from 'react-bootstrap';
import { BoxArrowRight, PersonFill, PersonPlusFill } from 'react-bootstrap-icons';

const handleGenerateEmbeddings = () => {
  Meteor.call('generateAndStoreEmbeddings', (err) => {
    if (err) {
      alert('Error:', err.reason);
    } else {
      alert('Embeddings generated and stored successfully');
    }
  });
};

const handleBuildFAISSIndex = () => {
  Meteor.call('buildFAISSIndex', (err) => {
    if (err) {
      console.error('Error building FAISS index:', err);
      alert(`Error: ${err.reason}`);
    } else {
      alert('FAISS index built and saved successfully');
    }
  });
};

const NavBar = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { currentUser } = useTracker(() => ({
    currentUser: Meteor.user() ? Meteor.user().username : '',
  }), []);

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand as={NavLink} to="/" style={{ marginRight: 20 }}>
          <Image src="https://www.hawaii.edu/its/wp-content/themes/system2018/images/uh-nameplate.png" width="450vw" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto justify-content-start">
            {currentUser ? ([
              // <Nav.Link id="add-stuff-nav" as={NavLink} to="/add" key="add">Add Stuff</Nav.Link>,
              // <Nav.Link id="list-stuff-nav" as={NavLink} to="/list" key="list">List Stuff</Nav.Link>,
            ]) : ''}
            {Roles.userIsInRole(Meteor.userId(), 'admin') ? ([
              <Nav.Link id="list-stuff-admin-nav" as={NavLink} to="/admin" key="admin">Admin</Nav.Link>,
              <Button variant="link" onClick={handleGenerateEmbeddings} style={{ color: 'black', textDecoration: 'none' }}>Generate Embeddings</Button>,
              <Button variant="link" onClick={handleBuildFAISSIndex} style={{ color: 'black', textDecoration: 'none' }}>Build FAISS Index</Button>,
            ]) : ''}
          </Nav>
          <Nav className="justify-content-end">
            {currentUser === '' ? (
              <NavDropdown id="login-dropdown" title="Login">
                <NavDropdown.Item id="login-dropdown-sign-in" as={NavLink} to="/signin">
                  <PersonFill />
                  Sign
                  in
                </NavDropdown.Item>
                <NavDropdown.Item id="login-dropdown-sign-up" as={NavLink} to="/signup">
                  <PersonPlusFill />
                  Sign
                  up
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <NavDropdown id="navbar-current-user" title={currentUser}>
                <NavDropdown.Item id="navbar-sign-out" as={NavLink} to="/signout">
                  <BoxArrowRight />
                  {' '}
                  Sign
                  out
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
