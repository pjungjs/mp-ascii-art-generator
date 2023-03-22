import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <header>
      <h2>
        <Link to="/">ASCII Art Generator</Link>
      </h2>
    </header>
  );
}
