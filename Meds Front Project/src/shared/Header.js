
import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import { removeAuthUser, getAuthUser } from "../helper/Storage";
import { useNavigate } from "react-router-dom";



const Header = () => {
const navigate = useNavigate();
const auth = getAuthUser();
const Logout = () => {
removeAuthUser();
navigate("/Login");
};

return (
<>
    <Navbar bg="success" variant="success" className="text-white">
    <Container >
        <Navbar.Brand>
        <Link className="nav-link text-white" to={"/"}>
            Med app
        </Link>
        </Navbar.Brand>
        <Nav className="me-auto">
        {/* <Link className="nav-link text-whit" to={"/ListMedicines"}>
            List Medicines
        </Link> */}

        {/* unAuthenticated Route  */}
        {!auth && (
            <>
            <Link className="nav-link text-whit" to={"/login"}>
                Login
            </Link>
            <Link  className="nav-link text-whit" to={"/Register"}>
                Register
            </Link>
            </>
        )}

        {/* Admin Routes  */}

        {auth && auth.role === 1 && (
            <>
                <Link className="nav-link text-whit " to={"/Manage-Medicines"}>
                    Manage Medicines
                </Link>
                <Link className="nav-link text-whit " to={"/Manage-Categories"}>
                    Manage Categories
                </Link>
                <Link className="nav-link text-whit " to={"/Manage-Requests"}>
                    Manage Orders
                </Link>
                <Link className="nav-link text-whit " to={"/Manage-Patients"}>
                    Manage Patients
                </Link>
            
            </>
        )}
                {auth && auth.role === 0 && (
            <>
                <Link className="nav-link text-whit " to={"/RequestsOfUser"}>
                    My Requests
                </Link>
            </>
        )}

{auth &&  (
            <>
        <Link className="nav-link text-whit" to={"/ListMedicines"}>
            List Medicines
        </Link>
            </>
        )}
        </Nav>

        <Nav className="ms-auto">
        {/* Authenticated Routes  */}
        {auth && <Nav.Link onClick={Logout}>Logout</Nav.Link>}
        </Nav>
    </Container>
    </Navbar>
</>
);
};

export default Header;

