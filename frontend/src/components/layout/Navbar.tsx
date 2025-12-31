import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import polyLogo from '@/assets/poly.png'

const links = [
  { href: '/', label: 'Accueil' },
  { href: '/scanner', label: 'Scanner' },
  { href: '/base', label: 'Base de règles' },
  { href: '/rapport', label: 'Rapport' },
  { href: '/presentation', label: 'Présentation' },
  { href: '/a-propos', label: 'À propos' },
]

export function Navbar() {
  const { pathname } = useLocation()

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-6 mt-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4 rounded-2xl bg-zinc-900/60 backdrop-blur-2xl border border-zinc-800/50">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            <span className="text-xl font-semibold tracking-tight text-white">
              Vultester
            </span>
          </Link>
          
          {/* Navigation */}
          <div className="flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                  pathname === link.href
                    ? 'text-white'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {pathname === link.href && (
                  <motion.div
                    layoutId="navbar-active"
                    className="absolute inset-0 bg-zinc-800 rounded-xl"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            ))}
          </div>

          {/* School Logo */}
          <img src={polyLogo} alt="École Polytechnique" className="h-15" />
        </div>
      </div>
    </motion.nav>
  )
}
