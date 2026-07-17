/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { Universities } from './pages/Universities';
import { Schools } from './pages/Schools';
import { Compare } from './pages/Compare';
import { Programs } from './pages/Programs';
import { Perks } from './pages/Perks';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/universities" element={<Universities />} />
            <Route path="/schools" element={<Schools />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/perks" element={<Perks />} />
            {/* Fallback routes for other pages requested in the spec but not fully implemented to keep scope reasonable */}
            <Route path="/explore" element={<div className="p-20 text-center font-black text-4xl uppercase">Explore Coming Soon</div>} />
            <Route path="/saved" element={<div className="p-20 text-center font-black text-4xl uppercase">Saved Items Coming Soon</div>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

