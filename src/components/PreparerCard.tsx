'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Building2, Award, Sparkles } from 'lucide-react';

interface PreparerCardProps {
  preparer: {
    firstName: string;
    lastName: string;
    avatarUrl?: string | null;
    companyName?: string | null;
    licenseNo?: string | null;
    bio?: string | null;
  };
}

export function PreparerCard({ preparer }: PreparerCardProps) {
  const initials = `${preparer.firstName[0]}${preparer.lastName[0]}`.toUpperCase();
  const fullName = `${preparer.firstName} ${preparer.lastName}`;

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <Avatar className="w-20 h-20 border-2 border-primary/30">
            <AvatarImage src={preparer.avatarUrl || undefined} alt={fullName} />
            <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>

          {/* Info */}
          <div className="flex-1 space-y-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-primary" />
                <p className="text-sm text-muted-foreground">Your Tax Professional</p>
              </div>
              <h3 className="text-xl font-bold text-foreground">{fullName}</h3>
            </div>

            {/* Company Name */}
            {preparer.companyName && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="w-4 h-4" />
                <span>{preparer.companyName}</span>
              </div>
            )}

            {/* License Badge */}
            {preparer.licenseNo && (
              <Badge variant="secondary" className="text-xs">
                <Award className="w-3 h-3 mr-1" />
                License: {preparer.licenseNo}
              </Badge>
            )}

            {/* Bio */}
            {preparer.bio && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{preparer.bio}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
