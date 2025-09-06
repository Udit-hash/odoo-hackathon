
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import './App.css'
import { Signup } from './pages/signup'
import { Signin } from './pages/signin'
function App() {

  return (
    

      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
        </Routes>
      </BrowserRouter>

      
   
  )
}

export default App
