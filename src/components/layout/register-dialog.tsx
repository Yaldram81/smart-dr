'use client'

import React, { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { toast } from '@/hooks/use-toast'
import { Sparkles, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function RegisterDialog({ onClose, onSwitchToLogin }: { onClose: () => void; onSwitchToLogin: () => void }) {
  const { setUser } = useAppStore()
  const [form, setForm] = useState({ name: '', email: '', password: '', age: '', gender: '', bloodGroup: '' })
  const [loading, setLoading] = useState(false)

  const updateForm = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) {
      toast({ title: 'Error', description: 'Please fill in required fields', variant: 'destructive' })
      return
    }
    if (form.password.length < 6) {
      toast({ title: 'Error', description: 'Password must be at least 6 characters', variant: 'destructive' })
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          age: form.age || undefined,
          gender: form.gender || undefined,
          bloodGroup: form.bloodGroup || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast({ title: 'Registration Failed', description: data.error || 'Something went wrong', variant: 'destructive' })
        return
      }
      setUser(data)
      localStorage.setItem('medpredict_user', JSON.stringify(data))
      toast({ title: 'Account created!', description: `Welcome, ${data.name}!` })
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
          <Sparkles className="size-5 text-primary" />
          Create Account
        </DialogTitle>
        <DialogDescription>Join Smart.Dr for personalized health insights</DialogDescription>
      </DialogHeader>
      <form onSubmit={handleRegister} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="reg-name">Full Name *</Label>
          <Input id="reg-name" placeholder="John Doe" value={form.name} onChange={(e) => updateForm('name', e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="reg-email">Email *</Label>
          <Input id="reg-email" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => updateForm('email', e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="reg-password">Password *</Label>
          <Input id="reg-password" type="password" placeholder="At least 6 characters" value={form.password} onChange={(e) => updateForm('password', e.target.value)} required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="reg-age">Age</Label>
            <Input id="reg-age" type="number" placeholder="25" value={form.age} onChange={(e) => updateForm('age', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reg-gender">Gender</Label>
            <Select value={form.gender} onValueChange={(v) => updateForm('gender', v)}>
              <SelectTrigger id="reg-gender"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="reg-blood">Blood Group</Label>
          <Select value={form.bloodGroup} onValueChange={(v) => updateForm('bloodGroup', v)}>
            <SelectTrigger id="reg-blood"><SelectValue placeholder="Select blood group" /></SelectTrigger>
            <SelectContent>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                <SelectItem key={bg} value={bg}>{bg}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" className="w-full bg-primary text-primary-foreground" disabled={loading}>
          {loading ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
          {loading ? 'Creating account...' : 'Create Account'}
        </Button>
        <p className="text-sm text-center text-muted-foreground">
          Already have an account?{' '}
          <button type="button" className="text-primary underline-offset-4 hover:underline font-medium" onClick={onSwitchToLogin}>
            Sign in
          </button>
        </p>
      </form>
    </DialogContent>
  )
}
