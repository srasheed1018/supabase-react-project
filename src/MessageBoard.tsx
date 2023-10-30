import { useContext } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { UserContext } from "./App";
import Login from "./Login";
import UserMenu from "./UserMenu";

export default function MessageBoard() {
    const userProfile = useContext(UserContext);
    const location = useLocation();
    let discussionRedirect = <></>;
    
    if (location.pathname==="/") {
      discussionRedirect = <Link to="/1"><h2 className="text-4xl text-center mb-1 pt-10 w-full">👉 view discussions 👈</h2></Link>
    }
    
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
        {discussionRedirect}
        <Outlet />
      </div>
    );
  }