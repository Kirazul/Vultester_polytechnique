export const categories = [
  { id: 'ports', label: 'Ports Ouverts', description: 'Ports réseau exposés' },
  { id: 'ssl', label: 'SSL/TLS', description: 'Configuration du chiffrement' },
  { id: 'ssh', label: 'Configuration SSH', description: 'Accès distant sécurisé' },
  { id: 'permissions', label: 'Permissions', description: 'Droits sur les fichiers' },
  { id: 'software', label: 'Logiciels', description: 'Versions des services' },
  { id: 'database', label: 'Base de données', description: 'Configuration des BDD' },
  { id: 'network', label: 'Réseau', description: 'Pare-feu et routage' },
]

export const configOptions = [
  // Ports
  { fact: 'port_21_open', label: 'Port 21 (FTP)', category: 'ports' },
  { fact: 'port_22_open', label: 'Port 22 (SSH)', category: 'ports' },
  { fact: 'port_23_open', label: 'Port 23 (Telnet)', category: 'ports' },
  { fact: 'port_80_open', label: 'Port 80 (HTTP)', category: 'ports' },
  { fact: 'port_443_open', label: 'Port 443 (HTTPS)', category: 'ports' },
  { fact: 'port_445_open', label: 'Port 445 (SMB)', category: 'ports' },
  { fact: 'port_3306_open', label: 'Port 3306 (MySQL)', category: 'ports' },
  { fact: 'port_5432_open', label: 'Port 5432 (PostgreSQL)', category: 'ports' },
  { fact: 'port_6379_open', label: 'Port 6379 (Redis)', category: 'ports' },
  { fact: 'port_27017_open', label: 'Port 27017 (MongoDB)', category: 'ports' },
  
  // SSL
  { fact: 'no_ssl_enabled', label: 'SSL non activé', category: 'ssl' },
  { fact: 'ssl_enabled', label: 'SSL activé', category: 'ssl' },
  { fact: 'ssl_certificate_expired', label: 'Certificat expiré', category: 'ssl' },
  { fact: 'ssl_certificate_valid', label: 'Certificat valide', category: 'ssl' },
  { fact: 'ssl_self_signed', label: 'Certificat auto-signé', category: 'ssl' },
  { fact: 'ssl_weak_cipher', label: 'Chiffrement faible', category: 'ssl' },
  { fact: 'tls_1_0_enabled', label: 'TLS 1.0 activé', category: 'ssl' },
  { fact: 'ssl_3_enabled', label: 'SSL 3.0 activé', category: 'ssl' },
  { fact: 'no_hsts_header', label: 'HSTS absent', category: 'ssl' },
  
  // SSH
  { fact: 'password_auth_enabled', label: 'Auth. par mot de passe', category: 'ssh' },
  { fact: 'key_auth_only', label: 'Auth. par clé uniquement', category: 'ssh' },
  { fact: 'ssh_root_login_enabled', label: 'Login root autorisé', category: 'ssh' },
  { fact: 'ssh_root_login_disabled', label: 'Login root désactivé', category: 'ssh' },
  { fact: 'ssh_protocol_1', label: 'Protocole SSH v1', category: 'ssh' },
  { fact: 'ssh_protocol_2', label: 'Protocole SSH v2', category: 'ssh' },
  { fact: 'ssh_empty_passwords', label: 'Mots de passe vides', category: 'ssh' },
  { fact: 'ssh_no_fail2ban', label: 'Pas de Fail2ban', category: 'ssh' },
  { fact: 'ssh_fail2ban_enabled', label: 'Fail2ban activé', category: 'ssh' },
  
  // Permissions
  { fact: 'permission_777_found', label: 'Permissions 777', category: 'permissions' },
  { fact: 'private_key_readable', label: 'Clés privées lisibles', category: 'permissions' },
  { fact: 'private_key_secured', label: 'Clés privées sécurisées', category: 'permissions' },
  { fact: 'passwd_file_writable', label: '/etc/passwd modifiable', category: 'permissions' },
  { fact: 'shadow_file_readable', label: '/etc/shadow lisible', category: 'permissions' },
  { fact: 'suid_misconfigured', label: 'SUID mal configuré', category: 'permissions' },
  
  // Software
  { fact: 'apache_outdated', label: 'Apache obsolète', category: 'software' },
  { fact: 'nginx_outdated', label: 'Nginx obsolète', category: 'software' },
  { fact: 'php_outdated', label: 'PHP obsolète', category: 'software' },
  { fact: 'mysql_outdated', label: 'MySQL obsolète', category: 'software' },
  { fact: 'openssh_outdated', label: 'OpenSSH obsolète', category: 'software' },
  { fact: 'kernel_outdated', label: 'Kernel obsolète', category: 'software' },
  
  // Database
  { fact: 'ftp_anonymous_enabled', label: 'FTP anonyme', category: 'database' },
  { fact: 'mysql_remote_root', label: 'MySQL root distant', category: 'database' },
  { fact: 'redis_no_auth', label: 'Redis sans auth.', category: 'database' },
  { fact: 'redis_auth_enabled', label: 'Redis avec auth.', category: 'database' },
  { fact: 'mongodb_no_auth', label: 'MongoDB sans auth.', category: 'database' },
  { fact: 'mongodb_auth_enabled', label: 'MongoDB avec auth.', category: 'database' },
  { fact: 'postgres_trust_auth', label: 'PostgreSQL trust', category: 'database' },
  { fact: 'postgres_md5_auth', label: 'PostgreSQL MD5', category: 'database' },
  
  // Network
  { fact: 'no_firewall_enabled', label: 'Pas de pare-feu', category: 'network' },
  { fact: 'firewall_enabled', label: 'Pare-feu activé', category: 'network' },
  { fact: 'ip_forwarding_enabled', label: 'IP forwarding actif', category: 'network' },
  { fact: 'ip_forwarding_disabled', label: 'IP forwarding désactivé', category: 'network' },
  { fact: 'syn_cookies_disabled', label: 'SYN cookies désactivés', category: 'network' },
  { fact: 'syn_cookies_enabled', label: 'SYN cookies activés', category: 'network' },
  { fact: 'snmp_public_community', label: 'SNMP public', category: 'network' },
]

