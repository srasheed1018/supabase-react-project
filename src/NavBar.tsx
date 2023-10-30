import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from './App';
import Login from "./Login";
import UserMenu from "./UserMenu";
import thinksLogo from "./assets/thinks_logo.svg"

export default function NavBar() {
    const { session } = useContext(UserContext);
    return (
        <>
        <nav className="nav-bar">
            <Link className="nav-logo-link" to="/">
                <img 
                    id="logo"
                    className="nav-logo"
                    src= {thinksLogo}
                    alt="logo"
                />
            </Link>
        </nav>
        </>
    );
}