import './App.css';
import React from "react";
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import NoteState from './context/notes/NoteState';
import Alert from './components/Alert';
import Login from './components/Login';
import Signup from './components/Signup';
import { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

function App() {
  const [alert, setAlert] = useState(null);
  const showAlert = (message, type)=>{
    setAlert({
      msg: message,
      type: type
    })
    setTimeout(() => {    //settimeout function
      setAlert(null)
    }, 2000);
  }


  return (
    <>
    <NoteState>
    <Router>

      <Navbar />
      {/* <Alert message="This is amazing react cource"/> */}
      <Alert alert={alert}/>
      <div className="container">
    <Routes>

    <Route exact path="/" element={<Home showAlert={showAlert} />} />
    <Route exact path="/about" element={<About />} />
    <Route exact path="/login" element={<Login showAlert={showAlert} />} />
    <Route exact path="/signup" element={<Signup showAlert={showAlert} />} />

    </Routes>
    </div>
    </Router>
    </NoteState>
    </>
  );
}

export default App;
