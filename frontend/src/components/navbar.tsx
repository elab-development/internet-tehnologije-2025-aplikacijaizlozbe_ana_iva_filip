import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 text-sm rounded ${
      isActive ? "bg-gray-200" : "hover:bg-gray-100"
    }`;

  return (
    <header className="w-full border-b bg-white">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-semibold">
          Izložbe
        </Link>

        <nav className="flex gap-2">
          <NavLink to="/" className={linkClass}>
            Početna
          </NavLink>
          <NavLink to="/login" className={linkClass}>
            Login
          </NavLink>
          <NavLink to="/register" className={linkClass}>
            Register
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
