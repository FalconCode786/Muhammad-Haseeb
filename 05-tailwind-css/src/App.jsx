import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Work from './components/Work';
import Consultation from './components/Consultation';
import Contact from './components/Contact';
import AdminApp from './admin/AdminApp';

// Public site layout
const PublicLayout = () => (
  <div className="bg-slate-950 min-h-screen text-slate-100">
    <Navbar />
    <Hero />
    <About />
    <Services />
    <Work />
    <Consultation />
    <Contact />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin routes */}
        <Route path="/admin/*" element={<AdminApp />} />

        {/* Public site */}
        <Route path="/*" element={<PublicLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
