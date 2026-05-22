'use client'

import React, { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { toast } from '@/hooks/use-toast'
import { HeartPulse, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function LoginDialog({ onClose, onSwitchToRegister }: { onClose: () => void; onSwitchToRegister: () => void }) {
  const { setUser } = useAppStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast({ title: 'Error', description: 'Please fill in all fields', variant: 'destructive' })
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast({ title: 'Login Failed', description: data.error || 'Invalid credentials', variant: 'destructive' })
        return
      }
      setUser(data)
      localStorage.setItem('medpredict_user', JSON.stringify(data))
      toast({ title: 'Welcome back!', description: `Logged in as ${data.name}` })
      onClose()
    } catch {
      toast({ title: 'Error', description: 'Something went wrong', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <HeartPulse className="size-5 text-primary" />
          Welcome Back
        </DialogTitle>
        <DialogDescription>Sign in to your Smart.Dr account</DialogDescription>
      </DialogHeader>
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="login-email">Email</Label>
          <Input id="login-email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="login-password">Password</Label>
          <Input id="login-password" type="password" placeholder="••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <Button type="submit" className="w-full bg-primary text-primary-foreground" disabled={loading}>
          {loading ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
        <p className="text-sm text-center text-muted-foreground">
          Don&apos;t have an account?{' '}
          <button type="button" className="text-primary underline-offset-4 hover:underline font-medium" onClick={onSwitchToRegister}>
            Register
          </button>
        </p>
      </form>
    </DialogContent>
  )
}
