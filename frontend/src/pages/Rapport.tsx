import { motion } from 'framer-motion'

export function Rapport() {
  return (
    <div className="min-h-screen bg-zinc-900 pt-24 md:pt-28 pb-6 md:pb-8 px-4 md:px-6 relative overflow-hidden">
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
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto relative z-10"
      >
        <div className="text-center mb-4 md:mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-white mb-2">Rapport du Projet</h1>
          <p className="text-zinc-400 text-sm md:text-base">Documentation complète du système expert Vultester</p>
        </div>
        
        <div className="h-[calc(100vh-12rem)] md:h-[calc(100vh-14rem)] rounded-xl border border-zinc-800 bg-zinc-950/50 backdrop-blur-sm overflow-hidden">
          <iframe
            src={`${import.meta.env.BASE_URL}IA.pdf`}
            className="w-full h-full"
            title="Rapport du projet"
          />
        </div>
      </motion.div>
    </div>
  )
}
