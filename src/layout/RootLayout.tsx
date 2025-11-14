import { Outlet } from "react-router";
import Navbar from "../components/NavBar";

export default function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Outlet />
    </div>
  );
}
