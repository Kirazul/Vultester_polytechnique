import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

export function Home() {
  return (
    <div className="h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden bg-zinc-900">
      {/* Grid background */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(63, 63, 70, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(63, 63, 70, 0.4) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/50 via-transparent to-zinc-900 pointer-events-none" />
      {/* Gradient blurs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-500/15 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="text-center max-w-2xl relative z-10"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-zinc-500 text-sm tracking-[0.2em] uppercase mb-8"
        >
          Système Expert de Sécurité
        </motion.p>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-5xl md:text-6xl font-semibold tracking-tight leading-[1.1] mb-6 text-white"
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
          className="text-zinc-400 text-lg mb-12 max-w-md mx-auto"
        >
          Analysez la configuration de votre serveur avec notre moteur d'inférence à chaînage avant.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex items-center justify-center gap-4"
        >
          <Link to="/scanner">
            <Button size="lg">Lancer l'analyse</Button>
          </Link>
          <Link to="/base">
            <Button variant="secondary" size="lg">Voir les règles</Button>
          </Link>
        </motion.div>
      </motion.div>
      
      {/* Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-16 flex gap-20"
      >
        {[
          { value: '50', label: 'Règles expertes' },
          { value: '4', label: 'Niveaux de sévérité' },
          { value: '7', label: 'Catégories' },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-3xl font-semibold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-zinc-500">{stat.label}</div>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
