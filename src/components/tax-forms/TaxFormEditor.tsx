'use client';

/**
 * Tax Form Editor Component
 *
 * Interactive PDF form viewer and editor
 * Allows clients and tax preparers to fill out tax forms collaboratively
 * Features PDF preview, form fields, auto-save, and edit history
 */

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { EditHistoryDialog } from '@/components/tax-forms/EditHistoryDialog';
import {
  Save,
  Download,
  FileText,
  Loader2,
  CheckCircle2,
  Clock,
  History,
  AlertCircle,
  User,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';
import { cn } from '@/lib/utils';

interface PDFFormField {
  name: string;
  type: 'text' | 'checkbox' | 'radio' | 'dropdown';
  value?: string | boolean;
  options?: string[];
  required?: boolean;
  readOnly?: boolean;
  maxLength?: number;
  multiline?: boolean;
}

interface TaxFormEditorProps {
  assignmentId: string;
  formId: string;
  formNumber: string;
  formTitle: string;
  initialFormData?: Record<string, string | boolean>;
  status: 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'REVIEWED';
  isReadOnly?: boolean;
  onSave?: (formData: Record<string, string | boolean>) => void;
  onComplete?: () => void;
}

export function TaxFormEditor({
  assignmentId,
  formId,
  formNumber,
  formTitle,
  initialFormData = {},
  status,
  isReadOnly = false,
  onSave,
  onComplete,
}: TaxFormEditorProps) {
  const [formFields, setFormFields] = useState<PDFFormField[]>([]);
  const [formData, setFormData] = useState<Record<string, string | boolean>>(initialFormData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [progress, setProgress] = useState(0);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const { toast } = useToast();

  // Load form fields from PDF
  useEffect(() => {
    fetchFormFields();
  }, [formId]);

  // Calculate progress whenever form data changes
  useEffect(() => {
    calculateProgress();
  }, [formData, formFields]);

  // Auto-save functionality
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const timer = setTimeout(() => {
      handleSave(true); // Auto-save
    }, 3000); // Save 3 seconds after last change

    return () => clearTimeout(timer);
  }, [formData, hasUnsavedChanges]);

  const fetchFormFields = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/tax-forms/${formId}/parse`);

      if (response.ok) {
        const data = await response.json();

        if (!data.hasFormFields) {
          toast({
            title: 'No Fillable Fields',
            description: 'This PDF does not contain fillable form fields. You can download and fill it manually.',
            variant: 'destructive',
          });
          return;
        }

        setFormFields(data.fields);
        logger.info('Form fields loaded', { fieldCount: data.fields.length });
      } else {
        throw new Error('Failed to load form fields');
      }
    } catch (error) {
      logger.error('Error loading form fields', { error });
      toast({
        title: 'Error',
        description: 'Failed to load form fields',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = () => {
    const fillableFields = formFields.filter(f => !f.readOnly);

    if (fillableFields.length === 0) {
      setProgress(0);
      return;
    }

    const filledFields = fillableFields.filter(field => {
      const value = formData[field.name];

      if (value === undefined || value === null) return false;
      if (typeof value === 'boolean') return true;
      if (typeof value === 'string') return value.trim().length > 0;

      return false;
    });

    const percentage = Math.round((filledFields.length / fillableFields.length) * 100);
    setProgress(percentage);
  };

  const handleFieldChange = (fieldName: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value,
    }));
    setHasUnsavedChanges(true);
  };

  const handleSave = async (isAutoSave = false) => {
    try {
      setSaving(true);

      const response = await fetch(`/api/tax-forms/assigned/${assignmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formData,
          progress,
        }),
      });

      if (response.ok) {
        setLastSaved(new Date());
        setHasUnsavedChanges(false);

        if (!isAutoSave) {
          toast({
            title: 'Saved',
            description: 'Your changes have been saved successfully',
          });
        }

        onSave?.(formData);
      } else {
        throw new Error('Failed to save changes');
      }
    } catch (error) {
      logger.error('Error saving form', { error });
      toast({
        title: 'Error',
        description: 'Failed to save your changes',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleMarkComplete = async () => {
    try {
      setSaving(true);

      const response = await fetch(`/api/tax-forms/assigned/${assignmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formData,
          status: 'COMPLETED',
        }),
      });

      if (response.ok) {
        toast({
          title: 'Form Completed',
          description: 'Your form has been marked as complete and submitted to your tax preparer',
        });

        onComplete?.();
      } else {
        throw new Error('Failed to complete form');
      }
    } catch (error) {
      logger.error('Error completing form', { error });
      toast({
        title: 'Error',
        description: 'Failed to complete form',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadFilledPDF = async () => {
    toast({
      title: 'Generating PDF',
      description: 'Creating your filled PDF document...',
    });

    try {
      const response = await fetch(`/api/tax-forms/assigned/${assignmentId}/download`);

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${formNumber}_Filled.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        toast({
          title: 'Success',
          description: 'Filled PDF downloaded successfully',
        });
      } else {
        throw new Error('Failed to generate PDF');
      }
    } catch (error) {
      logger.error('Error downloading filled PDF', { error });
      toast({
        title: 'Error',
        description: 'Failed to generate filled PDF',
        variant: 'destructive',
      });
    }
  };

  const renderFormField = (field: PDFFormField) => {
    const value = formData[field.name];
    const disabled = isReadOnly || field.readOnly || status === 'REVIEWED';

    switch (field.type) {
      case 'text':
        if (field.multiline) {
          return (
            <Textarea
              id={field.name}
              value={(value as string) || ''}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              disabled={disabled}
              maxLength={field.maxLength}
              className="min-h-[100px]"
            />
          );
        }
        return (
          <Input
            id={field.name}
            type="text"
            value={(value as string) || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            disabled={disabled}
            maxLength={field.maxLength}
          />
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={field.name}
              checked={value === true}
              onCheckedChange={(checked) => handleFieldChange(field.name, checked === true)}
              disabled={disabled}
            />
            <Label htmlFor={field.name} className="text-sm font-normal cursor-pointer">
              {formatFieldName(field.name)}
            </Label>
          </div>
        );

      case 'dropdown':
        return (
          <Select
            value={(value as string) || ''}
            onValueChange={(newValue) => handleFieldChange(field.name, newValue)}
            disabled={disabled}
          >
            <SelectTrigger id={field.name}>
              <SelectValue placeholder="Select an option..." />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={`${field.name}_${option}`}
                  name={field.name}
                  value={option}
                  checked={value === option}
                  onChange={() => handleFieldChange(field.name, option)}
                  disabled={disabled}
                  className="h-4 w-4"
                />
                <Label
                  htmlFor={`${field.name}_${option}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {option}
                </Label>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">Loading form fields...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (formFields.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Fillable Fields</h3>
            <p className="text-sm text-muted-foreground mb-4">
              This PDF does not contain fillable form fields.
              <br />
              Please download the PDF and fill it out manually.
            </p>
            <Button onClick={() => window.open(`/api/tax-forms/${formId}/download`)}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {formNumber} - {formTitle}
              </CardTitle>
              <CardDescription className="mt-2">
                Fill out the form below. Changes are automatically saved.
              </CardDescription>
            </div>
            <div className="flex flex-col items-end gap-2">
              {lastSaved && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                  Saved {lastSaved.toLocaleTimeString()}
                </div>
              )}
              {saving && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Saving...
                </div>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Completion Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => handleSave(false)} disabled={saving || !hasUnsavedChanges}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
            {status !== 'COMPLETED' && status !== 'REVIEWED' && (
              <Button onClick={handleMarkComplete} variant="default" disabled={progress < 100}>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Mark as Complete
              </Button>
            )}
            <Button onClick={handleDownloadFilledPDF} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download Filled PDF
            </Button>
            <Button onClick={() => setHistoryDialogOpen(true)} variant="outline">
              <History className="h-4 w-4 mr-2" />
              View Edit History
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Edit History Dialog */}
      <EditHistoryDialog
        open={historyDialogOpen}
        onOpenChange={setHistoryDialogOpen}
        assignmentId={assignmentId}
        formNumber={formNumber}
      />

      {/* Form Fields */}
      <Card>
        <CardHeader>
          <CardTitle>Form Fields</CardTitle>
          <CardDescription>
            {formFields.filter(f => !f.readOnly).length} fillable fields
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {formFields.map((field, index) => {
              if (field.readOnly || field.type === 'checkbox') {
                return null; // Skip read-only fields and render checkboxes separately
              }

              return (
                <div key={field.name} className="space-y-2">
                  <Label htmlFor={field.name} className="flex items-center gap-2">
                    {formatFieldName(field.name)}
                    {field.required && <Badge variant="destructive">Required</Badge>}
                  </Label>
                  {renderFormField(field)}
                </div>
              );
            })}

            {/* Checkboxes Section */}
            {formFields.some(f => f.type === 'checkbox' && !f.readOnly) && (
              <>
                <Separator className="my-6" />
                <div className="space-y-4">
                  <h3 className="font-medium">Additional Options</h3>
                  {formFields
                    .filter(f => f.type === 'checkbox' && !f.readOnly)
                    .map(field => (
                      <div key={field.name}>{renderFormField(field)}</div>
                    ))}
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Format field names for display
 * Converts "firstName" to "First Name"
 */
function formatFieldName(name: string): string {
  return name
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
