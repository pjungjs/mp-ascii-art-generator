import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Components
import NavBar from "./componentes/common/NavBar";
import Footer from "./componentes/common/Footer";
import Home from "./componentes/pages/Home";

function App() {
  return (
    <div className="App">
      <Router>
        <NavBar />

        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>

        <Footer />
      </Router>
    </div>
  );
}

export default App;
