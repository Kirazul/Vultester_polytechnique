export interface Rule {
  id: string
  conditions: string[]
  consequence: string
  severity: 'critical' | 'dangerous' | 'warning' | 'info'
  description: string
}

export interface Vulnerability {
  rule_id: string
  description: string
  consequence: string
}

export interface Patch {
  rule_id: string
  vulnerability: string
  recommendation: string
}

export interface InferenceStep {
  step: number
  action: string
  message: string
  rule_id?: string
  conditions?: string[]
  consequence?: string
  severity?: string
}

export interface AnalysisResult {
  method: 'forward' | 'backward' | 'mixed'
  method_name: string
  overall_status: 'CRITICAL' | 'DANGEROUS' | 'WARNING' | 'ACCEPTABLE'
  status_message: string
  vulnerabilities: {
    critical: Vulnerability[]
    dangerous: Vulnerability[]
    warning: Vulnerability[]
    info: Vulnerability[]
  }
  total_rules_fired: number
  fired_rules: string[]
  patches: Patch[]
  inference_trace: InferenceStep[]
  final_facts: string[]
}

export interface ConfigOption {
  fact: string
  label: string
  category: string
}
