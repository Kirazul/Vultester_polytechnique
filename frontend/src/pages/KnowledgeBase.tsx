import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Rule } from '@/types'
import { API_URL } from '@/config/api'

export function KnowledgeBase() {
  const [rules, setRules] = useState<Rule[]>([])
  const [filter, setFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch(`${API_URL}/api/rules`)
      .then(r => r.json())
      .then(d => setRules(d.rules))
      .catch(() => setRules([]))
  }, [])

  const filtered = rules.filter(r => {
    const matchFilter = filter === 'all' || r.severity === filter
    const matchCategory = categoryFilter === 'all' || r.id.startsWith(categoryFilter)
    const matchSearch = search === '' || 
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchCategory && matchSearch
  })

  const severityLabels: Record<string, string> = {
    critical: 'Critique',
    dangerous: 'Dangereux',
    warning: 'Attention',
    info: 'Info'
  }

  const severityColors: Record<string, string> = {
    critical: 'bg-red-500/10 text-red-400 border-red-500/20',
    dangerous: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
  }

  const categories = [
    { id: 'all', label: 'Toutes' },
    { id: 'PORT', label: 'Ports' },
    { id: 'SSL', label: 'SSL/TLS' },
    { id: 'SSH', label: 'SSH' },
    { id: 'PERM', label: 'Permissions' },
    { id: 'SOFT', label: 'Logiciels' },
    { id: 'NET', label: 'Réseau' }
  ]

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
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 md:mb-12">
          <Link to="/" className="text-zinc-500 text-sm hover:text-zinc-300 transition-colors inline-block mb-4 md:mb-6">
            ← Retour
          </Link>
          <h1 className="text-2xl md:text-4xl font-semibold text-white mb-2 md:mb-3">Base de connaissances</h1>
          <p className="text-zinc-400 text-base md:text-lg">
            50 règles expertes pour la détection de vulnérabilités serveur.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col gap-4 mb-10"
        >
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-12 px-5 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
          
          {/* Category Filters */}
          <div>
            <p className="text-zinc-500 text-xs font-medium mb-2 uppercase tracking-wider">Catégories</p>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`px-3 md:px-4 h-10 md:h-11 rounded-xl text-xs md:text-sm font-medium transition-all ${
                    categoryFilter === cat.id
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                      : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Severity Filters */}
          <div>
            <p className="text-zinc-500 text-xs font-medium mb-2 uppercase tracking-wider">Sévérité</p>
            <div className="flex flex-wrap gap-2">
              {['all', 'critical', 'dangerous', 'warning', 'info'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 md:px-5 h-10 md:h-12 rounded-xl text-xs md:text-sm font-medium transition-all ${
                    filter === f
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                      : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  {f === 'all' ? 'Tous' : severityLabels[f]}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Rules */}
        <div className="space-y-4">
          {filtered.map((rule, i) => (
            <motion.div
              key={rule.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-blue-400 text-lg">{rule.id}</span>
                  <span className="px-2 py-1 rounded-md text-xs font-medium bg-zinc-800 text-zinc-400 border border-zinc-700">
                    {rule.id.split('-')[0]}
                  </span>
                </div>
                <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${severityColors[rule.severity]}`}>
                  {severityLabels[rule.severity]}
                </span>
              </div>
              <p className="text-white mb-4">{rule.description}</p>
              <div className="text-sm font-mono bg-zinc-800/50 p-4 rounded-lg">
                <span className="text-zinc-500">SI </span>
                <span className="text-zinc-300">{rule.conditions.join(' ET ')}</span>
                <span className="text-zinc-500"> ALORS </span>
                <span className="text-blue-400">{rule.consequence}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-zinc-500">
            Aucune règle trouvée.
          </div>
        )}

        <p className="text-center text-zinc-500 text-sm mt-10">
          {filtered.length} règle{filtered.length > 1 ? 's' : ''} affichée{filtered.length > 1 ? 's' : ''}
        </p>
      </div>
    </div>
  )
}
