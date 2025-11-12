/**
 * Email Template Translations
 *
 * Centralized translation system for email templates.
 * Each email can import and use these translations based on locale.
 */

export type Locale = 'en' | 'es';

/**
 * Get translated text based on locale
 */
export function t(translations: { en: string; es: string }, locale: Locale = 'en'): string {
  return translations[locale] || translations.en;
}

/**
 * Common email translations used across multiple templates
 */
export const commonTranslations = {
  // Buttons
  viewDashboard: {
    en: 'View Dashboard',
    es: 'Ver Panel de Control',
  },
  emailClient: {
    en: 'Email Client',
    es: 'Enviar Correo',
  },
  callClient: {
    en: 'Call Client',
    es: 'Llamar Cliente',
  },
  replyViaEmail: {
    en: 'Reply via Email',
    es: 'Responder por Correo',
  },
  callNow: {
    en: 'Call Now',
    es: 'Llamar Ahora',
  },

  // Common labels
  name: {
    en: 'Name',
    es: 'Nombre',
  },
  email: {
    en: 'Email',
    es: 'Correo Electrónico',
  },
  phone: {
    en: 'Phone',
    es: 'Teléfono',
  },
  source: {
    en: 'Source',
    es: 'Fuente',
  },
  message: {
    en: 'Message',
    es: 'Mensaje',
  },
  submitted: {
    en: 'Submitted',
    es: 'Enviado',
  },

  // Service types
  services: {
    individual: {
      en: 'Individual Tax Return',
      es: 'Declaración de Impuestos Individual',
    },
    business: {
      en: 'Business Tax Return',
      es: 'Declaración de Impuestos Comercial',
    },
    'real-estate': {
      en: 'Real Estate Professional',
      es: 'Profesional de Bienes Raíces',
    },
    'audit-defense': {
      en: 'Audit Defense',
      es: 'Defensa de Auditoría',
    },
    'tax-planning': {
      en: 'Tax Planning',
      es: 'Planificación Fiscal',
    },
    'tax-consultation': {
      en: 'Tax Consultation',
      es: 'Consulta Fiscal',
    },
    'tax-intake': {
      en: 'Tax Intake',
      es: 'Formulario de Impuestos',
    },
  },

  // Filing status
  filingStatus: {
    single: {
      en: 'Single',
      es: 'Soltero(a)',
    },
    married_filing_separately: {
      en: 'Married Filing Separately',
      es: 'Casado(a) Declarando por Separado',
    },
    married_filing_jointly: {
      en: 'Married Filing Jointly',
      es: 'Casado(a) Declarando Conjuntamente',
    },
    head_of_household: {
      en: 'Head of Household',
      es: 'Jefe de Familia',
    },
    qualifying_widow: {
      en: 'Qualifying Widow(er)',
      es: 'Viudo(a) Calificado(a)',
    },
  },

  // Employment types
  employment: {
    w2: {
      en: 'W-2',
      es: 'W-2',
    },
    '1099': {
      en: '1099',
      es: '1099',
    },
    both: {
      en: 'W-2 & 1099',
      es: 'W-2 y 1099',
    },
  },

  // Yes/No
  yes: {
    en: 'Yes',
    es: 'Sí',
  },
  no: {
    en: 'No',
    es: 'No',
  },

  // Copyright
  copyright: {
    en: '© 2025 TaxGeniusPro',
    es: '© 2025 TaxGeniusPro',
  },
};

/**
 * Contact Form Notification Translations
 */
export const contactFormTranslations = {
  title: {
    en: '📬 New Contact Form Submission',
    es: '📬 Nuevo Formulario de Contacto',
  },
  urgentBanner: {
    en: '⏰ New inquiry received - Respond within 2 hours for best conversion',
    es: '⏰ Nueva consulta recibida - Responda en 2 horas para mejor conversión',
  },
  contactInformation: {
    en: '📞 Contact Information',
    es: '📞 Información de Contacto',
  },
  messageLabel: {
    en: '💬 Message',
    es: '💬 Mensaje',
  },
  submittedLabel: {
    en: 'Submitted',
    es: 'Enviado',
  },
  sourceLabel: {
    en: 'Source',
    es: 'Fuente',
  },
  sourcePage: {
    en: 'TaxGeniusPro Contact Page',
    es: 'Página de Contacto TaxGeniusPro',
  },
  recommendedActions: {
    en: '⚡ Recommended Actions',
    es: '⚡ Acciones Recomendadas',
  },
  action1: {
    en: 'Respond within 2 hours for highest conversion rate',
    es: 'Responda en 2 horas para mayor tasa de conversión',
  },
  action2: {
    en: 'Call {phone} if provided for immediate connection',
    es: 'Llame a {phone} si está disponible para conexión inmediata',
  },
  action2NoPhone: {
    en: 'Call the prospect if phone provided for immediate connection',
    es: 'Llame al prospecto si el teléfono está disponible',
  },
  action3: {
    en: 'Send personalized email addressing their {service}',
    es: 'Envíe correo personalizado sobre {service}',
  },
  action4: {
    en: 'Create CRM record if not exists',
    es: 'Crear registro CRM si no existe',
  },
  action5: {
    en: 'Schedule follow-up if no response within 24 hours',
    es: 'Programe seguimiento si no hay respuesta en 24 horas',
  },
  quickReplyTitle: {
    en: '📧 Quick Reply Template',
    es: '📧 Plantilla de Respuesta Rápida',
  },
  quickReplyTemplate: {
    en: `Hi {firstName},

Thank you for contacting TaxGeniusPro! I received your inquiry about {service}.

I'd love to discuss how we can help. Are you available for a quick call {phoneText}?

Alternatively, you can schedule a consultation at your convenience: https://taxgeniuspro.tax/book-appointment

Looking forward to helping you!

Best regards,
TaxGeniusPro Team`,
    es: `Hola {firstName},

¡Gracias por contactar a TaxGeniusPro! Recibí su consulta sobre {service}.

Me encantaría discutir cómo podemos ayudarle. ¿Está disponible para una llamada rápida {phoneText}?

Alternativamente, puede programar una consulta cuando le convenga: https://taxgeniuspro.tax/book-appointment

¡Esperamos poder ayudarle!

Saludos cordiales,
Equipo TaxGeniusPro`,
  },
  atPhone: {
    en: 'at {phone}',
    es: 'al {phone}',
  },
  thisWeek: {
    en: 'this week',
    es: 'esta semana',
  },
  notificationSentTo: {
    en: 'This notification was sent to {email}',
    es: 'Esta notificación fue enviada a {email}',
  },
};

