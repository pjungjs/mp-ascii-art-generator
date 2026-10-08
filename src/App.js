import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Components
import NavBar from "./componentes/common/NavBar";
import Home from "./componentes/pages/Home";
import How from "./componentes/pages/How";
import About from "./componentes/pages/About";

function App() {
  return (
    <div className="App">
      <Router>
        <NavBar />

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/how" element={<How />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;
