'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  DollarSign,
  Upload,
  Camera,
  FileText,
  Check,
  ArrowRight,
  ArrowLeft,
  Globe,
  AlertCircle,
  Loader2,
  CheckCircle,
  Clock,
  Shield,
  Zap,
  TrendingUp,
  Calculator
} from 'lucide-react'

interface ApplicationData {
  // Personal Info
  firstName: string
  lastName: string
  ssn: string
  dob: string
  phone: string
  email: string

  // Income Info
  employmentType: string
  employer: string
  annualIncome: number
  lastYearIncome: number
  hasW2: boolean
  has1099: boolean

  // Documents
  w2Files: File[]
  form1099Files: File[]
  idFile: File | null

  // Advance Details
  requestedAmount: number
  estimatedRefund: number
  bankAccount: string
  routingNumber: string
}

export default function ApplyPage() {
  const router = useRouter()
  const [language, setLanguage] = useState<'en' | 'es'>('en')
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [approved, setApproved] = useState(false)
  const [decisionMade, setDecisionMade] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<ApplicationData>({
    firstName: '',
    lastName: '',
    ssn: '',
    dob: '',
    phone: '',
    email: '',
    employmentType: 'gig',
    employer: '',
    annualIncome: 35000,
    lastYearIncome: 32000,
    hasW2: false,
    has1099: true,
    w2Files: [],
    form1099Files: [],
    idFile: null,
    requestedAmount: 2500,
    estimatedRefund: 0,
    bankAccount: '',
    routingNumber: ''
  })

  // Calculate estimated refund based on income
  useEffect(() => {
    const estimatedTax = formData.annualIncome * 0.22 // Simplified calculation
    const estimatedWithholding = formData.hasW2 ? formData.annualIncome * 0.15 : 0
    const estimatedRefund = Math.max(0, estimatedWithholding - estimatedTax + 3000) // Include credits
    const maxAdvance = Math.min(7000, estimatedRefund * 0.8) // 80% of refund, max $7000

    setFormData(prev => ({
      ...prev,
      estimatedRefund: Math.round(estimatedRefund),
      requestedAmount: Math.min(prev.requestedAmount, maxAdvance)
    }))
  }, [formData.annualIncome, formData.hasW2])

  const content = {
    en: {
      title: "Get Your Cash in 10 Minutes!",
      urgentBadge: "⚡ 341 people got approved in the last hour",
      steps: {
        1: "Personal Info",
        2: "Income Details",
        3: "Upload Documents",
        4: "Review & Submit"
      },
      // Personal Info
      firstName: "First Name",
      lastName: "Last Name",
      ssn: "Social Security Number",
      ssnPlaceholder: "XXX-XX-XXXX",
      dob: "Date of Birth",
      phone: "Phone Number",
      email: "Email Address",

      // Income
      employmentType: "Employment Type",
      employer: "Employer/Platform Name",
      annualIncome: "Expected Income This Year",
      lastYearIncome: "Last Year's Income",
      taxForms: "Tax Forms You Have",

      // Documents
      uploadW2: "Upload W-2 Forms",
      upload1099: "Upload 1099 Forms",
      uploadId: "Upload ID (Driver's License)",
      takePhoto: "Take Photo",
      chooseFile: "Choose File",
      filesUploaded: "files uploaded",

      // Review
      requestedAmount: "Amount Requested",
      estimatedRefund: "Estimated Refund",
      maxAdvance: "Maximum Advance Available",
      bankAccount: "Bank Account (Last 4 digits)",
      routingNumber: "Routing Number",

      // Buttons
      continue: "Continue",
      back: "Back",
      submit: "Submit Application",
      processing: "Processing...",

      // Decision
      congratulations: "Congratulations! You're Approved!",
      approvedAmount: "Approved Amount",
      fundsReady: "Funds will be in your account within 10 minutes",
      declined: "Application Under Review",
      declinedMessage: "We need additional information. A specialist will contact you within 24 hours.",

      benefits: [
        "Instant approval decision",
        "No credit check required",
        "Money in 10 minutes",
        "No hidden fees"
      ]
    },
    es: {
      title: "¡Obtén Tu Dinero en 10 Minutos!",
      urgentBadge: "⚡ 341 personas aprobadas en la última hora",
      steps: {
        1: "Información Personal",
        2: "Detalles de Ingresos",
        3: "Subir Documentos",
        4: "Revisar y Enviar"
      },
      // Personal Info
      firstName: "Nombre",
      lastName: "Apellido",
      ssn: "Número de Seguro Social",
      ssnPlaceholder: "XXX-XX-XXXX",
      dob: "Fecha de Nacimiento",
      phone: "Número de Teléfono",
      email: "Correo Electrónico",

      // Income
      employmentType: "Tipo de Empleo",
      employer: "Empleador/Plataforma",
      annualIncome: "Ingreso Esperado Este Año",
      lastYearIncome: "Ingreso del Año Pasado",
      taxForms: "Formularios de Impuestos que Tiene",

      // Documents
      uploadW2: "Subir Formularios W-2",
      upload1099: "Subir Formularios 1099",
      uploadId: "Subir ID (Licencia de Conducir)",
      takePhoto: "Tomar Foto",
      chooseFile: "Elegir Archivo",
      filesUploaded: "archivos subidos",

      // Review
      requestedAmount: "Cantidad Solicitada",
      estimatedRefund: "Reembolso Estimado",
      maxAdvance: "Adelanto Máximo Disponible",
      bankAccount: "Cuenta Bancaria (Últimos 4 dígitos)",
      routingNumber: "Número de Ruta",

      // Buttons
      continue: "Continuar",
      back: "Atrás",
      submit: "Enviar Solicitud",
      processing: "Procesando...",

      // Decision
      congratulations: "¡Felicidades! ¡Estás Aprobado!",
      approvedAmount: "Cantidad Aprobada",
      fundsReady: "Los fondos estarán en tu cuenta en 10 minutos",
      declined: "Solicitud en Revisión",
      declinedMessage: "Necesitamos información adicional. Un especialista te contactará en 24 horas.",

      benefits: [
        "Decisión de aprobación instantánea",
        "No requiere verificación de crédito",
        "Dinero en 10 minutos",
        "Sin cargos ocultos"
      ]
    }
  }

  const t = content[language]

  const updateFormData = (field: keyof ApplicationData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (files: FileList | null, field: 'w2Files' | 'form1099Files' | 'idFile') => {
    if (!files) return

    if (field === 'idFile') {
      updateFormData(field, files[0])
    } else {
      const fileArray = Array.from(files)
      updateFormData(field, [...formData[field], ...fileArray])
    }

    // Simulate OCR processing
    setTimeout(() => {
      // Extract data from documents (simulated)
      if (field === 'w2Files' || field === 'form1099Files') {
        const extractedIncome = Math.floor(Math.random() * 20000) + 30000
        updateFormData('lastYearIncome', extractedIncome)
      }
    }, 1000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (step < 4) {
      setStep(step + 1)
      return
    }

    setIsProcessing(true)

    // Simulate API call and decision
    setTimeout(() => {
      setIsProcessing(false)
      setDecisionMade(true)
      // 85% approval rate
      setApproved(Math.random() > 0.15)
    }, 3000)
  }

  const progress = (step / 4) * 100

  if (decisionMade) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="max-w-lg w-full">
          <CardHeader className="text-center space-y-4">
            {approved ? (
              <>
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <CardTitle className="text-2xl text-green-600">{t.congratulations}</CardTitle>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{t.approvedAmount}</p>
                  <p className="text-4xl font-bold text-primary">${formData.requestedAmount.toLocaleString()}</p>
                </div>
                <Alert className="bg-green-50 dark:bg-green-950/20 border-green-200">
                  <Clock className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-600 font-medium">
                    {t.fundsReady}
                  </AlertDescription>
                </Alert>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto">
                  <Clock className="w-12 h-12 text-yellow-600" />
                </div>
                <CardTitle className="text-2xl">{t.declined}</CardTitle>
                <CardDescription className="text-base">
                  {t.declinedMessage}
                </CardDescription>
              </>
            )}
          </CardHeader>
          <CardFooter>
            <Button
              className="w-full"
              onClick={() => router.push('/dashboard/client')}
            >
              Go to Dashboard
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="border-2 shadow-xl">
          <CardHeader className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold">{t.title}</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
                className="flex items-center gap-1"
              >
                <Globe className="w-4 h-4" />
                {language === 'en' ? 'ES' : 'EN'}
              </Button>
            </div>

            {/* Urgency Badge */}
            <Alert className="bg-accent dark:bg-accent border-accent-foreground">
              <Zap className="h-4 w-4 text-accent-foreground" />
              <AlertDescription className="text-sm font-medium text-accent-foreground">
                {t.urgentBadge}
              </AlertDescription>
            </Alert>

            {/* Progress Bar */}
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                {Object.entries(t.steps).map(([num, label]) => (
                  <span
                    key={num}
                    className={step >= parseInt(num) ? 'text-primary font-semibold' : ''}
                  >
                    {num}. {label}
                  </span>
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Personal Info */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">{t.firstName}</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => updateFormData('firstName', e.target.value)}
                        required
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">{t.lastName}</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => updateFormData('lastName', e.target.value)}
                        required
                        className="h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ssn">{t.ssn}</Label>
                    <Input
                      id="ssn"
                      placeholder={t.ssnPlaceholder}
                      value={formData.ssn}
                      onChange={(e) => updateFormData('ssn', e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dob">{t.dob}</Label>
                      <Input
                        id="dob"
                        type="date"
                        value={formData.dob}
                        onChange={(e) => updateFormData('dob', e.target.value)}
                        required
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t.phone}</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateFormData('phone', e.target.value)}
                        required
                        className="h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{t.email}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Income Details */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="employmentType">{t.employmentType}</Label>
                    <Select
                      value={formData.employmentType}
                      onValueChange={(value) => updateFormData('employmentType', value)}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gig">Gig Worker (Uber, DoorDash, etc)</SelectItem>
                        <SelectItem value="w2">W-2 Employee</SelectItem>
                        <SelectItem value="1099">1099 Contractor</SelectItem>
                        <SelectItem value="both">Both W-2 and 1099</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employer">{t.employer}</Label>
                    <Input
                      id="employer"
                      value={formData.employer}
                      onChange={(e) => updateFormData('employer', e.target.value)}
                      placeholder="Uber, Lyft, DoorDash, etc."
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="annualIncome">
                      {t.annualIncome}: ${formData.annualIncome.toLocaleString()}
                    </Label>
                    <Slider
                      id="annualIncome"
                      min={10000}
                      max={150000}
                      step={1000}
                      value={[formData.annualIncome]}
                      onValueChange={([value]) => updateFormData('annualIncome', value)}
                      className="py-4"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>$10,000</span>
                      <span>$150,000</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastYearIncome">
                      {t.lastYearIncome}: ${formData.lastYearIncome.toLocaleString()}
                    </Label>
                    <Slider
                      id="lastYearIncome"
                      min={10000}
                      max={150000}
                      step={1000}
                      value={[formData.lastYearIncome]}
                      onValueChange={([value]) => updateFormData('lastYearIncome', value)}
                      className="py-4"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>{t.taxForms}</Label>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.hasW2}
                          onChange={(e) => updateFormData('hasW2', e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span>W-2 Forms</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.has1099}
                          onChange={(e) => updateFormData('has1099', e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span>1099 Forms</span>
                      </label>
                    </div>
                  </div>

                  {/* Estimated Refund Calculator */}
                  <Alert className="bg-green-50 dark:bg-green-950/20 border-green-200">
                    <Calculator className="h-4 w-4 text-green-600" />
                    <AlertDescription>
                      <div className="space-y-1">
                        <p className="font-medium text-green-900 dark:text-green-100">
                          Estimated Tax Refund: ${formData.estimatedRefund.toLocaleString()}
                        </p>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          Maximum Advance Available: ${Math.min(7000, formData.estimatedRefund * 0.8).toLocaleString()}
                        </p>
                      </div>
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {/* Step 3: Upload Documents */}
              {step === 3 && (
                <div className="space-y-4">
                  {formData.hasW2 && (
                    <div className="space-y-2">
                      <Label>{t.uploadW2}</Label>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex-1"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          {t.chooseFile}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => cameraInputRef.current?.click()}
                          className="flex-1"
                        >
                          <Camera className="w-4 h-4 mr-2" />
                          {t.takePhoto}
                        </Button>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,.pdf"
                        multiple
                        className="hidden"
                        onChange={(e) => handleFileUpload(e.target.files, 'w2Files')}
                      />
                      <input
                        ref={cameraInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e.target.files, 'w2Files')}
                      />
                      {formData.w2Files.length > 0 && (
                        <p className="text-sm text-muted-foreground">
                          <FileText className="w-4 h-4 inline mr-1" />
                          {formData.w2Files.length} {t.filesUploaded}
                        </p>
                      )}
                    </div>
                  )}

                  {formData.has1099 && (
                    <div className="space-y-2">
                      <Label>{t.upload1099}</Label>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            const input = document.createElement('input')
                            input.type = 'file'
                            input.accept = 'image/*,.pdf'
                            input.multiple = true
                            input.onchange = (e) => handleFileUpload((e.target as HTMLInputElement).files, 'form1099Files')
                            input.click()
                          }}
                          className="flex-1"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          {t.chooseFile}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            const input = document.createElement('input')
                            input.type = 'file'
                            input.accept = 'image/*'
                            input.capture = 'environment'
                            input.onchange = (e) => handleFileUpload((e.target as HTMLInputElement).files, 'form1099Files')
                            input.click()
                          }}
                          className="flex-1"
                        >
                          <Camera className="w-4 h-4 mr-2" />
                          {t.takePhoto}
                        </Button>
                      </div>
                      {formData.form1099Files.length > 0 && (
                        <p className="text-sm text-muted-foreground">
                          <FileText className="w-4 h-4 inline mr-1" />
                          {formData.form1099Files.length} {t.filesUploaded}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>{t.uploadId}</Label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const input = document.createElement('input')
                          input.type = 'file'
                          input.accept = 'image/*'
                          input.onchange = (e) => handleFileUpload((e.target as HTMLInputElement).files, 'idFile')
                          input.click()
                        }}
                        className="flex-1"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {t.chooseFile}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const input = document.createElement('input')
                          input.type = 'file'
                          input.accept = 'image/*'
                          input.capture = 'user'
                          input.onchange = (e) => handleFileUpload((e.target as HTMLInputElement).files, 'idFile')
                          input.click()
                        }}
                        className="flex-1"
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        {t.takePhoto}
                      </Button>
                    </div>
                    {formData.idFile && (
                      <p className="text-sm text-muted-foreground">
                        <FileText className="w-4 h-4 inline mr-1" />
                        ID uploaded
                      </p>
                    )}
                  </div>

                  {/* Benefits reminder */}
                  <div className="space-y-2 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    {t.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Review & Submit */}
              {step === 4 && (
                <div className="space-y-4">
                  <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Name</span>
                      <span className="font-medium">{formData.firstName} {formData.lastName}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Employment</span>
                      <span className="font-medium">{formData.employer || formData.employmentType}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Annual Income</span>
                      <span className="font-medium">${formData.annualIncome.toLocaleString()}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">{t.estimatedRefund}</span>
                      <span className="font-medium text-green-600">${formData.estimatedRefund.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="requestedAmount">
                      {t.requestedAmount}: ${formData.requestedAmount.toLocaleString()}
                    </Label>
                    <Slider
                      id="requestedAmount"
                      min={500}
                      max={Math.min(7000, formData.estimatedRefund * 0.8)}
                      step={100}
                      value={[formData.requestedAmount]}
                      onValueChange={([value]) => updateFormData('requestedAmount', value)}
                      className="py-4"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>$500</span>
                      <span className="font-medium text-primary">
                        {t.maxAdvance}: ${Math.min(7000, formData.estimatedRefund * 0.8).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="routingNumber">{t.routingNumber}</Label>
                      <Input
                        id="routingNumber"
                        value={formData.routingNumber}
                        onChange={(e) => updateFormData('routingNumber', e.target.value)}
                        placeholder="123456789"
                        required
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bankAccount">{t.bankAccount}</Label>
                      <Input
                        id="bankAccount"
                        value={formData.bankAccount}
                        onChange={(e) => updateFormData('bankAccount', e.target.value)}
                        placeholder="XXXX"
                        maxLength={4}
                        required
                        className="h-12"
                      />
                    </div>
                  </div>

                  {/* Final urgency message */}
                  <Alert className="bg-accent dark:bg-accent border-accent-foreground">
                    <TrendingUp className="h-4 w-4 text-accent-foreground" />
                    <AlertDescription className="font-medium">
                      <div className="space-y-1">
                        <p className="text-accent-foreground">
                          You'll receive ${formData.requestedAmount.toLocaleString()} in 10 minutes!
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Fee: $0 (limited time offer)
                        </p>
                      </div>
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-3">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(step - 1)}
                    className="flex-1"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    {t.back}
                  </Button>
                )}
                <Button
                  type="submit"
                  className="flex-1 h-12 bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      {t.processing}
                    </>
                  ) : (
                    <>
                      {step === 4 ? t.submit : t.continue}
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>

          <CardFooter>
            <div className="w-full flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4" />
                <span>Bank-level security</span>
              </div>
              <div className="flex items-center gap-1">
                <Lock className="w-4 h-4" />
                <span>SSL encrypted</span>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}