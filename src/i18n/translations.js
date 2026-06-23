// ---------------------------------------------------------------------------
// ExpiryGuard — translation dictionary (FR / EN / ES)
// ---------------------------------------------------------------------------
// Structure is flat with dot-namespace keys (e.g. t('nav.dashboard')).
// Interpolation: {var} placeholders, e.g. t('relative.inDays', { n: 5 }).
// ---------------------------------------------------------------------------

export const LANGUAGES = [
  { code: 'fr', label: 'Français', flag: '🇫🇷', short: 'FR', intlLocale: 'fr-FR' },
  { code: 'en', label: 'English', flag: '🇬🇧', short: 'EN', intlLocale: 'en-GB' },
  { code: 'es', label: 'Español', flag: '🇪🇸', short: 'ES', intlLocale: 'es-ES' },
]

export const DEFAULT_LANGUAGE = 'fr'

export const translations = {
  // ---- App / brand ----
  app: {
    name: 'ExpiryGuard',
    tagline: {
      fr: 'Moniteur d’expiration',
      en: 'Expiry Monitor',
      es: 'Monitor de caducidad',
    },
  },

  // ---- Sidebar navigation ----
  nav: {
    sectionPilot: {
      fr: 'Pilotage',
      en: 'Manage',
      es: 'Gestión',
    },
    sectionAccount: {
      fr: 'Compte',
      en: 'Account',
      es: 'Cuenta',
    },
    dashboard: {
      fr: 'Tableau de bord',
      en: 'Dashboard',
      es: 'Panel',
    },
    domains: {
      fr: 'Domaines',
      en: 'Domains',
      es: 'Dominios',
    },
    ssl: {
      fr: 'SSL',
      en: 'SSL',
      es: 'SSL',
    },
    cards: {
      fr: 'Cartes',
      en: 'Cards',
      es: 'Tarjetas',
    },
    settings: {
      fr: 'Paramètres',
      en: 'Settings',
      es: 'Ajustes',
    },
  },

  // ---- Pro upsell card ----
  proCard: {
    title: {
      fr: 'Plan Pro',
      en: 'Pro plan',
      es: 'Plan Pro',
    },
    body: {
      fr: 'Alertes Slack, monitoring 24/7 et audits illimités.',
      en: 'Slack alerts, 24/7 monitoring and unlimited audits.',
      es: 'Alertas Slack, monitorización 24/7 y auditorías ilimitadas.',
    },
    cta: {
      fr: 'Passer au Pro',
      en: 'Upgrade to Pro',
      es: 'Pasar a Pro',
    },
  },

  // ---- Top bar ----
  topbar: {
    searchPlaceholder: {
      fr: 'Rechercher un domaine, un service, un client…',
      en: 'Search a domain, a service, a client…',
      es: 'Buscar un dominio, un servicio, un cliente…',
    },
    tenantLabel: {
      fr: 'Client / Agence',
      en: 'Client / Agency',
      es: 'Cliente / Agencia',
    },
    allTenants: {
      fr: 'Tous les clients',
      en: 'All clients',
      es: 'Todos los clientes',
    },
    notifications: {
      fr: 'Notifications',
      en: 'Notifications',
      es: 'Notificaciones',
    },
  },

  // ---- Page header ----
  page: {
    title: {
      fr: 'Tableau de bord',
      en: 'Dashboard',
      es: 'Panel de control',
    },
    subtitle: {
      fr: 'Surveillez l’expiration de vos domaines, certificats et cartes.',
      en: 'Track the expiration of your domains, certificates and cards.',
      es: 'Vigila la caducidad de tus dominios, certificados y tarjetas.',
    },
    addAsset: {
      fr: 'Ajouter un actif',
      en: 'Add asset',
      es: 'Añadir activo',
    },
  },

  // ---- KPI cards ----
  kpi: {
    total: {
      label: {
        fr: 'Total des actifs',
        en: 'Total assets',
        es: 'Activos totales',
      },
      sub: {
        fr: 'Sous surveillance',
        en: 'Under watch',
        es: 'Bajo vigilancia',
      },
    },
    critical: {
      label: {
        fr: 'Alertes urgentes',
        en: 'Urgent alerts',
        es: 'Alertas urgentes',
      },
      sub: {
        fr: 'Expirent ≤ 7 jours',
        en: 'Expiring ≤ 7 days',
        es: 'Caducan ≤ 7 días',
      },
    },
    expired: {
      label: {
        fr: 'Expirés',
        en: 'Expired',
        es: 'Caducados',
      },
      sub: {
        fr: 'Action immédiate requise',
        en: 'Immediate action required',
        es: 'Acción inmediata requerida',
      },
    },
    warning: {
      label: {
        fr: 'Prochains 30 jours',
        en: 'Next 30 days',
        es: 'Próximos 30 días',
      },
      sub: {
        fr: 'À planifier',
        en: 'To schedule',
        es: 'Para planificar',
      },
    },
    filterAction: {
      fr: 'Filtrer',
      en: 'Filter',
      es: 'Filtrar',
    },
  },

  // ---- Status badges ----
  status: {
    safe: {
      fr: 'Sain',
      en: 'Safe',
      es: 'Sano',
    },
    warning: {
      fr: 'Attention',
      en: 'Warning',
      es: 'Atención',
    },
    critical: {
      fr: 'Urgent',
      en: 'Critical',
      es: 'Urgente',
    },
    expired: {
      fr: 'Expiré',
      en: 'Expired',
      es: 'Caducado',
    },
  },

  // ---- Relative time hints ----
  relative: {
    today: {
      fr: 'Aujourd’hui',
      en: 'Today',
      es: 'Hoy',
    },
    tomorrow: {
      fr: 'Demain',
      en: 'Tomorrow',
      es: 'Mañana',
    },
    yesterday: {
      fr: 'Hier',
      en: 'Yesterday',
      es: 'Ayer',
    },
    inDays: {
      fr: 'Dans {n} jours',
      en: 'In {n} days',
      es: 'En {n} días',
    },
    inMonths: {
      fr: 'Dans {n} mois',
      en: 'In {n} months',
      es: 'En {n} meses',
    },
    agoDays: {
      fr: 'Il y a {n} jours',
      en: '{n} days ago',
      es: 'Hace {n} días',
    },
    agoMonths: {
      fr: 'Il y a {n} mois',
      en: '{n} months ago',
      es: 'Hace {n} meses',
    },
  },

  // ---- Asset types ----
  assetType: {
    domain: {
      fr: 'Domaine',
      en: 'Domain',
      es: 'Dominio',
    },
    ssl: {
      fr: 'Certificat SSL',
      en: 'SSL certificate',
      es: 'Certificado SSL',
    },
    card: {
      fr: 'Carte bancaire',
      en: 'Credit card',
      es: 'Tarjeta bancaria',
    },
  },

  // ---- Table ----
  table: {
    title: {
      fr: 'Actifs surveillés',
      en: 'Monitored assets',
      es: 'Activos monitorizados',
    },
    colType: {
      fr: 'Type',
      en: 'Type',
      es: 'Tipo',
    },
    colName: {
      fr: 'Nom / Service',
      en: 'Name / Service',
      es: 'Nombre / Servicio',
    },
    colTenant: {
      fr: 'Client',
      en: 'Client',
      es: 'Cliente',
    },
    colExpiry: {
      fr: 'Expiration',
      en: 'Expiry',
      es: 'Caducidad',
    },
    colStatus: {
      fr: 'Statut',
      en: 'Status',
      es: 'Estado',
    },
    colAction: {
      fr: 'Action',
      en: 'Action',
      es: 'Acción',
    },
    renew: {
      fr: 'Renouveler',
      en: 'Renew',
      es: 'Renovar',
    },
    sortNearestFirst: {
      fr: 'Du plus proche au plus lointain',
      en: 'Nearest first',
      es: 'Más cercano primero',
    },
    empty: {
      fr: 'Aucun actif ne correspond à votre recherche.',
      en: 'No asset matches your search.',
      es: 'Ningún activo coincide con tu búsqueda.',
    },
    resultsCount: {
      fr: '{count} actif(s)',
      en: '{count} asset(s)',
      es: '{count} activo(s)',
    },
  },

  // ---- Filter chips above the table ----
  filters: {
    all: {
      fr: 'Tous',
      en: 'All',
      es: 'Todos',
    },
    criticalChip: {
      fr: 'Urgents',
      en: 'Critical',
      es: 'Urgentes',
    },
    warningChip: {
      fr: 'À venir',
      en: 'Upcoming',
      es: 'Próximos',
    },
    expiredChip: {
      fr: 'Expirés',
      en: 'Expired',
      es: 'Caducados',
    },
    clear: {
      fr: 'Réinitialiser',
      en: 'Clear',
      es: 'Limpiar',
    },
  },

  // ---- Add asset modal ----
  modal: {
    title: {
      fr: 'Ajouter un actif',
      en: 'Add an asset',
      es: 'Añadir un activo',
    },
    subtitle: {
      fr: 'Renseignez les informations ci-dessous. Le statut est calculé automatiquement.',
      en: 'Fill in the details below. Status is computed automatically.',
      es: 'Rellena los datos a continuación. El estado se calcula automáticamente.',
    },
    typeLabel: {
      fr: 'Type d’actif',
      en: 'Asset type',
      es: 'Tipo de activo',
    },
    cancel: {
      fr: 'Annuler',
      en: 'Cancel',
      es: 'Cancelar',
    },
    submit: {
      fr: 'Ajouter l’actif',
      en: 'Add asset',
      es: 'Añadir activo',
    },
    // Dynamic field labels per type
    fields: {
      domainName: {
        fr: 'Nom de domaine',
        en: 'Domain name',
        es: 'Nombre de dominio',
      },
      domainPlaceholder: {
        fr: 'client-alpha.com',
        en: 'client-alpha.com',
        es: 'client-alpha.com',
      },
      registrar: {
        fr: 'Registrar',
        en: 'Registrar',
        es: 'Registrador',
      },
      registrarPlaceholder: {
        fr: 'Namecheap, OVHcloud…',
        en: 'Namecheap, GoDaddy…',
        es: 'Namecheap, OVHcloud…',
      },
      sslName: {
        fr: 'Sous-domaine',
        en: 'Subdomain',
        es: 'Subdominio',
      },
      sslPlaceholder: {
        fr: 'checkout.client-alpha.com',
        en: 'checkout.client-alpha.com',
        es: 'checkout.client-alpha.com',
      },
      authority: {
        fr: 'Autorité de certification',
        en: 'Certificate authority',
        es: 'Autoridad certificadora',
      },
      authorityPlaceholder: {
        fr: "Let’s Encrypt, DigiCert…",
        en: 'Let’s Encrypt, DigiCert…',
        es: 'Let’s Encrypt, DigiCert…',
      },
      cardService: {
        fr: 'Service abonné',
        en: 'Subscribed service',
        es: 'Servicio suscrito',
      },
      cardServicePlaceholder: {
        fr: 'AWS, ChatGPT, Ahrefs…',
        en: 'AWS, ChatGPT, Ahrefs…',
        es: 'AWS, ChatGPT, Ahrefs…',
      },
      last4: {
        fr: '4 derniers chiffres',
        en: 'Last 4 digits',
        es: 'Últimos 4 dígitos',
      },
      last4Placeholder: {
        fr: '4532',
        en: '4532',
        es: '4532',
      },
      expiryDate: {
        fr: "Date d’expiration",
        en: 'Expiry date',
        es: 'Fecha de caducidad',
      },
      cardExpiry: {
        fr: 'Mois / Année d’expiration',
        en: 'Expiry month / year',
        es: 'Mes / Año de caducidad',
      },
      tenant: {
        fr: 'Client associé',
        en: 'Associated client',
        es: 'Cliente asociado',
      },
    },
    errors: {
      required: {
        fr: 'Ce champ est obligatoire.',
        en: 'This field is required.',
        es: 'Este campo es obligatorio.',
      },
      last4: {
        fr: 'Entrez exactement 4 chiffres.',
        en: 'Enter exactly 4 digits.',
        es: 'Introduce exactamente 4 dígitos.',
      },
    },
  },

  // ---- Misc ----
  misc: {
    proBadge: {
      fr: 'PRO',
      en: 'PRO',
      es: 'PRO',
    },
  },
}
