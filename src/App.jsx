import "./App.css";
import Navbar from "./components/navbar";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Patients from "./components/patients";
import Examinations from "./components/examinations";
import AppLayout from "./AppLayout";
import Patient from "./components/patient";
import { Toaster } from "react-hot-toast";

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
]);

function App() {
  // const [count, setCount] = useState(0)

  return (
    <div
      className="min-h-screen  bg-gradient-to-b from-gray-100 to-blue-100"
      dir="rtl"
    >
      <Toaster />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
