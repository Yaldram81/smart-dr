'use client'

import React, { useState } from 'react'
import { useTheme } from 'next-themes'
import { useAppStore, type ActiveSection } from '@/lib/store'
import { useHydrated } from '@/components/hooks/use-hydrated'
import { toast } from '@/hooks/use-toast'
import { NotificationBell } from '@/components/layout/notification-bell'
import { LanguageToggle } from '@/components/layout/language-toggle'
import { LoginDialog } from '@/components/layout/login-dialog'
import { RegisterDialog } from '@/components/layout/register-dialog'
import {
  Heart, Menu, Moon, Sun, LogOut,
  Stethoscope, TrendingUp, HeartPulse, Languages,
  User, UserCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  Popover, PopoverContent, PopoverTrigger
} from '@/components/ui/popover'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

export function Navbar() {
  const { activeSection, setActiveSection, user, logout } = useAppStore()
  const { theme, setTheme } = useTheme()
  const mounted = useHydrated()
  const [loginOpen, setLoginOpen] = useState(false)
  const [registerOpen, setRegisterOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)

  // Dashboard only shown when user is logged in
  const navItems: { key: ActiveSection; label: string; icon: React.ReactNode }[] = [
    { key: 'home', label: 'Home', icon: <Heart className="size-4" /> },
    { key: 'checker', label: 'Symptom Checker', icon: <Stethoscope className="size-4" /> },
    ...(user ? [{ key: 'dashboard' as ActiveSection, label: 'Dashboard', icon: <TrendingUp className="size-4" /> }] : []),
  ]

  const handleNavClick = (key: ActiveSection) => {
    setActiveSection(key)
    setMobileMenuOpen(false)
  }

  const handleLogout = () => {
    logout()
    toast({ title: 'Logged out', description: 'You have been logged out successfully.' })
    // Navigate away from dashboard if on it
    if (activeSection === 'dashboard') {
      setActiveSection('home')
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => handleNavClick('home')}>
          <div className="flex items-center justify-center size-9 rounded-xl bg-primary text-primary-foreground">
            <HeartPulse className="size-5" />
          </div>
          <span className="text-lg font-bold tracking-tight block">
            Smart<span className="text-primary">.Dr</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Button
              key={item.key}
              variant={activeSection === item.key ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleNavClick(item.key)}
              className="gap-2"
            >
              {item.icon}
              {item.label}
            </Button>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Theme toggle - visible on all screen sizes */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="size-9"
            >
              {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
          )}

          {/* Language Toggle with Globe Icon */}
          <Popover open={langOpen} onOpenChange={setLangOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="size-9">
                <Languages className="size-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" align="end">
              <LanguageToggle />
            </PopoverContent>
          </Popover>

          {/* Notification Bell - visible on all screen sizes */}
          <NotificationBell />

          {user ? (
            <div className="hidden md:flex items-center gap-2">
              <Avatar className="size-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium max-w-[120px] truncate">{user.name}</span>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-1 text-muted-foreground">
                <LogOut className="size-4" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm">Login</Button>
                </DialogTrigger>
                <LoginDialog onClose={() => setLoginOpen(false)} onSwitchToRegister={() => { setLoginOpen(false); setRegisterOpen(true) }} />
              </Dialog>
              <Dialog open={registerOpen} onOpenChange={setRegisterOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-primary text-primary-foreground">Register</Button>
                </DialogTrigger>
                <RegisterDialog onClose={() => setRegisterOpen(false)} onSwitchToLogin={() => { setRegisterOpen(false); setLoginOpen(true) }} />
              </Dialog>
            </div>
          )}

          {/* Mobile: Symptom Checker Quick Access Icon */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeSection === 'checker' ? 'default' : 'ghost'}
                  size="icon"
                  className="md:hidden size-9"
                  onClick={() => handleNavClick('checker')}
                >
                  <Stethoscope className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Symptom Checker</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Mobile: Profile Dropdown (logged in) OR Hamburger Menu (logged out) */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden size-9">
                  <Avatar className="size-7">
                    <AvatarFallback className="bg-primary text-primary-foreground text-[10px]">
                      {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleNavClick('home')} className="cursor-pointer">
                  <UserCircle className="size-4" />
                  My Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNavClick('dashboard')} className="cursor-pointer">
                  <TrendingUp className="size-4" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNavClick('checker')} className="cursor-pointer">
                  <Stethoscope className="size-4" />
                  Symptom Checker
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="size-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <SheetDescription className="sr-only">Navigation menu for Smart.Dr</SheetDescription>
                <div className="flex flex-col gap-4 mt-8">
                  {navItems.map((item) => (
                    <Button
                      key={item.key}
                      variant={activeSection === item.key ? 'default' : 'ghost'}
                      className="justify-start gap-3"
                      onClick={() => handleNavClick(item.key)}
                    >
                      {item.icon}
                      {item.label}
                    </Button>
                  ))}
                  <Separator />
                  <div className="px-4">
                    <LanguageToggle />
                  </div>
                  <Separator />
                  <div className="flex flex-col gap-2 px-4">
                    <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">Login</Button>
                      </DialogTrigger>
                      <LoginDialog onClose={() => { setLoginOpen(false); setMobileMenuOpen(false) }} onSwitchToRegister={() => { setLoginOpen(false); setRegisterOpen(true) }} />
                    </Dialog>
                    <Dialog open={registerOpen} onOpenChange={setRegisterOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full bg-primary text-primary-foreground">Register</Button>
                      </DialogTrigger>
                      <RegisterDialog onClose={() => { setRegisterOpen(false); setMobileMenuOpen(false) }} onSwitchToLogin={() => { setRegisterOpen(false); setLoginOpen(true) }} />
                    </Dialog>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  )
}
