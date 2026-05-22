'use client'

import React from 'react'
import { useAppStore } from '@/lib/store'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Clock, Mail } from 'lucide-react'

export function UserProfileCard() {
  const { user } = useAppStore()

  if (!user) return null

  return (
    <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-primary">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Avatar className="size-14 border-2 border-primary/20">
            <AvatarFallback className="bg-primary text-primary-foreground text-lg font-bold">
              {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">{user.name}</h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1 truncate">
              <Mail className="size-3" />
              {user.email}
            </p>
            <div className="flex items-center gap-3 mt-1">
              {user.age && (
                <Badge variant="outline" className="text-xs">{user.age} yrs</Badge>
              )}
              {user.gender && (
                <Badge variant="outline" className="text-xs capitalize">{user.gender}</Badge>
              )}
              {user.bloodGroup && (
                <Badge variant="outline" className="text-xs text-red-600 dark:text-red-400">{user.bloodGroup}</Badge>
              )}
            </div>
          </div>
          <Badge variant="secondary" className="text-xs shrink-0">
            <Clock className="size-3 mr-1" />
            Member
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
