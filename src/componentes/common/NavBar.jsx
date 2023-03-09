import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <header>
      <h1>
        <Link to="/">ASCII Art Generator</Link>
      </h1>
    </header>
  );
}
