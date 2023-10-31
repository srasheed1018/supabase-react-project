import { Link } from 'react-router-dom';
import thinksLogo from "./assets/thinks_logo.svg"

export default function NavBar() {
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