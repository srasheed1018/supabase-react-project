import { createContext } from 'react';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import MessageBoard from './MessageBoard';
import AllPosts from './AllPosts';
import PostView from './PostView';
import Welcome, { welcomeLoader } from './Welcome';
import NavBar from './NavBar';
import { SupashipUserInfo, useSession } from './use-session';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <MessageBoard />,
        children: [
          {
            path: ":pageNumber",
            element: <AllPosts />,
          },
          {
            path: "post/:postId",
            element: <PostView />,
          }
        ]
      },
      {
        path: "welcome",
        element: <Welcome />,
        loader: welcomeLoader,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />
}


export const UserContext = createContext<SupashipUserInfo>({
  session: null,
  profile: null,
});

function Layout() {
  const supashipUserInfo = useSession();
  return (
    <>
      <UserContext.Provider value={supashipUserInfo}>
        <NavBar />
        <Outlet />
      </UserContext.Provider>
    </>
  );
}

export default App;