// Règles d'exclusion mutuelle - si on sélectionne A, B est désactivé
export const mutualExclusions: Record<string, string[]> = {
  // SSL
  'no_ssl_enabled': ['ssl_enabled', 'ssl_certificate_expired', 'ssl_certificate_valid', 'ssl_self_signed', 'ssl_weak_cipher', 'tls_1_0_enabled', 'ssl_3_enabled', 'no_hsts_header'],
  'ssl_enabled': ['no_ssl_enabled'],
  'ssl_certificate_expired': ['ssl_certificate_valid', 'no_ssl_enabled'],
  'ssl_certificate_valid': ['ssl_certificate_expired', 'no_ssl_enabled'],
  
  // SSH
  'password_auth_enabled': ['key_auth_only'],
  'key_auth_only': ['password_auth_enabled', 'ssh_empty_passwords'],
  'ssh_root_login_enabled': ['ssh_root_login_disabled'],
  'ssh_root_login_disabled': ['ssh_root_login_enabled'],
  'ssh_protocol_1': ['ssh_protocol_2'],
  'ssh_protocol_2': ['ssh_protocol_1'],
  'ssh_no_fail2ban': ['ssh_fail2ban_enabled'],
  'ssh_fail2ban_enabled': ['ssh_no_fail2ban'],
  
  // Permissions
  'private_key_readable': ['private_key_secured'],
  'private_key_secured': ['private_key_readable'],
  
  // Database
  'redis_no_auth': ['redis_auth_enabled'],
  'redis_auth_enabled': ['redis_no_auth'],
  'mongodb_no_auth': ['mongodb_auth_enabled'],
  'mongodb_auth_enabled': ['mongodb_no_auth'],
  'postgres_trust_auth': ['postgres_md5_auth'],
  'postgres_md5_auth': ['postgres_trust_auth'],
  
  // Network
  'no_firewall_enabled': ['firewall_enabled'],
  'firewall_enabled': ['no_firewall_enabled'],
  'ip_forwarding_enabled': ['ip_forwarding_disabled'],
  'ip_forwarding_disabled': ['ip_forwarding_enabled'],
  'syn_cookies_disabled': ['syn_cookies_enabled'],
  'syn_cookies_enabled': ['syn_cookies_disabled'],
}
