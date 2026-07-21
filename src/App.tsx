/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Route-based code splitting
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Universities = lazy(() => import('./pages/Universities').then(m => ({ default: m.Universities })));
const Schools = lazy(() => import('./pages/Schools').then(m => ({ default: m.Schools })));
const Compare = lazy(() => import('./pages/Compare').then(m => ({ default: m.Compare })));
const Programs = lazy(() => import('./pages/Programs').then(m => ({ default: m.Programs })));
const Perks = lazy(() => import('./pages/Perks').then(m => ({ default: m.Perks })));
const Details = lazy(() => import('./pages/Details').then(m => ({ default: m.Details })));
const Planner = lazy(() => import('./pages/Planner').then(m => ({ default: m.Planner })));
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const Saved = lazy(() => import('./pages/Saved').then(m => ({ default: m.Saved })));

function PageFallback() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-12 text-center">
      <div className="w-10 h-10 border-3 border-[#8ed462] border-t-transparent rounded-full animate-spin mb-4" />
      <span className="font-sans text-xs font-bold uppercase tracking-wider text-stone-gray animate-pulse">
        Loading view...
      </span>
    </div>
  );
}

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
        <Suspense fallback={<PageFallback />}>
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
          </Routes>
        </Suspense>
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

