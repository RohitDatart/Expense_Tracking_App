import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
// import Transaction from "./pages/Transaction/transaction";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* <Route path="/trans" element={<Transaction />} /> */}
      </Routes>
    </Router>
  );
}
