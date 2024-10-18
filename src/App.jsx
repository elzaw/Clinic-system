import "./App.css";
// import Navbar from "./components/navbar";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Patients from "./pages/patients";
import Examinations from "./pages/examinations";
import AppLayout from "./AppLayout";
import Patient from "./pages/patient";
import { Toaster } from "react-hot-toast";
import Login from "./pages/login";
import { AuthProvider } from "./context/AuthContext";

import Register from "./pages/register/page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { path: "/patients", element: <Patients /> },
      { path: "/patient/:id", element: <Patient /> },
      { path: "/examinations", element: <Examinations /> },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
]);

function App() {
  // const [count, setCount] = useState(0)

  return (
    <AuthProvider
    // className="min-h-screen h-full bg-gradient-to-b from-gray-100 to-blue-100"
    >
      <div dir="rtl">
        <Toaster />
        <RouterProvider router={router} />
      </div>
    </AuthProvider>
  );
}

export default App;
