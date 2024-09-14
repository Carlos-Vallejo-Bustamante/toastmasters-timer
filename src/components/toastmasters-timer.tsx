'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Play, Pause, RotateCcw, Sun, Moon, Award, FileText, Check, X } from "lucide-react"
import { useTheme } from "next-themes"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  // FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { toast } from '@/hooks/use-toast';
import Footer from './footer'

type Role = {
  role: string;
  name?: string;
  timeLimit: number;
  minTime: number;
  maxTime: number;
}

const toastmastersRoles: Role[] = [
  { role: "Toastmaster", timeLimit: 180, minTime: 120, maxTime: 240 },
  { role: "Speaker 1", timeLimit: 300, minTime: 240, maxTime: 360 },
  { role: "Speaker 2", timeLimit: 300, minTime: 240, maxTime: 360 },
  { role: "Speaker 3", timeLimit: 300, minTime: 240, maxTime: 360 },
  { role: "Table Topics Master", timeLimit: 90, minTime: 60, maxTime: 120 },
  { role: "Table Topics 1", timeLimit: 150, minTime: 120, maxTime: 180 },
  { role: "Table Topics 2", timeLimit: 150, minTime: 120, maxTime: 180 },
  { role: "Table Topics 3", timeLimit: 150, minTime: 120, maxTime: 180 },
  { role: "Table Topics Evaluator", timeLimit: 150, minTime: 120, maxTime: 180 },
  { role: "Evaluator 1", timeLimit: 120, minTime: 60, maxTime: 180 },
  { role: "Evaluator 2", timeLimit: 120, minTime: 60, maxTime: 180 },
  { role: "Evaluator 3", timeLimit: 120, minTime: 60, maxTime: 180 },
  { role: "Timer", timeLimit: 90, minTime: 60, maxTime: 120 },
  { role: "Grammarian", timeLimit: 90, minTime: 60, maxTime: 120 },
  { role: "General Evaluator", timeLimit: 360, minTime: 300, maxTime: 420 },
]

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

function RoleTimer({ role, onTimeUpdate }: { role: Role; onTimeUpdate: (name: string, time: number) => void }) {
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [colorClass, setColorClass] = useState('bg-gray-500')
  const [showColorModal, setShowColorModal] = useState(false)
  const [showAwardModal, setShowAwardModal] = useState(false)
  const [showResetConfirmation, setShowResetConfirmation] = useState(false)

  const getColorClass = useCallback(() => {
    if (time < role.minTime) return 'bg-gray-500'
    if (time < role.timeLimit) return 'bg-green-500'
    if (time < role.maxTime) return 'bg-yellow-500'
    return 'bg-red-500'
  }, [time, role])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime + 1
          onTimeUpdate(role.role, newTime)
          return newTime
        })
      }, 1000)
    } else if (interval) {
      clearInterval(interval)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, role.role, onTimeUpdate])

  useEffect(() => {
    const newColorClass = getColorClass()
    if (newColorClass !== colorClass) {
      setColorClass(newColorClass)
      setShowColorModal(true)
      setTimeout(() => setShowColorModal(false), 2000)

      if (newColorClass === 'bg-red-500') {
        setTimeout(() => {
          setShowAwardModal(true)
          setTimeout(() => setShowAwardModal(false), 2000)
        }, 30000)
      }
    }
  }, [time, getColorClass, colorClass])

  const toggleTimer = () => setIsRunning(!isRunning)
  
  const resetTimer = () => {
    setShowResetConfirmation(true)
  }

  const confirmReset = () => {
    setIsRunning(false)
    setTime(0)
    setColorClass('bg-gray-500')
    onTimeUpdate(role.role, 0)
    setShowResetConfirmation(false)
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <div className='flex justify-around'>
          <CardTitle className="text-lg font-semibold">{role.role}: </CardTitle>
          <InputForm {...role} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            <div className={`text-4xl font-bold text-white ${colorClass} p-4 rounded-md`}>
              {formatTime(time)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Mínimo: {formatTime(role.minTime)} | Máximo: {formatTime(role.maxTime)}
            </div>
            <div className="flex space-x-2">
              <Button onClick={toggleTimer} variant="outline" size="icon">
                {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button onClick={resetTimer} variant="outline" size="icon">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <Dialog open={showColorModal} onOpenChange={setShowColorModal}>
        <DialogContent className="sm:max-w-[425px]">
          <div className={`w-full h-32 ${colorClass}`}></div>
        </DialogContent>
      </Dialog>
      <Dialog open={showAwardModal} onOpenChange={setShowAwardModal}>
        <DialogContent className="sm:max-w-[425px]">
          <div className="flex items-center justify-center h-32">
            <Award className="h-16 w-16 text-yellow-500" />
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={showResetConfirmation} onOpenChange={setShowResetConfirmation}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
          <DialogHeader>
            <DialogTitle>Confirm restart</DialogTitle>
            <DialogDescription>
              Are you sure you want to reset the timer for {role.role}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResetConfirmation(false)} className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
              Cancel
            </Button>
            <Button onClick={confirmReset} className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

const FormSchema = z.object({
  username: z.string().min(2, {
    message: "The name must be at least 2 characters long.",
  }),
})

function InputForm(role: Role) {
  const [username, setUsername] = useState<string>("");

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
    },
  })
 
  function onSubmit(data: z.infer<typeof FormSchema>) {
    setUsername(data.username);    
    toastmastersRoles.filter((r) => r.role === role.role)[0].name = data.username;

   toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  if (!username) {
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input className='w-32' placeholder="Name..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className='ms-2' type="submit">Submit</Button>
        </form>
      </Form>
    )
    
  } else {
    return(
      <h3 className="text-xl font-semibold">{username}</h3>
    )
  }
 
}

