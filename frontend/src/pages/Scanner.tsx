import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { categories, configOptions, mutualExclusions } from '@/data/config'
import { AnalysisResult } from '@/types'
import { API_URL } from '@/config/api'
import jsPDF from 'jspdf'

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
    <div className="min-h-screen flex flex-col px-4 md:px-6 bg-zinc-900 relative overflow-hidden">
      {/* Grid background */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(63, 63, 70, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(63, 63, 70, 0.4) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/50 via-transparent to-zinc-900 pointer-events-none" />
      
      <div className="max-w-3xl w-full mx-auto relative z-10 flex flex-col flex-1 pt-20 md:pt-24 pb-6 md:pb-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-4 md:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <Link to="/" className="text-zinc-500 text-sm hover:text-zinc-300 transition-colors inline-block mb-2">
                ← Retour
              </Link>
              <h1 className="text-xl md:text-2xl font-semibold text-white">
                {isMethodStep ? 'Méthode d\'inférence' : currentCategory?.label}
              </h1>
            </div>
            <div className="sm:text-right">
              <div className="text-zinc-500 text-sm mb-1">Étape {step + 1}/{totalSteps}</div>
              <div className="w-full sm:w-32 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {options.map((opt) => {
                  const disabled = isDisabled(opt.fact)
                  return (
                    <button
                      key={opt.fact}
                      onClick={() => toggle(opt.fact)}
                      disabled={disabled}
                      className={`p-3 md:p-4 rounded-xl border text-left transition-all duration-200 ${
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
  const [showTrace, setShowTrace] = useState(false)
  
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

  const generatePDF = () => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    let y = 20
    const lineHeight = 7
    const margin = 20

    // Helper function to add text with word wrap
    const addWrappedText = (text: string, x: number, maxWidth: number, fontSize: number = 10) => {
      doc.setFontSize(fontSize)
      const lines = doc.splitTextToSize(text, maxWidth)
      lines.forEach((line: string) => {
        if (y > 270) {
          doc.addPage()
          y = 20
        }
        doc.text(line, x, y)
        y += lineHeight
      })
    }

    // Title
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.text('RAPPORT DE SECURITE', pageWidth / 2, y, { align: 'center' })
    y += 10
    doc.setFontSize(14)
    doc.setFont('helvetica', 'normal')
    doc.text('Systeme Expert Vultester', pageWidth / 2, y, { align: 'center' })
    y += 15

    // Date and Method
    doc.setFontSize(10)
    doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')} - ${new Date().toLocaleTimeString('fr-FR')}`, margin, y)
    y += lineHeight
    doc.text(`Methode d'inference: ${results.method_name}`, margin, y)
    y += 15

    // Status
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text(`STATUT: ${status.label.toUpperCase()}`, margin, y)
    y += lineHeight
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(results.status_message, margin, y)
    y += 15

    // Statistics
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('STATISTIQUES', margin, y)
    y += lineHeight
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`- Regles declenchees: ${results.total_rules_fired}`, margin, y)
    y += lineHeight
    doc.text(`- Vulnerabilites critiques: ${results.vulnerabilities.critical.length}`, margin, y)
    y += lineHeight
    doc.text(`- Vulnerabilites dangereuses: ${results.vulnerabilities.dangerous.length}`, margin, y)
    y += lineHeight
    doc.text(`- Avertissements: ${results.vulnerabilities.warning.length}`, margin, y)
    y += lineHeight
    doc.text(`- Informations: ${results.vulnerabilities.info.length}`, margin, y)
    y += 15

    // Vulnerabilities
    if (allVulns.length > 0) {
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('VULNERABILITES DETECTEES', margin, y)
      y += lineHeight + 3

      allVulns.forEach((v, i) => {
        doc.setFontSize(10)
        doc.setFont('helvetica', 'bold')
        doc.text(`${i + 1}. [${v.rule_id}]`, margin, y)
        y += lineHeight
        doc.setFont('helvetica', 'normal')
        addWrappedText(v.description, margin + 5, pageWidth - margin * 2 - 5)
        y += 3
      })
      y += 10
    }

    // Recommendations
    if (results.patches.length > 0) {
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('RECOMMANDATIONS', margin, y)
      y += lineHeight + 3

      results.patches.forEach((p, i) => {
        doc.setFontSize(10)
        doc.setFont('helvetica', 'bold')
        doc.text(`${i + 1}. ${p.rule_id}`, margin, y)
        y += lineHeight
        doc.setFont('helvetica', 'normal')
        addWrappedText(`Probleme: ${p.vulnerability}`, margin + 5, pageWidth - margin * 2 - 5)
        addWrappedText(`Solution: ${p.recommendation}`, margin + 5, pageWidth - margin * 2 - 5)
        y += 5
      })
      y += 10
    }

    // Inference Trace
    doc.addPage()
    y = 20
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('TRACE DU CHAINAGE', margin, y)
    y += lineHeight + 3

    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    results.inference_trace.forEach((step) => {
      if (y > 270) {
        doc.addPage()
        y = 20
      }
      const stepText = `[Etape ${step.step}] ${step.message}`
      addWrappedText(stepText, margin, pageWidth - margin * 2, 9)
      if (step.rule_id) {
        doc.setFont('helvetica', 'italic')
        addWrappedText(`   -> Regle: ${step.rule_id} | Severite: ${step.severity || 'N/A'}`, margin, pageWidth - margin * 2, 8)
        doc.setFont('helvetica', 'normal')
      }
      y += 2
    })

    // Final Facts
    y += 10
    if (y > 250) {
      doc.addPage()
      y = 20
    }
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('FAITS FINAUX', margin, y)
    y += lineHeight + 3
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    const factsText = results.final_facts.join(', ')
    addWrappedText(factsText, margin, pageWidth - margin * 2, 9)

    // Footer
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.text(`Vultester - Systeme Expert de Detection de Vulnerabilites | Page ${i}/${pageCount}`, pageWidth / 2, 290, { align: 'center' })
    }

    // Save
    doc.save(`rapport-securite-${new Date().toISOString().split('T')[0]}.pdf`)
  }

  return (
    <div className="min-h-screen pt-24 md:pt-28 pb-16 px-4 md:px-6 bg-zinc-900 relative">
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
          <div className="text-center mb-10 md:mb-16">
            {/* Download PDF Button */}
            <div className="flex justify-end mb-6">
              <button
                onClick={generatePDF}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Télécharger PDF
              </button>
            </div>
            
            <div className="text-zinc-500 text-sm mb-4 uppercase tracking-wider">
              {results.method_name || 'Chaînage Avant'}
            </div>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className={`text-4xl sm:text-5xl md:text-7xl font-bold mb-4 ${status.color}`}
            >
              {status.label}
            </motion.div>
            <p className="text-zinc-400 text-base md:text-lg">{results.total_rules_fired} règles déclenchées</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-12 md:mb-16">
            {[
              { count: results.vulnerabilities.critical.length, label: 'Critiques', color: 'text-red-500' },
              { count: results.vulnerabilities.dangerous.length, label: 'Dangereux', color: 'text-orange-500' },
              { count: results.vulnerabilities.warning.length, label: 'Avertissements', color: 'text-yellow-500' },
              { count: results.vulnerabilities.info.length, label: 'Info', color: 'text-blue-500' },
            ].map((s) => (
              <div key={s.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 md:p-6 text-center">
                <div className={`text-2xl md:text-3xl font-bold ${s.color}`}>{s.count}</div>
                <div className="text-zinc-500 text-xs md:text-sm mt-1">{s.label}</div>
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

          {/* Inference Trace Section */}
          <div className="mb-16">
            <button
              onClick={() => setShowTrace(!showTrace)}
              className="w-full flex items-center justify-between p-5 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-medium text-white">Trace du Chaînage</h3>
                  <p className="text-zinc-500 text-sm">Voir le détail de l'exécution du {results.method_name}</p>
                </div>
              </div>
              <motion.svg
                animate={{ rotate: showTrace ? 180 : 0 }}
                className="w-5 h-5 text-zinc-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </motion.svg>
            </button>

            <AnimatePresence>
              {showTrace && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 bg-zinc-900 border border-zinc-800 rounded-xl p-5 max-h-96 overflow-y-auto">
                    <div className="space-y-3">
                      {results.inference_trace.map((step, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.03 }}
                          className={`p-4 rounded-lg border ${
                            step.action === 'rule_fired' 
                              ? 'bg-blue-500/5 border-blue-500/20' 
                              : step.action === 'phase_start'
                                ? 'bg-purple-500/5 border-purple-500/20'
                                : 'bg-zinc-800/50 border-zinc-700/50'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-mono text-zinc-400">
                              {step.step}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-sm">{step.message}</p>
                              {step.rule_id && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                  <span className="px-2 py-1 bg-zinc-800 rounded text-xs font-mono text-blue-400">
                                    {step.rule_id}
                                  </span>
                                  {step.severity && (
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                      step.severity === 'critical' ? 'bg-red-500/10 text-red-400' :
                                      step.severity === 'dangerous' ? 'bg-orange-500/10 text-orange-400' :
                                      step.severity === 'warning' ? 'bg-yellow-500/10 text-yellow-400' :
                                      'bg-blue-500/10 text-blue-400'
                                    }`}>
                                      {step.severity}
                                    </span>
                                  )}
                                </div>
                              )}
                              {step.conditions && (
                                <div className="mt-2 text-xs font-mono text-zinc-500">
                                  <span className="text-zinc-600">SI </span>
                                  {step.conditions.join(' ET ')}
                                  <span className="text-zinc-600"> ALORS </span>
                                  <span className="text-blue-400">{step.consequence}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Final Facts */}
                    <div className="mt-6 pt-6 border-t border-zinc-800">
                      <h4 className="text-sm font-medium text-zinc-400 mb-3">Faits finaux ({results.final_facts.length})</h4>
                      <div className="flex flex-wrap gap-2">
                        {results.final_facts.map((fact, i) => (
                          <span key={i} className="px-2 py-1 bg-zinc-800 rounded text-xs font-mono text-zinc-300">
                            {fact}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

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
