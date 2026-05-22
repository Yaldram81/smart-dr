'use client'

import React, { useState, useEffect } from 'react'
import { useAppStore, type HistoryPrediction } from '@/lib/store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { Clock, ClipboardList, History, User as UserIcon } from 'lucide-react'

export function PredictionHistoryPanel() {
  const { user, history, setHistory } = useAppStore()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) return
    const fetchHistory = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/history?userId=${user.id}&limit=20`)
        const data = await res.json()
        setHistory(data.predictions || [])
      } catch {
        // silently fail
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [user, setHistory])

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="size-5 text-primary" />
            Prediction History
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <UserIcon className="size-12 mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-sm text-muted-foreground">Login to view your prediction history</p>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="size-5 text-primary" />
            Prediction History
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-indigo-400">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="size-5 text-primary" />
          Prediction History
        </CardTitle>
        <CardDescription>Your recent predictions</CardDescription>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="text-center py-8">
            <ClipboardList className="size-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">No predictions yet. Start by checking your symptoms!</p>
          </div>
        ) : (
          <ScrollArea className="max-h-96 custom-scrollbar">
            <div className="space-y-3">
              {history.map((pred: HistoryPrediction) => (
                <div key={pred.id} className="p-3 rounded-lg border hover:bg-muted/50 transition-colors border-l-4 border-l-primary/30">
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-medium text-sm">
                      {pred.results?.[0]?.disease || 'Unknown'}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="size-3" />
                      {new Date(pred.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {(Array.isArray(pred.selectedSymptoms) ? pred.selectedSymptoms : []).slice(0, 5).map((sym: string, j: number) => (
                      <Badge key={j} variant="secondary" className="text-xs">{sym}</Badge>
                    ))}
                    {(Array.isArray(pred.selectedSymptoms) ? pred.selectedSymptoms : []).length > 5 && (
                      <Badge variant="secondary" className="text-xs">
                        +{(pred.selectedSymptoms as string[]).length - 5} more
                      </Badge>
                    )}
                  </div>
                  {pred.results?.[0] && (
                    <div className="flex items-center gap-2">
                      <Progress value={pred.results[0].confidence} className="flex-1 h-1.5" />
                      <span className="text-xs font-medium">{pred.results[0].confidence}%</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
