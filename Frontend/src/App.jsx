import "./Body.jsx";
import Home from "./Home.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Body from "./Body.jsx";

function App() {

  return (
    <div className='bg-black'>
      <Router>
        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/body" element={<Body />} />
          
        </Routes>
      </Router>
    </div>
  )
}

export default App
