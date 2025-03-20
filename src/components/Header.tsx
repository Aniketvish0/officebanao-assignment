import { Navbar, Container, Nav } from "react-bootstrap";
import Github from "../icons/Github";
const Header = () => {
  return (
    <Navbar bg="light" variant="light" fixed="top">
      <Container>
        <Navbar.Brand>Imagify</Navbar.Brand>
        <Nav className="ms-auto">
          <Nav.Link href="https://github.com/aniketvish0/officebanao-assignment" target="_blank" rel="noopener noreferrer">
            <Github/> Github
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;
