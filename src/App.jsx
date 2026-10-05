import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Project from './pages/Project';
import CreativeDesign from './pages/projects/CreativeDesign';
import Multimedia from './pages/projects/Multimedia';
import ITSolution from './pages/projects/ITSolution';
import WebDevelopment from './pages/projects/WebDevelopment';
import CCTVSpecialist from './pages/projects/CCTVSpecialist';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Admin route — standalone, handles its own login */}
        <Route path="/admin" element={<Admin />} />

        {/* All other routes — with Navbar */}
        <Route path="*" element={
          <>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/project" element={<Project />} />
              <Route path="/project/creative-design" element={<CreativeDesign />} />
              <Route path="/project/multimedia" element={<Multimedia />} />
              <Route path="/project/it-solution" element={<ITSolution />} />
              <Route path="/project/web-development" element={<WebDevelopment />} />
              <Route path="/project/cctv-specialist" element={<CCTVSpecialist />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </>
        } />
      </Routes>
    </Router>
  );
}
