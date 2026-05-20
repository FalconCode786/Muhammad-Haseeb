import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Work from './components/Work';
import Consultation from './components/Consultation';
import Contact from './components/Contact';
const AdminApp = lazy(() => import('./admin/AdminApp'));

// Public site layout
const PublicLayout = () => (
  <div className="bg-neutral-950 min-h-screen">
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
        <Route
          path="/admin/*"
          element={(
            <Suspense
              fallback={(
                <div className="min-h-screen bg-neutral-950 text-neutral-400 flex items-center justify-center">
                  Loading...
                </div>
              )}
            >
              <AdminApp />
            </Suspense>
          )}
        />

        {/* Public site */}
        <Route path="/*" element={<PublicLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
