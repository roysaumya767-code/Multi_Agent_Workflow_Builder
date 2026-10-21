import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from './pages/login.jsx';
import Workflow from './pages/workflow.jsx'
import { SocketProvider } from './context/Socket.jsx'





const App = () => {
  return (
    <SocketProvider>
      <BrowserRouter>
          <Routes>
      
            <Route path="/" element={<Login/>} />
            <Route path="/Workflow/:userID" element={
              <Workflow />
            }
             />
            
            

  
          </Routes>
      

      </BrowserRouter>
    </SocketProvider>

  )
}

export default App
