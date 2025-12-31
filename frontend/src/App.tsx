import { useState, useEffect } from 'react'
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Navbar } from './components/layout/Navbar'
import { Home } from './pages/Home'
import { Scanner } from './pages/Scanner'
import { KnowledgeBase } from './pages/KnowledgeBase'
import { About } from './pages/About'

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}

function AnimatedRoutes() {
  const location = useLocation()
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/scanner" element={<PageWrapper><Scanner /></PageWrapper>} />
        <Route path="/base" element={<PageWrapper><KnowledgeBase /></PageWrapper>} />
        <Route path="/a-propos" element={<PageWrapper><About /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  )
}

function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-50 bg-zinc-950 flex items-center justify-center"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <div className="text-2xl font-semibold text-white mb-6">Vultester</div>
        <div className="w-40 h-1 bg-zinc-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 1, repeat: 2, ease: 'easeInOut' }}
            className="h-full w-1/2 bg-blue-500"
          />
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <HashRouter>
      <AnimatePresence>
        {loading && <LoadingScreen />}
      </AnimatePresence>
      
      {!loading && (
        <>
          <Navbar />
          <AnimatedRoutes />
        </>
      )}
    </HashRouter>
  )
}
