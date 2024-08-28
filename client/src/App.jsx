import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Register from "./pages/Register";

import "bootstrap/dist/css/bootstrap.min.css";

import { Container } from "react-bootstrap";
import Navbar from "./components/Navbar";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { ChatContextProvider } from "./context/ChatContext";

function App() {
  const { user } = useContext(AuthContext);
  return (
    <ChatContextProvider user={user}>
      <Container>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={user ? <Chat /> : <Login />} />
            <Route path="/login" element={!user ? <Login /> : <Chat />} />
            <Route path="/register" element={!user ? <Register /> : <Chat />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </Container>
    </ChatContextProvider>
  );
}

export default App;
