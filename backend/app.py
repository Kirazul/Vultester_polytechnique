"""
Server Vulnerability Detection Expert System
A world-class expert system for detecting server security vulnerabilities
Implements 3 Inference Methods: Forward, Backward, and Mixed Chaining
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import copy

app = Flask(__name__)
CORS(app)

# ============================================================================
# KNOWLEDGE BASE - 50 Expert Security Rules
# Categories: PORT, SSL, SSH, PERM, SOFT, DB, NET
# ============================================================================

rules = [
    # === PORT - Vulnérabilités des Ports (10 règles) =
    {"id": "PORT-01", "conditions": ["port_22_open", "password_auth_enabled"], 
     "consequence": "ssh_brute_force_risk", "severity": "dangerous",
     "description": "SSH avec authentification par mot de passe est vulnérable aux attaques brute force"},
    
    {"id": "PORT-02", "conditions": ["port_23_open"], 
     "consequence": "telnet_vulnerability", "severity": "critical",
     "description": "Telnet transmet les données en clair - extrêmement dangereux"},
    
    {"id": "PORT-03", "conditions": ["port_21_open", "ftp_anonymous_enabled"], 
     "consequence": "anonymous_ftp_risk", "severity": "critical",
     "description": "FTP anonyme permet un accès non autorisé aux fichiers"},
    
    {"id": "PORT-04", "conditions": ["port_3306_open", "mysql_remote_root"], 
     "consequence": "mysql_root_exposure", "severity": "critical",
     "description": "MySQL root accessible à distance - risque de compromission"},
    
    {"id": "PORT-05", "conditions": ["port_6379_open", "redis_no_auth"], 
     "consequence": "redis_unauthorized_access", "severity": "critical",
     "description": "Redis sans authentification permet le vol de données"},
    
    {"id": "PORT-06", "conditions": ["port_27017_open", "mongodb_no_auth"], 
     "consequence": "mongodb_exposure", "severity": "critical",
     "description": "MongoDB sans auth - accès complet à la base possible"},
    
    {"id": "PORT-07", "conditions": ["port_445_open", "smb_v1_enabled"], 
     "consequence": "smb_vulnerability", "severity": "critical",
     "description": "SMBv1 est vulnérable aux exploits WannaCry et EternalBlue"},
    
    {"id": "PORT-08", "conditions": ["port_1433_open", "mssql_sa_weak_password"], 
     "consequence": "mssql_compromise_risk", "severity": "critical",
     "description": "MSSQL avec mot de passe SA faible - compromission totale possible"},
    
    {"id": "PORT-09", "conditions": ["port_5432_open", "postgres_trust_auth"], 
     "consequence": "postgres_trust_vulnerability", "severity": "critical",
     "description": "PostgreSQL trust authentication contourne la sécurité"},
    
    {"id": "PORT-10", "conditions": ["port_11211_open", "memcached_exposed"], 
     "consequence": "memcached_ddos_amplification", "severity": "critical",
     "description": "Memcached exposé peut être utilisé pour amplification DDoS"},

    # === SSL - Vulnérabilités SSL/TLS (8 règles) ===
    {"id": "SSL-01", "conditions": ["no_ssl_enabled", "port_80_open"], 
     "consequence": "unencrypted_traffic", "severity": "dangerous",
     "description": "HTTP sans HTTPS expose les données en transit"},
    
    {"id": "SSL-02", "conditions": ["ssl_certificate_expired"], 
     "consequence": "expired_cert_risk", "severity": "dangerous",
     "description": "Certificat SSL expiré - les utilisateurs ignorent les avertissements"},
    
    {"id": "SSL-03", "conditions": ["ssl_self_signed"], 
     "consequence": "self_signed_cert_risk", "severity": "warning",
     "description": "Certificat auto-signé - pas de vérification de chaîne de confiance"},
    
    {"id": "SSL-04", "conditions": ["ssl_weak_cipher"], 
     "consequence": "weak_encryption_risk", "severity": "dangerous",
     "description": "Chiffrements SSL faibles peuvent être cassés"},
    
    {"id": "SSL-05", "conditions": ["tls_1_0_enabled"], 
     "consequence": "legacy_tls_vulnerability", "severity": "dangerous",
     "description": "TLS 1.0 a des vulnérabilités connues (BEAST, POODLE)"},
    
    {"id": "SSL-06", "conditions": ["ssl_3_enabled"], 
     "consequence": "ssl3_poodle_vulnerability", "severity": "critical",
     "description": "SSL 3.0 est vulnérable à l'attaque POODLE"},
    
    {"id": "SSL-07", "conditions": ["no_hsts_header"], 
     "consequence": "hsts_missing", "severity": "warning",
     "description": "Header HSTS manquant permet les attaques SSL stripping"},
    
    {"id": "SSL-08", "conditions": ["certificate_key_weak"], 
     "consequence": "weak_key_vulnerability", "severity": "dangerous",
     "description": "Clé de certificat SSL inférieure à 2048 bits est faible"},

    # === SSH - Configuration SSH (8 règles) ===
    {"id": "SSH-01", "conditions": ["ssh_root_login_enabled"], 
     "consequence": "root_ssh_risk", "severity": "dangerous",
     "description": "Login root SSH devrait être désactivé"},
    
    {"id": "SSH-02", "conditions": ["ssh_protocol_1"], 
     "consequence": "ssh_v1_vulnerability", "severity": "critical",
     "description": "SSH Protocol 1 a des faiblesses cryptographiques"},
    
    {"id": "SSH-03", "conditions": ["ssh_empty_passwords"], 
     "consequence": "empty_password_risk", "severity": "critical",
     "description": "SSH autorise les mots de passe vides - pas d'authentification"},
    
    {"id": "SSH-04", "conditions": ["ssh_x11_forwarding"], 
     "consequence": "x11_forwarding_risk", "severity": "warning",
     "description": "X11 forwarding peut fuiter des informations d'affichage"},
    
    {"id": "SSH-05", "conditions": ["ssh_agent_forwarding"], 
     "consequence": "agent_forwarding_risk", "severity": "warning",
     "description": "SSH agent forwarding peut être exploité par des hôtes compromis"},
    
    {"id": "SSH-06", "conditions": ["ssh_default_port"], 
     "consequence": "default_port_exposure", "severity": "info",
     "description": "SSH sur le port par défaut 22 est facilement découvert"},
    
    {"id": "SSH-07", "conditions": ["ssh_no_fail2ban"], 
     "consequence": "no_brute_force_protection", "severity": "warning",
     "description": "Pas de protection brute force configurée"},
    
    {"id": "SSH-08", "conditions": ["ssh_weak_mac"], 
     "consequence": "weak_mac_algorithm", "severity": "dangerous",
     "description": "Algorithmes MAC faibles dans la configuration SSH"},

    # === PERM - Permissions Fichiers (8 règles) ===
    {"id": "PERM-01", "conditions": ["permission_777_found"], 
     "consequence": "world_writable_files", "severity": "critical",
     "description": "Permissions 777 permettent à tous de modifier les fichiers"},
    
    {"id": "PERM-02", "conditions": ["private_key_readable"], 
     "consequence": "exposed_private_keys", "severity": "critical",
     "description": "Clés privées accessibles aux autres utilisateurs"},
    
    {"id": "PERM-03", "conditions": ["passwd_file_writable"], 
     "consequence": "passwd_vulnerability", "severity": "critical",
     "description": "/etc/passwd modifiable permet l'escalade de privilèges"},
    
    {"id": "PERM-04", "conditions": ["shadow_file_readable"], 
     "consequence": "shadow_exposure", "severity": "critical",
     "description": "/etc/shadow lisible expose les hash de mots de passe"},
    
    {"id": "PERM-05", "conditions": ["suid_misconfigured"], 
     "consequence": "suid_privilege_escalation", "severity": "critical",
     "description": "Binaires SUID mal configurés permettent l'escalade de privilèges"},
    
    {"id": "PERM-06", "conditions": ["log_files_public"], 
     "consequence": "log_information_leak", "severity": "dangerous",
     "description": "Fichiers logs publics peuvent contenir des informations sensibles"},
    
    {"id": "PERM-07", "conditions": ["config_files_exposed"], 
     "consequence": "config_exposure", "severity": "dangerous",
     "description": "Fichiers de configuration avec credentials exposés"},
    
    {"id": "PERM-08", "conditions": ["tmp_not_secured"], 
     "consequence": "tmp_race_condition", "severity": "warning",
     "description": "/tmp non sécurisé - attaques race condition possibles"},

    # === SOFT - Versions Logiciels (8 règles) ===
    {"id": "SOFT-01", "conditions": ["apache_outdated"], 
     "consequence": "apache_vulnerability", "severity": "critical",
     "description": "Apache obsolète a des vulnérabilités CVE connues"},
    
    {"id": "SOFT-02", "conditions": ["nginx_outdated"], 
     "consequence": "nginx_vulnerability", "severity": "critical",
     "description": "Nginx obsolète a des vulnérabilités de sécurité"},
    
    {"id": "SOFT-03", "conditions": ["php_outdated"], 
     "consequence": "php_vulnerability", "severity": "critical",
     "description": "Version PHP obsolète avec exploits connus"},
    
    {"id": "SOFT-04", "conditions": ["mysql_outdated"], 
     "consequence": "mysql_vulnerability", "severity": "critical",
     "description": "MySQL obsolète manque de correctifs de sécurité"},
    
    {"id": "SOFT-05", "conditions": ["openssh_outdated"], 
     "consequence": "openssh_vulnerability", "severity": "critical",
     "description": "OpenSSH obsolète a des contournements d'authentification"},
    
    {"id": "SOFT-06", "conditions": ["kernel_outdated"], 
     "consequence": "kernel_vulnerability", "severity": "critical",
     "description": "Kernel obsolète vulnérable à l'escalade de privilèges"},
    
    {"id": "SOFT-07", "conditions": ["openssl_outdated"], 
     "consequence": "openssl_vulnerability", "severity": "critical",
     "description": "OpenSSL obsolète vulnérable à Heartbleed et autres"},
    
    {"id": "SOFT-08", "conditions": ["wordpress_outdated"], 
     "consequence": "wordpress_vulnerability", "severity": "critical",
     "description": "WordPress obsolète avec exploits connus"},

    # === NET - Réseau et Pare-feu (8 règles) ===
    {"id": "NET-01", "conditions": ["no_firewall_enabled"], 
     "consequence": "no_firewall_protection", "severity": "critical",
     "description": "Pas de pare-feu - tous les ports potentiellement exposés"},
    
    {"id": "NET-02", "conditions": ["icmp_enabled", "no_rate_limiting"], 
     "consequence": "ping_flood_risk", "severity": "warning",
     "description": "ICMP sans rate limiting permet les ping floods"},
    
    {"id": "NET-03", "conditions": ["ip_forwarding_enabled"], 
     "consequence": "routing_misconfiguration", "severity": "dangerous",
     "description": "IP forwarding activé - attaques de routage potentielles"},
    
    {"id": "NET-04", "conditions": ["syn_cookies_disabled"], 
     "consequence": "syn_flood_vulnerability", "severity": "dangerous",
     "description": "SYN cookies désactivés - vulnérable aux SYN floods"},
    
    {"id": "NET-05", "conditions": ["source_routing_enabled"], 
     "consequence": "source_routing_attack", "severity": "dangerous",
     "description": "Source routing permet la manipulation du chemin des paquets"},
    
    {"id": "NET-06", "conditions": ["rp_filter_disabled"], 
     "consequence": "ip_spoofing_risk", "severity": "dangerous",
     "description": "Reverse path filtering désactivé - IP spoofing possible"},
    
    {"id": "NET-07", "conditions": ["dns_recursion_enabled", "dns_public"], 
     "consequence": "dns_amplification_risk", "severity": "critical",
     "description": "Résolveur DNS ouvert - vecteur d'amplification DDoS"},
    
    {"id": "NET-08", "conditions": ["snmp_public_community"], 
     "consequence": "snmp_information_leak", "severity": "dangerous",
     "description": "SNMP avec community string par défaut expose les infos système"},
]

# Recommendations for each vulnerability
recommendations = {
    "ssh_brute_force_risk": "Désactiver l'authentification par mot de passe. Ajouter: PasswordAuthentication no",
    "telnet_vulnerability": "Désactiver Telnet immédiatement. Exécuter: systemctl disable telnet",
    "anonymous_ftp_risk": "Désactiver l'accès FTP anonyme ou fermer le port 21",
    "mysql_root_exposure": "Restreindre MySQL root à localhost. Exécuter: mysql_secure_installation",
    "redis_unauthorized_access": "Activer l'authentification Redis avec requirepass",
    "mongodb_exposure": "Activer l'authentification MongoDB et bind à localhost",
    "smb_vulnerability": "Désactiver SMBv1: Set-SmbServerConfiguration -EnableSMB1Protocol $false",
    "mssql_compromise_risk": "Changer le mot de passe SA et restreindre l'accès distant",
    "postgres_trust_vulnerability": "Modifier pg_hba.conf pour utiliser md5 ou scram-sha-256",
    "memcached_ddos_amplification": "Bind Memcached à localhost: -l 127.0.0.1",
    "unencrypted_traffic": "Activer HTTPS avec un certificat SSL valide. Utiliser Let's Encrypt",
    "expired_cert_risk": "Renouveler le certificat SSL. Considérer auto-renewal avec certbot",
    "self_signed_cert_risk": "Remplacer par un certificat d'une CA de confiance",
    "weak_encryption_risk": "Mettre à jour la config SSL pour utiliser des chiffrements forts (TLS 1.2+)",
    "legacy_tls_vulnerability": "Désactiver TLS 1.0 et 1.1. Activer uniquement TLS 1.2 et 1.3",
    "ssl3_poodle_vulnerability": "Désactiver SSL 3.0 immédiatement",
    "hsts_missing": "Ajouter header HSTS: Strict-Transport-Security: max-age=31536000",
    "weak_key_vulnerability": "Générer un nouveau certificat avec clé 2048 bits ou plus",
    "root_ssh_risk": "Définir PermitRootLogin no dans /etc/ssh/sshd_config",
    "ssh_v1_vulnerability": "Définir Protocol 2 dans la configuration SSH",
    "empty_password_risk": "Définir PermitEmptyPasswords no dans sshd_config",
    "x11_forwarding_risk": "Définir X11Forwarding no sauf si nécessaire",
    "agent_forwarding_risk": "Définir AllowAgentForwarding no dans sshd_config",
    "default_port_exposure": "Considérer changer le port SSH vers un port non standard",
    "no_brute_force_protection": "Installer et configurer fail2ban",
    "weak_mac_algorithm": "Mettre à jour MACs pour utiliser hmac-sha2-256, hmac-sha2-512",
    "world_writable_files": "Corriger: find / -perm -777 -exec chmod 755 {} \\;",
    "exposed_private_keys": "Définir permissions clé privée à 600: chmod 600 ~/.ssh/id_*",
    "passwd_vulnerability": "Corriger permissions: chmod 644 /etc/passwd",
    "shadow_exposure": "Corriger permissions: chmod 000 /etc/shadow",
    "suid_privilege_escalation": "Auditer binaires SUID: find / -perm -4000 -type f",
    "log_information_leak": "Restreindre permissions logs à root uniquement",
    "config_exposure": "Déplacer configs sensibles hors web root",
    "tmp_race_condition": "Monter /tmp avec options noexec,nosuid",
    "apache_vulnerability": "Mettre à jour Apache: apt update && apt upgrade apache2",
    "nginx_vulnerability": "Mettre à jour Nginx: apt update && apt upgrade nginx",
    "php_vulnerability": "Mettre à jour PHP vers la dernière version supportée",
    "mysql_vulnerability": "Mettre à jour MySQL/MariaDB",
    "openssh_vulnerability": "Mettre à jour OpenSSH: apt upgrade openssh-server",
    "kernel_vulnerability": "Mettre à jour kernel et redémarrer",
    "openssl_vulnerability": "Mettre à jour OpenSSL: apt upgrade openssl",
    "wordpress_vulnerability": "Mettre à jour WordPress core, thèmes et plugins",
    "no_firewall_protection": "Activer pare-feu: ufw enable",
    "ping_flood_risk": "Activer rate limiting ICMP dans iptables",
    "routing_misconfiguration": "Désactiver IP forwarding: sysctl -w net.ipv4.ip_forward=0",
    "syn_flood_vulnerability": "Activer SYN cookies: sysctl -w net.ipv4.tcp_syncookies=1",
    "source_routing_attack": "Désactiver source routing dans sysctl.conf",
    "ip_spoofing_risk": "Activer rp_filter: sysctl -w net.ipv4.conf.all.rp_filter=1",
    "dns_amplification_risk": "Désactiver récursion DNS pour requêtes externes",
    "snmp_information_leak": "Changer community string SNMP ou désactiver SNMP",
}


# ============================================================================
# INFERENCE ENGINE - 3 Chaining Methods
# ============================================================================

class ExpertSystem:
    def __init__(self):
        self.facts = []
        self.fired_rules = []
        self.inference_trace = []
        
    def reset(self):
        self.facts = []
        self.fired_rules = []
        self.inference_trace = []
    
    def add_fact(self, fact):
        if fact not in self.facts:
            self.facts.append(fact)
            return True
        return False
            
    def conditions_satisfied(self, rule):
        """Check if all conditions of a rule are satisfied by current facts"""
        return all(cond in self.facts for cond in rule["conditions"])
    
    def satisfies_one_condition(self, rule, fact):
        """Check if a fact satisfies at least one condition of a rule"""
        return fact in rule["conditions"]

    # =========================================================================
    # CHAÎNAGE AVANT (Forward Chaining)
    # =========================================================================
    def forward_chaining(self, initial_facts):
        self.reset()
        queue = copy.deepcopy(initial_facts)
        
        self.inference_trace.append({
            "step": 0,
            "action": "initialization",
            "method": "forward",
            "message": f"Chaînage avant: Démarrage avec {len(initial_facts)} faits initiaux",
            "facts": initial_facts.copy()
        })
        
        step = 1
        while queue:
            current_fact = queue.pop(0)
            
            if self.add_fact(current_fact):
                self.inference_trace.append({
                    "step": step,
                    "action": "fact_added",
                    "method": "forward",
                    "message": f"Fait ajouté: {current_fact}",
                    "current_facts": self.facts.copy()
                })
            
            for rule in rules:
                if rule["id"] not in self.fired_rules:
                    if self.satisfies_one_condition(rule, current_fact) and self.conditions_satisfied(rule):
                        consequence = rule["consequence"]
                        if consequence not in self.facts:
                            queue.append(consequence)
                            self.fired_rules.append(rule["id"])
                            self.inference_trace.append({
                                "step": step,
                                "action": "rule_fired",
                                "method": "forward",
                                "rule_id": rule["id"],
                                "message": f"Règle {rule['id']} déclenchée: {rule['description']}",
                                "conditions": rule["conditions"],
                                "consequence": consequence,
                                "severity": rule["severity"]
                            })
            step += 1
        
        return self.analyze_results("forward")

    # =========================================================================
    # CHAÎNAGE ARRIÈRE (Backward Chaining)
    # =========================================================================
    def backward_chaining(self, initial_facts, goals=None):
        self.reset()
        self.facts = copy.deepcopy(initial_facts)
        
        if goals is None:
            goals = [rule["consequence"] for rule in rules]
        
        self.inference_trace.append({
            "step": 0,
            "action": "initialization",
            "method": "backward",
            "message": f"Chaînage arrière: Vérification de {len(goals)} buts potentiels",
            "facts": initial_facts.copy(),
            "goals": goals[:10]
        })
        
        step = 1
        for goal in goals:
            result = self._prove_goal(goal, step, set())
            if result:
                step += 1
        
        return self.analyze_results("backward")
    
    def _prove_goal(self, goal, step, visited):
        if goal in visited:
            return False
        visited.add(goal)
        
        if goal in self.facts:
            return True
        
        for rule in rules:
            if rule["consequence"] == goal:
                all_conditions_met = True
                for condition in rule["conditions"]:
                    if condition not in self.facts:
                        if not self._prove_goal(condition, step, visited):
                            all_conditions_met = False
                            break
                
                if all_conditions_met:
                    if goal not in self.facts:
                        self.facts.append(goal)
                    if rule["id"] not in self.fired_rules:
                        self.fired_rules.append(rule["id"])
                        self.inference_trace.append({
                            "step": step,
                            "action": "rule_fired",
                            "method": "backward",
                            "rule_id": rule["id"],
                            "message": f"Règle {rule['id']} validée: {rule['description']}",
                            "conditions": rule["conditions"],
                            "consequence": goal,
                            "severity": rule["severity"]
                        })
                    return True
        
        return False


    # =========================================================================
    # CHAÎNAGE MIXTE (Mixed Chaining)
    # =========================================================================
    def mixed_chaining(self, initial_facts):
        self.reset()
        
        self.inference_trace.append({
            "step": 0,
            "action": "initialization",
            "method": "mixed",
            "message": f"Chaînage mixte: Combinaison avant + arrière avec {len(initial_facts)} faits",
            "facts": initial_facts.copy()
        })
        
        # Phase 1: Chaînage avant
        self.inference_trace.append({
            "step": 1,
            "action": "phase_start",
            "method": "mixed",
            "message": "Phase 1: Chaînage avant - déduction des faits"
        })
        
        queue = copy.deepcopy(initial_facts)
        step = 2
        
        while queue:
            current_fact = queue.pop(0)
            
            if self.add_fact(current_fact):
                self.inference_trace.append({
                    "step": step,
                    "action": "fact_added",
                    "method": "mixed_forward",
                    "message": f"[Avant] Fait ajouté: {current_fact}"
                })
            
            for rule in rules:
                if rule["id"] not in self.fired_rules:
                    if self.satisfies_one_condition(rule, current_fact) and self.conditions_satisfied(rule):
                        consequence = rule["consequence"]
                        if consequence not in self.facts:
                            queue.append(consequence)
                            self.fired_rules.append(rule["id"])
                            self.inference_trace.append({
                                "step": step,
                                "action": "rule_fired",
                                "method": "mixed_forward",
                                "rule_id": rule["id"],
                                "message": f"[Avant] Règle {rule['id']}: {rule['description']}",
                                "conditions": rule["conditions"],
                                "consequence": consequence,
                                "severity": rule["severity"]
                            })
            step += 1
        
        # Phase 2: Chaînage arrière
        self.inference_trace.append({
            "step": step,
            "action": "phase_start",
            "method": "mixed",
            "message": "Phase 2: Chaînage arrière - vérification des vulnérabilités restantes"
        })
        step += 1
        
        for rule in rules:
            if rule["id"] not in self.fired_rules:
                goal = rule["consequence"]
                if self._can_prove_backward(rule, step):
                    self.fired_rules.append(rule["id"])
                    if goal not in self.facts:
                        self.facts.append(goal)
                    self.inference_trace.append({
                        "step": step,
                        "action": "rule_fired",
                        "method": "mixed_backward",
                        "rule_id": rule["id"],
                        "message": f"[Arrière] Règle {rule['id']} validée: {rule['description']}",
                        "conditions": rule["conditions"],
                        "consequence": goal,
                        "severity": rule["severity"]
                    })
                    step += 1
        
        return self.analyze_results("mixed")
    
    def _can_prove_backward(self, rule, step):
        for condition in rule["conditions"]:
            if condition not in self.facts:
                found = False
                for other_rule in rules:
                    if other_rule["consequence"] == condition and other_rule["id"] in self.fired_rules:
                        found = True
                        break
                if not found:
                    return False
        return True

    # =========================================================================
    # ANALYSE DES RÉSULTATS
    # =========================================================================
    def analyze_results(self, method):
        vulnerabilities = {
            "critical": [],
            "dangerous": [],
            "warning": [],
            "info": []
        }
        
        patches = []
        
        for rule in rules:
            if rule["id"] in self.fired_rules:
                severity = rule["severity"]
                vuln_info = {
                    "rule_id": rule["id"],
                    "description": rule["description"],
                    "consequence": rule["consequence"]
                }
                
                if severity in vulnerabilities:
                    vulnerabilities[severity].append(vuln_info)
                
                if rule["consequence"] in recommendations:
                    patches.append({
                        "rule_id": rule["id"],
                        "vulnerability": rule["description"],
                        "recommendation": recommendations[rule["consequence"]]
                    })
        
        if vulnerabilities["critical"]:
            overall_status = "CRITICAL"
            status_message = "Vulnérabilités critiques détectées! Action immédiate requise."
        elif vulnerabilities["dangerous"]:
            overall_status = "DANGEROUS"
            status_message = "Configuration dangereuse détectée. Action recommandée."
        elif vulnerabilities["warning"]:
            overall_status = "WARNING"
            status_message = "Avertissements de sécurité trouvés. Révision recommandée."
        else:
            overall_status = "ACCEPTABLE"
            status_message = "Configuration acceptable. Continuer la surveillance."
        
        method_names = {
            "forward": "Chaînage Avant",
            "backward": "Chaînage Arrière", 
            "mixed": "Chaînage Mixte"
        }
        
        return {
            "method": method,
            "method_name": method_names.get(method, method),
            "overall_status": overall_status,
            "status_message": status_message,
            "vulnerabilities": vulnerabilities,
            "total_rules_fired": len(self.fired_rules),
            "fired_rules": self.fired_rules,
            "patches": patches,
            "inference_trace": self.inference_trace,
            "final_facts": self.facts
        }

expert_system = ExpertSystem()


# ============================================================================
# API ENDPOINTS
# ============================================================================

@app.route('/api/analyze', methods=['POST'])
def analyze():
    """Main endpoint to analyze server configuration"""
    data = request.json
    facts = data.get('facts', [])
    method = data.get('method', 'forward')
    
    if not facts:
        return jsonify({"error": "No facts provided"}), 400
    
    if method == 'forward':
        result = expert_system.forward_chaining(facts)
    elif method == 'backward':
        result = expert_system.backward_chaining(facts)
    elif method == 'mixed':
        result = expert_system.mixed_chaining(facts)
    else:
        return jsonify({"error": "Invalid method. Use: forward, backward, or mixed"}), 400
    
    return jsonify(result)

@app.route('/api/rules', methods=['GET'])
def get_rules():
    """Get all rules in the knowledge base"""
    return jsonify({
        "total_rules": len(rules),
        "rules": rules
    })

@app.route('/api/rules/<rule_id>', methods=['GET'])
def get_rule(rule_id):
    """Get a specific rule by ID"""
    for rule in rules:
        if rule["id"] == rule_id:
            recommendation = recommendations.get(rule["consequence"], "No specific recommendation")
            return jsonify({
                "rule": rule,
                "recommendation": recommendation
            })
    return jsonify({"error": "Rule not found"}), 404

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "system": "Vultester - Server Vulnerability Expert System",
        "version": "2.0.0",
        "total_rules": len(rules),
        "categories": ["PORT", "SSL", "SSH", "PERM", "SOFT", "NET"],
        "inference_methods": ["forward", "backward", "mixed"]
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
