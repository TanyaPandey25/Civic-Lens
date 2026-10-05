import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import ReportIssue from "./pages/ReportIssue";
import BrowseIssues from "./pages/BrowseIssues";
import IssueDetails from "./pages/IssueDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
    return (
        <BrowserRouter>
            <Navbar />

            <Routes>
                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/report"
                    element={<ReportIssue />}
                />

                <Route
                    path="/issues"
                    element={<BrowseIssues />}
                />

                <Route
                    path="/issues/:id"
                    element={<IssueDetails />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />
            </Routes>

            <Footer />
        </BrowserRouter>
    );
}

export default App;