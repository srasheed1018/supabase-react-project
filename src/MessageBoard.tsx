import { useContext } from "react";
import { Link, Outlet } from "react-router-dom";
import { UserContext } from "./App";
import Login from "./Login";
import UserMenu from "./UserMenu";

export default function MessageBoard() {
    const userProfile = useContext(UserContext);
    return (
      <div className="message-board-container">
        {userProfile.session ? (
          <>
          <h2
            className="message-board-login-message"
          >
            <UserMenu />
          </h2>
          </>
        ) : (
          <h2
            className="message-board-login-message"
            data-e2e="message-board-login"
          >
            Yo, <Login /> to post.
          </h2>
        )}
        <Link to="/1">
          <h2 className="message-board-header-link">Message Board</h2>
        </Link>
        <Outlet />
      </div>
    );
  }