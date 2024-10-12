import "./App.css";
// import Navbar from "./components/navbar";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Patients from "./components/patients";
import Examinations from "./components/examinations";
import AppLayout from "./AppLayout";
import Patient from "./components/patient";
import { Toaster } from "react-hot-toast";
import Login from "./components/login";
import { AuthProvider } from "./context/AuthContext";

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
]);

function App() {
  // const [count, setCount] = useState(0)

  return (
    <AuthProvider
      // className="min-h-screen h-full bg-gradient-to-b from-gray-100 to-blue-100"
      dir="rtl"
    >
      <Toaster />
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
