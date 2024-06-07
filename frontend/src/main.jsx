import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import SignIn from './pages/SignIn';
import SignUp from './pages/Signup';
import Dashboard from './pages/Dashboard';


const router = createBrowserRouter([
  {
    path: "/signUp",
    element: <SignUp />,
  },
  {
    path: "/signIn",
    element: <SignIn />,
  },
  {
    path: "/",
    element: <Dashboard />
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
   <RouterProvider router={router} />
  </React.StrictMode>,
)
