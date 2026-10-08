import { Link, NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <header>
      <h2>
        <Link to="/">ASCII Art Generator</Link>
      </h2>
      <nav>
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/how">How it works</NavLink>
        <NavLink to="/about">About</NavLink>
      </nav>
    </header>
  );
}
