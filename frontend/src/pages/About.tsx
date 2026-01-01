import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const features = [
  {
    title: '3 Moteurs d\'inférence',
    description: 'Chaînage avant, arrière et mixte pour une analyse complète des vulnérabilités.'
  },
  {
    title: 'Trace d\'inférence',
    description: 'Explication complète du raisonnement étape par étape.'
  },
  {
    title: '50 règles expertes',
    description: 'Base de connaissances couvrant ports, SSL, SSH, permissions, logiciels et réseau.'
  },
  {
    title: 'Analyse instantanée',
    description: 'Détection en temps réel avec recommandations de correction.'
  },
]

export function About() {
  return (
    <div className="min-h-screen pt-24 md:pt-28 pb-16 px-4 md:px-6 bg-zinc-900 relative">
      {/* Grid background */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(63, 63, 70, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(63, 63, 70, 0.4) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/50 via-transparent to-zinc-900 pointer-events-none" />
      <div className="max-w-3xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 md:mb-16">
          <Link to="/" className="text-zinc-500 text-sm hover:text-zinc-300 transition-colors inline-block mb-4 md:mb-6">
            ← Retour
          </Link>
          <h1 className="text-2xl md:text-4xl font-semibold text-white mb-2 md:mb-3">À propos</h1>
          <p className="text-zinc-400 text-base md:text-lg">
            Système expert pour la détection automatisée de vulnérabilités serveur.
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-12 md:mb-20"
        >
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 md:p-6 hover:border-zinc-700 transition-colors"
            >
              <h3 className="font-medium text-white mb-2">{f.title}</h3>
              <p className="text-zinc-400 text-sm">{f.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Architecture */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-12 md:mb-20"
        >
          <h2 className="text-xl md:text-2xl font-medium text-white mb-6 md:mb-8">Architecture</h2>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 md:p-8 overflow-x-auto">
            <div className="flex items-center justify-between min-w-[500px] md:min-w-0">
              {[
                { num: '1', label: 'Entrée', desc: 'Configuration' },
                { num: '2', label: 'Moteur', desc: '3 chaînages' },
                { num: '3', label: 'Base', desc: '50 règles' },
                { num: '4', label: 'Sortie', desc: 'Diagnostic' },
              ].map((item, i) => (
                <div key={item.num} className="flex items-center">
                  <div className="text-center">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center mb-2 md:mb-3">
                      <span className="text-blue-400 font-mono text-base md:text-lg">{item.num}</span>
                    </div>
                    <div className="text-xs md:text-sm font-medium text-white">{item.label}</div>
                    <div className="text-xs text-zinc-500">{item.desc}</div>
                  </div>
                  {i < 3 && (
                    <div className="w-8 md:w-16 h-px bg-zinc-700 mx-2 md:mx-4" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Credits */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 md:p-8 text-center"
        >
          <h3 className="font-medium text-white mb-3">Projet académique</h3>
          <p className="text-zinc-400 text-sm">4INFO 2025-2026 · Fondements de l'IA</p>
          <p className="text-zinc-300 text-sm mt-2">Réalisé par: Mohamed Aziz Mansour</p>
          <p className="text-zinc-500 text-sm mt-1">Tuteur: F. SBIAA</p>
        </motion.div>
      </div>
    </div>
  )
}
