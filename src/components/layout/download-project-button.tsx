'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from '@/hooks/use-toast'
import { Download, Loader2, AlertTriangle, CheckCircle2, FileText, Database } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'

export function DownloadProjectButton() {
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [downloadStage, setDownloadStage] = useState<'idle' | 'preparing' | 'zipping' | 'downloading' | 'complete' | 'error'>('idle')
  const [downloadInfo, setDownloadInfo] = useState<{ fileCount?: number; zipSize?: string; sourceSize?: string }>({})

  const handleDownload = async () => {
    setIsDownloading(true)
    setDownloadProgress(0)
    setDownloadStage('preparing')
    setDownloadInfo({})

    try {
      // Stage 1: Preparing
      await new Promise(r => setTimeout(r, 300))
      setDownloadProgress(10)
      setDownloadStage('zipping')

      // Stage 2: Fetch from API
      const res = await fetch('/api/download')
      if (!res.ok) throw new Error('Download failed')

      setDownloadProgress(40)

      // Stage 3: Read response with progress simulation
      setDownloadStage('downloading')
      const contentLength = res.headers.get('Content-Length')
      const fileCount = res.headers.get('X-File-Count')
      const sourceSize = res.headers.get('X-Source-Size')
      const zipSizeHeader = res.headers.get('X-Zip-Size')

      // Read the blob
      const blob = await res.blob()
      setDownloadProgress(70)

      // Simulate final processing
      await new Promise(r => setTimeout(r, 200))
      setDownloadProgress(85)

      // Stage 4: Create download
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const disposition = res.headers.get('Content-Disposition')
      const filename = disposition
        ? disposition.split('filename=')[1]?.replace(/"/g, '')
        : 'SmartDr-SourceCode.zip'
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setDownloadProgress(100)
      setDownloadStage('complete')
      setDownloadInfo({
        fileCount: fileCount ? parseInt(fileCount) : undefined,
        zipSize: zipSizeHeader ? formatBytes(parseInt(zipSizeHeader)) : `${(blob.size / 1024 / 1024).toFixed(1)} MB`,
        sourceSize: sourceSize ? formatBytes(parseInt(sourceSize)) : undefined,
      })

      toast({ title: 'Download complete!', description: 'Project source code has been downloaded successfully.' })

      // Auto-reset after 3 seconds
      setTimeout(() => {
        setDownloadStage('idle')
        setDownloadProgress(0)
        setIsDownloading(false)
      }, 3000)
    } catch {
      setDownloadStage('error')
      setDownloadProgress(0)
      toast({ title: 'Download failed', description: 'Could not generate project download. Please try again.', variant: 'destructive' })
      setTimeout(() => {
        setDownloadStage('idle')
        setDownloadProgress(0)
        setIsDownloading(false)
      }, 2000)
    }
  }

  function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  return (
    <Dialog open={downloadStage !== 'idle' && isDownloading} onOpenChange={(open) => {
      if (!open && downloadStage === 'complete') {
        setDownloadStage('idle')
        setDownloadProgress(0)
        setIsDownloading(false)
      }
    }}>
      <Button
        variant="outline"
        size="sm"
        className="gap-2 text-xs h-8 border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all group"
        disabled={isDownloading}
        onClick={handleDownload}
      >
        {isDownloading ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : (
          <Download className="size-3.5 group-hover:animate-bounce" />
        )}
        {isDownloading ? 'Downloading...' : 'Download Project'}
      </Button>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {downloadStage === 'error' ? (
              <><AlertTriangle className="size-5 text-red-500" /> Download Failed</>
            ) : downloadStage === 'complete' ? (
              <><CheckCircle2 className="size-5 text-emerald-500" /> Download Complete!</>
            ) : (
              <><Download className="size-5 text-primary animate-bounce" /> Downloading Project</>
            )}
          </DialogTitle>
          <DialogDescription>
            {downloadStage === 'preparing' && 'Preparing to package source code...'}
            {downloadStage === 'zipping' && 'Compressing project files into ZIP archive...'}
            {downloadStage === 'downloading' && 'Transferring archive to your browser...'}
            {downloadStage === 'complete' && 'Smart.Dr source code has been downloaded successfully.'}
            {downloadStage === 'error' && 'Something went wrong. Please try again.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                {downloadStage === 'preparing' && 'Preparing...'}
                {downloadStage === 'zipping' && 'Compressing files...'}
                {downloadStage === 'downloading' && 'Downloading...'}
                {downloadStage === 'complete' && 'Done!'}
                {downloadStage === 'error' && 'Failed'}
              </span>
              <span>{downloadProgress}%</span>
            </div>
            <Progress
              value={downloadProgress}
              className={`h-2 ${downloadStage === 'error' ? '[&>div]:bg-red-500' : downloadStage === 'complete' ? '[&>div]:bg-emerald-500' : ''}`}
            />
          </div>

          {/* Stage indicators */}
          <div className="grid grid-cols-4 gap-1">
            {(['preparing', 'zipping', 'downloading', 'complete'] as const).map((stage, i) => {
              const stageOrder = { preparing: 0, zipping: 1, downloading: 2, complete: 3 }
              const currentOrder = stageOrder[downloadStage] ?? -1
              const isDone = currentOrder > i || downloadStage === 'complete'
              const isActive = stageOrder[downloadStage] === i
              const isPending = currentOrder < i

              return (
                <div key={stage} className="flex flex-col items-center gap-1">
                  <div className={`size-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                    isDone ? 'bg-emerald-500 text-white' :
                    isActive ? 'bg-primary text-primary-foreground animate-pulse' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {isDone ? <CheckCircle2 className="size-3.5" /> : i + 1}
                  </div>
                  <span className={`text-[9px] capitalize ${isActive ? 'text-primary font-semibold' : isPending ? 'text-muted-foreground' : 'text-emerald-600'}`}>
                    {stage}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Download info */}
          {downloadStage === 'complete' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-3 space-y-1.5"
            >
              <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="size-3.5" />
                <span className="font-medium">Package ready!</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-500">
                {downloadInfo.fileCount && (
                  <div className="flex items-center gap-1.5">
                    <FileText className="size-3" />
                    {downloadInfo.fileCount} files
                  </div>
                )}
                {downloadInfo.zipSize && (
                  <div className="flex items-center gap-1.5">
                    <Database className="size-3" />
                    {downloadInfo.zipSize} (ZIP)
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* What's included */}
          {downloadStage !== 'complete' && downloadStage !== 'error' && (
            <div className="bg-muted/50 rounded-lg p-3 space-y-1.5">
              <p className="text-[11px] font-medium text-muted-foreground">Package includes:</p>
              <div className="grid grid-cols-2 gap-1 text-[10px] text-muted-foreground">
                <div className="flex items-center gap-1"><CheckCircle2 className="size-2.5 text-emerald-500" /> Source code</div>
                <div className="flex items-center gap-1"><CheckCircle2 className="size-2.5 text-emerald-500" /> Prisma schema</div>
                <div className="flex items-center gap-1"><CheckCircle2 className="size-2.5 text-emerald-500" /> UI components</div>
                <div className="flex items-center gap-1"><CheckCircle2 className="size-2.5 text-emerald-500" /> API routes</div>
                <div className="flex items-center gap-1"><CheckCircle2 className="size-2.5 text-emerald-500" /> README.txt</div>
                <div className="flex items-center gap-1"><CheckCircle2 className="size-2.5 text-emerald-500" /> Config files</div>
              </div>
              <p className="text-[10px] text-muted-foreground/70">Excludes: node_modules, .next, .git, logs, databases, env files</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant={downloadStage === 'error' ? 'destructive' : 'outline'}
            size="sm"
            onClick={() => {
              if (downloadStage === 'error') {
                handleDownload()
              } else {
                setDownloadStage('idle')
                setDownloadProgress(0)
                setIsDownloading(false)
              }
            }}
            className="text-xs"
          >
            {downloadStage === 'error' ? 'Retry Download' : 'Close'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
