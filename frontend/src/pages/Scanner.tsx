import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { categories, configOptions, mutualExclusions } from '@/data/config'
import { AnalysisResult } from '@/types'
import { API_URL } from '@/config/api'

const chainingMethods = [
  { 
    id: 'forward', 
    label: 'Chaînage Avant', 
    description: 'Part des faits connus pour déduire de nouvelles conclusions. Méthode classique des systèmes experts.'
  },
  { 
    id: 'backward', 
    label: 'Chaînage Arrière', 
    description: 'Part des buts (vulnérabilités) et vérifie si les faits les prouvent. Approche orientée objectif.'
  },
  { 
    id: 'mixed', 
    label: 'Chaînage Mixte', 
    description: 'Combine avant et arrière pour une analyse plus complète et exhaustive.'
  },
]

export function Scanner() {
  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [selectedMethod, setSelectedMethod] = useState<string>('forward')
  const [analyzing, setAnalyzing] = useState(false)
  const [results, setResults] = useState<AnalysisResult | null>(null)

  // Total steps = categories + 1 (method selection)
  const totalSteps = categories.length + 1
  const isMethodStep = step === categories.length
  const currentCategory = !isMethodStep ? categories[step] : null
  const options = currentCategory ? configOptions.filter(o => o.category === currentCategory.id) : []
  const progress = ((step + 1) / totalSteps) * 100

  // Vérifie si une option est désactivée à cause d'une exclusion mutuelle
  const isDisabled = (fact: string): boolean => {
    for (const selectedFact of selected) {
      const exclusions = mutualExclusions[selectedFact]
      if (exclusions && exclusions.includes(fact)) {
        return true
      }
    }
    return false
  }

  const toggle = (fact: string) => {
    if (isDisabled(fact)) return
    
    const next = new Set(selected)
    if (next.has(fact)) {
      next.delete(fact)
    } else {
      // Supprimer les options mutuellement exclusives
      const exclusions = mutualExclusions[fact]
      if (exclusions) {
        exclusions.forEach(ex => next.delete(ex))
      }
      next.add(fact)
    }
    setSelected(next)
  }

  const next = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1)
    } else {
      analyze()
    }
  }

  const prev = () => step > 0 && setStep(step - 1)

  const analyze = async () => {
    setAnalyzing(true)
    await new Promise(r => setTimeout(r, 2500))
    
    try {
      const res = await fetch(`${API_URL}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          facts: Array.from(selected),
          method: selectedMethod
        })
      })
      const data = await res.json()
      setResults(data)
    } catch {
      setResults(null)
    }
    setAnalyzing(false)
  }

  const reset = () => {
    setStep(0)
    setSelected(new Set())
    setResults(null)
  }

  if (analyzing) return <AnalyzingScreen />
  if (results) return <ResultsScreen results={results} onReset={reset} />

  return (
    <div className="h-screen flex flex-col px-6 bg-zinc-900 relative overflow-hidden">
      {/* Grid background */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(63, 63, 70, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(63, 63, 70, 0.4) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/50 via-transparent to-zinc-900 pointer-events-none" />
      
      <div className="max-w-3xl w-full mx-auto relative z-10 flex flex-col h-full pt-24 pb-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <Link to="/" className="text-zinc-500 text-sm hover:text-zinc-300 transition-colors inline-block mb-2">
                ← Retour
              </Link>
              <h1 className="text-2xl font-semibold text-white">
                {isMethodStep ? 'Méthode d\'inférence' : currentCategory?.label}
              </h1>
            </div>
            <div className="text-right">
              <div className="text-zinc-500 text-sm mb-1">Étape {step + 1}/{totalSteps}</div>
              <div className="w-32 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Options - Scrollable area if needed */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1 overflow-y-auto"
          >
            {isMethodStep ? (
              // Method selection step
              <div className="space-y-4">
                <p className="text-zinc-400 mb-6">Choisissez la méthode de chaînage pour l'analyse:</p>
                {chainingMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`w-full p-5 rounded-xl border text-left transition-all duration-200 ${
                      selectedMethod === method.id
                        ? 'bg-blue-500/10 border-blue-500/50'
                        : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className={`font-semibold mb-1 ${selectedMethod === method.id ? 'text-white' : 'text-zinc-300'}`}>
                          {method.label}
                        </div>
                        <div className="text-sm text-zinc-500">{method.description}</div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedMethod === method.id 
                          ? 'bg-blue-500 border-blue-500' 
                          : 'border-zinc-600'
                      }`}>
                        {selectedMethod === method.id && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              // Category options
              <div className="grid grid-cols-2 gap-3">
                {options.map((opt) => {
                  const disabled = isDisabled(opt.fact)
                  return (
                    <button
                      key={opt.fact}
                      onClick={() => toggle(opt.fact)}
                      disabled={disabled}
                      className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                        disabled
                          ? 'bg-zinc-900/30 border-zinc-800/50 text-zinc-600 cursor-not-allowed opacity-50'
                          : selected.has(opt.fact)
                            ? 'bg-blue-500/10 border-blue-500/50 text-white'
                            : 'bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800/50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-medium text-sm">{opt.label}</span>
                        <div className={`w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center transition-all ${
                          disabled
                            ? 'border-zinc-700 bg-zinc-800'
                            : selected.has(opt.fact) 
                              ? 'bg-blue-500 border-blue-500' 
                              : 'border-zinc-600'
                        }`}>
                          {selected.has(opt.fact) && !disabled && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                          {disabled && (
                            <svg className="w-3 h-3 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation - Fixed at bottom */}
        <div className="flex justify-between items-center pt-6 mt-auto border-t border-zinc-800">
          <Button variant="ghost" onClick={prev} disabled={step === 0}>
            Précédent
          </Button>
          <div className="text-zinc-500 text-sm">
            {!isMethodStep && selected.size > 0 && `${selected.size} sélectionné${selected.size > 1 ? 's' : ''}`}
            {isMethodStep && chainingMethods.find(m => m.id === selectedMethod)?.label}
          </div>
          <Button onClick={next}>
            {isMethodStep ? 'Analyser' : 'Suivant'}
          </Button>
        </div>
      </div>
    </div>
  )
}

function AnalyzingScreen() {
  return (
    <div className="h-screen flex items-center justify-center bg-zinc-900 relative">
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(63, 63, 70, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(63, 63, 70, 0.4) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center relative z-10">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 mx-auto mb-8 rounded-full border-2 border-zinc-800 border-t-blue-500"
        />
        <h2 className="text-2xl font-medium text-white mb-3">Analyse en cours</h2>
        <p className="text-zinc-500">Exécution du chaînage avant...</p>
      </motion.div>
    </div>
  )
}

function ResultsScreen({ results, onReset }: { results: AnalysisResult; onReset: () => void }) {
  const statusConfig: Record<string, { color: string; label: string }> = {
    CRITICAL: { color: 'text-red-500', label: 'Critique' },
    DANGEROUS: { color: 'text-orange-500', label: 'Dangereux' },
    WARNING: { color: 'text-yellow-500', label: 'Attention' },
    ACCEPTABLE: { color: 'text-green-500', label: 'Acceptable' },
  }

  const status = statusConfig[results.overall_status]
  const allVulns = [
    ...results.vulnerabilities.critical,
    ...results.vulnerabilities.dangerous,
    ...results.vulnerabilities.warning,
  ]

  return (
    <div className="min-h-screen pt-28 pb-16 px-6 bg-zinc-900 relative">
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(63, 63, 70, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(63, 63, 70, 0.4) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/50 via-transparent to-zinc-900 pointer-events-none" />
      <div className="max-w-3xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Status */}
          <div className="text-center mb-16">
            <div className="text-zinc-500 text-sm mb-4 uppercase tracking-wider">
              {results.method_name || 'Chaînage Avant'}
            </div>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className={`text-7xl font-bold mb-4 ${status.color}`}
            >
              {status.label}
            </motion.div>
            <p className="text-zinc-400 text-lg">{results.total_rules_fired} règles déclenchées</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-16">
            {[
              { count: results.vulnerabilities.critical.length, label: 'Critiques', color: 'text-red-500' },
              { count: results.vulnerabilities.dangerous.length, label: 'Dangereux', color: 'text-orange-500' },
              { count: results.vulnerabilities.warning.length, label: 'Avertissements', color: 'text-yellow-500' },
              { count: results.vulnerabilities.info.length, label: 'Info', color: 'text-blue-500' },
            ].map((s) => (
              <div key={s.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center">
                <div className={`text-3xl font-bold ${s.color}`}>{s.count}</div>
                <div className="text-zinc-500 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Vulnerabilities */}
          {allVulns.length > 0 && (
            <div className="mb-16">
              <h3 className="text-xl font-medium text-white mb-6">Vulnérabilités détectées</h3>
              <div className="space-y-3">
                {allVulns.map((v, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl p-5"
                  >
                    <span className="text-zinc-500 text-sm font-mono">{v.rule_id}</span>
                    <p className="text-white mt-2">{v.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {results.patches.length > 0 && (
            <div className="mb-16">
              <h3 className="text-xl font-medium text-white mb-6">Recommandations</h3>
              <div className="space-y-3">
                {results.patches.slice(0, 5).map((p, i) => (
                  <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                    <p className="text-zinc-400 text-sm mb-3">{p.vulnerability}</p>
                    <code className="text-blue-400 text-sm bg-zinc-800 px-3 py-2 rounded-lg block">{p.recommendation}</code>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-center gap-4">
            <Button variant="secondary" onClick={onReset}>Nouvelle analyse</Button>
            <Link to="/"><Button variant="ghost">Retour à l'accueil</Button></Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
