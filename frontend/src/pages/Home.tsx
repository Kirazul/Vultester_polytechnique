import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

export function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 md:px-6 relative overflow-hidden bg-zinc-900">
      {/* Grid background */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(63, 63, 70, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(63, 63, 70, 0.4) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/50 via-transparent to-zinc-900 pointer-events-none" />
      {/* Gradient blurs */}
      <div className="absolute top-1/4 left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue-500/15 rounded-full blur-[100px] md:blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-indigo-500/15 rounded-full blur-[100px] md:blur-[120px] pointer-events-none" />
      
      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="text-center max-w-2xl relative z-10 pt-20 md:pt-0"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-zinc-500 text-xs md:text-sm tracking-[0.15em] md:tracking-[0.2em] uppercase mb-6 md:mb-8"
        >
          Système Expert de Sécurité
        </motion.p>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.1] mb-4 md:mb-6 text-white"
        >
          Détection de
          <br />
          <span className="text-blue-500">Vulnérabilités</span>
          <br />
          Serveur
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-zinc-400 text-base md:text-lg mb-8 md:mb-12 max-w-md mx-auto px-4"
        >
          Analysez la configuration de votre serveur avec nos 3 moteurs d'inférence.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4"
        >
          <Link to="/scanner" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto">Lancer l'analyse</Button>
          </Link>
          <Link to="/base" className="w-full sm:w-auto">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">Voir les règles</Button>
          </Link>
        </motion.div>
      </motion.div>
      
      {/* Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 md:bottom-16 flex gap-8 sm:gap-12 md:gap-20"
      >
        {[
          { value: '50', label: 'Règles expertes' },
          { value: '4', label: 'Niveaux de sévérité' },
          { value: '3', label: 'Chaînages' },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-xl sm:text-2xl md:text-3xl font-semibold text-white mb-1">{stat.value}</div>
            <div className="text-xs md:text-sm text-zinc-500">{stat.label}</div>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
