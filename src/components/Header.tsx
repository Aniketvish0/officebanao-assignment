import { Navbar, Container, Nav } from "react-bootstrap";
import Github from "../icons/Github";
const Header = () => {
  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="#">Imagify</Navbar.Brand>
        <Nav className="ms-auto">
          <Nav.Link href="https://github.com/aniketvish0/officebanao-assignment" target="_blank" rel="noopener noreferrer">
            <Github/>
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;
