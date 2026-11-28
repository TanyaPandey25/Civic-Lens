
import { useEffect } from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    useLocation
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import ReportIssue from "./pages/ReportIssue";
import BrowseIssues from "./pages/BrowseIssues";
import IssueDetails from "./pages/IssueDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";

import PlumberPreview from "./components/companions/PlumberPreview";

import { AuthProvider } from "./context/AuthContext";

function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        
        window.scrollTo(0, 0);
        
    }, [pathname]);

    return null;
}

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <ScrollToTop />

                <Navbar />

                <Routes>
                    <Route path="/" element={<Home />} />

                    <Route
                        path="/report"
                        element={
                            <ProtectedRoute allowedRole="STUDENT">
                                <ReportIssue />
                            </ProtectedRoute>
                        }
                    />

                    <Route path="/issues" element={<BrowseIssues />} />

                    <Route
                        path="/issues/:id"
                        element={<IssueDetails />}
                    />

                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route
                        path="/plumber-preview"
                        element={<PlumberPreview />}
                    />
                </Routes>

                <Footer />
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
