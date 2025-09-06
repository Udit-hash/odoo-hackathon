import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { Signup } from './pages/signup';
import { Signin } from './pages/signin';
import { Appbar } from './components/Appbar';
import { Footer } from './components/Footer';
import { DashboardPage } from './pages/dashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ProjectPage } from "./pages/projectPages";

function App() {
    return (
        <BrowserRouter>
            <Appbar />
            <Routes>
                <Route
                    path="/dashboard"
                    element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}
                />
                <Route
                    path="/project/:projectId"
                    element={<ProtectedRoute><ProjectPage /></ProtectedRoute>}
                />
                <Route path="/" element={<Signup />} />
                <Route path="/signin" element={<Signin />} />
            </Routes>
            <Footer />
        </BrowserRouter>
    );
}

export default App;