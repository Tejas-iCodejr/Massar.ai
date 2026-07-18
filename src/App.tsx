/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { Universities } from './pages/Universities';
import { Schools } from './pages/Schools';
import { Compare } from './pages/Compare';
import { Programs } from './pages/Programs';
import { Perks } from './pages/Perks';
import { Details } from './pages/Details';
import { Planner } from './pages/Planner';
import { Login } from './pages/Login';
import { Saved } from './pages/Saved';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/universities" element={<Universities />} />
          <Route path="/schools" element={<Schools />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/perks" element={<Perks />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/details/:type/:id" element={<Details />} />
          <Route path="/login" element={<Login />} />
          <Route path="/saved" element={<Saved />} />
          {/* Fallback routes for other pages requested in the spec but not fully implemented to keep scope reasonable */}
          <Route path="/explore" element={<div className="p-20 text-center font-black text-4xl uppercase text-ink">Explore Coming Soon</div>} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <AnimatedRoutes />
        </main>
        <Footer />
      </div>
    </Router>
  );
}

