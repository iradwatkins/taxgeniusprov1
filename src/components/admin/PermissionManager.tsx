'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  PERMISSION_LABELS,
  SECTION_NAMES,
  SECTION_PERMISSIONS,
  type SectionPermission,
  type Permission,
  type UserPermissions,
} from '@/lib/permissions';
import { Layers, Key, Save, ToggleLeft, AlertCircle, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

interface PermissionManagerProps {
  defaultPermissions: Partial<UserPermissions>;
  targetUserId?: string;
  targetRole?: string;
}

export function PermissionManager({
  defaultPermissions,
  targetUserId,
  targetRole = 'admin',
}: PermissionManagerProps) {
  const [permissions, setPermissions] = useState<Partial<UserPermissions>>(defaultPermissions);
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  const sections = Object.keys(SECTION_NAMES) as SectionPermission[];

  // Check if all permissions in a section are enabled
  const isSectionEnabled = useCallback(
    (section: SectionPermission) => {
      const sectionPerms = SECTION_PERMISSIONS[section];
      return sectionPerms.every((p) => permissions[p] === true);
    },
    [permissions]
  );

  // Check if some (but not all) permissions in a section are enabled
  const isSectionPartial = useCallback(
    (section: SectionPermission) => {
      const sectionPerms = SECTION_PERMISSIONS[section];
      const enabledCount = sectionPerms.filter((p) => permissions[p] === true).length;
      return enabledCount > 0 && enabledCount < sectionPerms.length;
    },
    [permissions]
  );

  // Toggle entire section
  const toggleSection = useCallback(
    (section: SectionPermission, enabled: boolean) => {
      const sectionPerms = SECTION_PERMISSIONS[section];
      const newPermissions = { ...permissions };

      sectionPerms.forEach((perm) => {
        newPermissions[perm] = enabled;
      });

      setPermissions(newPermissions);
      setHasChanges(true);
    },
    [permissions]
  );

  // Toggle individual permission
  const togglePermission = useCallback((permission: Permission, enabled: boolean) => {
    setPermissions((prev) => ({
      ...prev,
      [permission]: enabled,
    }));
    setHasChanges(true);
  }, []);

  // Save permissions
  const savePermissions = async () => {
    if (!targetUserId) {
      // If no specific user, this is for setting default admin permissions
      toast({
        title: 'Saving Default Permissions',
        description: 'Updating default permissions for all admin users...',
      });
    }

    setLoading(true);

    try {
      const response = await fetch('/api/admin/update-permissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: targetUserId || 'default',
          role: targetRole,
          permissions: permissions,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update permissions');
      }

      toast({
        title: 'Success',
        description: 'Permissions have been updated successfully.',
        duration: 3000,
      });

      setHasChanges(false);
    } catch (error) {
      logger.error('Error saving permissions:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save permissions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        {sections.map((section) => {
          const sectionName = SECTION_NAMES[section];
          const sectionPermissions = SECTION_PERMISSIONS[section];
          const isEnabled = isSectionEnabled(section);
          const isPartial = isSectionPartial(section);

          return (
            <div key={section} className="border rounded-lg p-4">
              {/* Section Header with Master Toggle */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b">
                <div className="flex items-center gap-3">
                  <Layers className="w-5 h-5 text-primary" />
                  <div>
                    <h3 className="font-medium text-lg">{sectionName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {sectionPermissions.length} items in this section
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isPartial && (
                    <span className="text-xs text-amber-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Partial
                    </span>
                  )}
                  <span className="text-sm text-muted-foreground">Enable Section</span>
                  <Switch
                    checked={isEnabled}
                    onCheckedChange={(checked) => toggleSection(section, checked)}
                    className={cn(
                      'data-[state=checked]:bg-green-600',
                      isPartial && 'data-[state=unchecked]:bg-amber-200'
                    )}
                  />
                </div>
              </div>

              {/* Individual Permissions */}
              <div className="grid md:grid-cols-2 gap-3 mt-4">
                {sectionPermissions.map((permission) => (
                  <div
                    key={permission}
                    className="flex items-center justify-between p-2 rounded hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-2">
                      <Key className="w-3 h-3 text-muted-foreground" />
                      <span className="text-sm">
                        {PERMISSION_LABELS[permission as keyof typeof PERMISSION_LABELS]}
                      </span>
                    </div>
                    <Switch
                      checked={permissions[permission] === true}
                      onCheckedChange={(checked) => togglePermission(permission, checked)}
                      className="scale-90"
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-start gap-3">
          <ToggleLeft className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <p className="font-medium">Section Controls</p>
            <p className="text-sm text-muted-foreground mt-1">
              Toggle entire sections on/off to quickly manage admin access. Individual permissions
              can still be customized within each section.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {hasChanges && (
            <span className="flex items-center gap-2 text-amber-600">
              <AlertCircle className="w-4 h-4" />
              You have unsaved changes
            </span>
          )}
        </div>
        <Button
          onClick={savePermissions}
          disabled={!hasChanges || loading}
          className="min-w-[150px]"
        >
          {loading ? (
            <>Saving...</>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Permissions
            </>
          )}
        </Button>
      </div>

      {/* Visual feedback when saved */}
      {!hasChanges && !loading && (
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-800 dark:text-green-300">
              All permissions are saved and up to date
            </span>
          </div>
        </div>
      )}
    </>
  );
}

// Helper function for className
function cn(...classes: (string | false | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
