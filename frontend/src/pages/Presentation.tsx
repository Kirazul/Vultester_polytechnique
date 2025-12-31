import { motion } from 'framer-motion'
import { Download, ExternalLink } from 'lucide-react'

export function Presentation() {
  const pptxPath = `${import.meta.env.BASE_URL}presentation.pptx`
  
  // For deployed version, use the full GitHub Pages URL
  const publicUrl = 'https://kirazul.github.io/Vultester_polytechnique/presentation.pptx'
  const viewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(publicUrl)}`

  return (
    <div className="min-h-screen bg-zinc-900 pt-28 pb-8 px-6 relative overflow-hidden">
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
        <div className="text-center mb-6">
          <h1 className="text-3xl font-semibold text-white mb-2">Présentation</h1>
          <p className="text-zinc-400 mb-4">Slides de présentation du projet Vultester</p>
          <div className="flex items-center justify-center gap-4">
            <a 
              href={pptxPath}
              download="presentation.pptx"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Télécharger PPTX
            </a>
            <a 
              href={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(publicUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Ouvrir dans Office Online
            </a>
          </div>
        </div>
        
        <div className="h-[calc(100vh-16rem)] rounded-xl border border-zinc-800 bg-zinc-950/50 backdrop-blur-sm overflow-hidden">
          <iframe
            src={viewerUrl}
            className="w-full h-full"
            title="Présentation du projet"
            allowFullScreen
          />
        </div>
      </motion.div>
    </div>
  )
}