export default function ToastmastersTimerApp() {
  const [mounted, setMounted] = useState(false)
  const [times, setTimes] = useState<{[key: string]: number}>({})
  const [showReport, setShowReport] = useState(false)
  // const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleTimeUpdate = (name: string, time: number) => {
    setTimes(prevTimes => ({...prevTimes, [name]: time}))
  }

  const generateReport = () => {
    setShowReport(true)
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Toastmasters Timer</h1>
          <div className="flex space-x-2">
            <Button 
              onClick={generateReport} 
              variant="outline"
              className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FileText className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
            <ThemeToggle />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {toastmastersRoles.map((role) => (
            <RoleTimer key={role.role} role={role} onTimeUpdate={handleTimeUpdate} />
          ))}
        </div>
      </div>
      <Dialog open={showReport} onOpenChange={setShowReport}>
        <DialogContent className="sm:max-w-[1400px] bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
          <DialogHeader>
            <DialogTitle>Time Report</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Summary of the times for each role
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200 dark:border-gray-700">
                  <TableHead className="text-gray-900 dark:text-white font-bold">Role</TableHead>
                  <TableHead className="text-gray-900 dark:text-white font-bold">Minimum Time</TableHead>
                  <TableHead className="text-gray-900 dark:text-white font-bold">Final Time</TableHead>
                  <TableHead className="text-gray-900 dark:text-white font-bold">State</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {toastmastersRoles.map((role) => (
                  <TableRow key={role.role} className="border-b border-gray-200 dark:border-gray-700">
                    <TableCell className="text-gray-900 dark:text-white">{role.role}: {role.name}</TableCell>
                    <TableCell className="text-gray-900 dark:text-white">{formatTime(role.minTime)}</TableCell>
                    <TableCell className="text-gray-900 dark:text-white">{formatTime(times[role.role] || 0)}</TableCell>
                    <TableCell>
                      {times[role.role] >= role.minTime ? (
                        <Check className="text-green-500 h-5 w-5" />
                      ) : (
                        <X className="text-red-500 h-5 w-5" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
      <Footer/>
    </div>
  )
}