import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { Signup } from './pages/signup';
import { Signin } from './pages/signin';
import { Appbar } from './components/Appbar';
import { Footer } from './components/Footer';
import { Dashboard } from './pages/dashboard';


function App() {
    return (
        <BrowserRouter>
            <Appbar />
            <Routes>
                <Route path="/dashboard" element={<Dashboard />}/>
               
                <Route path="/" element={<Signup />} />
                <Route path="/signin" element={<Signin />} />
            </Routes>
            <Footer />
        </BrowserRouter>
    );
}

export default App;