/**
 * Tax Intake Complete Translations
 */
export const taxIntakeTranslations = {
  title: {
    en: 'Complete Tax Intake Received',
    es: 'Formulario de Impuestos Completo Recibido',
  },
  greeting: {
    en: 'Hi {name},',
    es: 'Hola {name},',
  },
  subtext: {
    en: 'Client ready for tax preparation',
    es: 'Cliente listo para preparación de impuestos',
  },
  clientInformation: {
    en: 'CLIENT INFORMATION',
    es: 'INFORMACIÓN DEL CLIENTE',
  },
  address: {
    en: 'ADDRESS',
    es: 'DIRECCIÓN',
  },
  taxFiling: {
    en: 'TAX FILING',
    es: 'DECLARACIÓN DE IMPUESTOS',
  },
  filingStatus: {
    en: 'Filing Status',
    es: 'Estado de Declaración',
  },
  employment: {
    en: 'Employment',
    es: 'Empleo',
  },
  occupation: {
    en: 'Occupation',
    es: 'Ocupación',
  },
  claimedAsDependent: {
    en: 'Claimed as Dependent',
    es: 'Reclamado como Dependiente',
  },
  inCollege: {
    en: 'Currently in College',
    es: 'Actualmente en Universidad',
  },
  dependents: {
    en: 'DEPENDENTS',
    es: 'DEPENDIENTES',
  },
  number: {
    en: 'Number',
    es: 'Número',
  },
  under24StudentDisabled: {
    en: 'Under 24 / Student / Disabled',
    es: 'Menor de 24 / Estudiante / Discapacitado',
  },
  dependentsInCollege: {
    en: 'In College',
    es: 'En Universidad',
  },
  childCareProvider: {
    en: 'Child Care Provider',
    es: 'Proveedor de Cuidado Infantil',
  },
  propertyCredits: {
    en: 'PROPERTY & CREDITS',
    es: 'PROPIEDAD Y CRÉDITOS',
  },
  hasMortgage: {
    en: 'Has Mortgage',
    es: 'Tiene Hipoteca',
  },
  deniedEitc: {
    en: 'Previously Denied EITC',
    es: 'EITC Denegado Anteriormente',
  },
  irsRefund: {
    en: 'IRS & REFUND',
    es: 'IRS Y REEMBOLSO',
  },
  hasIrsPin: {
    en: 'Has IRS PIN',
    es: 'Tiene PIN del IRS',
  },
  irsPinYes: {
    en: 'Yes ({pin})',
    es: 'Sí ({pin})',
  },
  irsPinLocate: {
    en: 'Yes (Need to Locate)',
    es: 'Sí (Necesita Localizar)',
  },
  wantsRefundAdvance: {
    en: 'Wants Refund Advance',
    es: 'Desea Anticipo de Reembolso',
  },
  identification: {
    en: 'IDENTIFICATION',
    es: 'IDENTIFICACIÓN',
  },
  driversLicense: {
    en: "Driver's License",
    es: 'Licencia de Conducir',
  },
  expiration: {
    en: 'Expiration',
    es: 'Vencimiento',
  },
  referrer: {
    en: 'Referrer',
    es: 'Referente',
  },
  dob: {
    en: 'DOB',
    es: 'Fecha de Nacimiento',
  },
  ssn: {
    en: 'SSN',
    es: 'SSN',
  },
};

/**
 * New Lead Notification Translations
 */
export const newLeadTranslations = {
  title: {
    en: 'New Lead Assigned',
    es: 'Nuevo Cliente Potencial Asignado',
  },
  greeting: {
    en: 'Hi {name},',
    es: 'Hola {name},',
  },
  contactInformation: {
    en: 'Contact Information',
    es: 'Información de Contacto',
  },
  messageLabel: {
    en: 'Message',
    es: 'Mensaje',
  },
  leadId: {
    en: 'Lead ID: {id}',
    es: 'ID de Cliente: {id}',
  },
};
