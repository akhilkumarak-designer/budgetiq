'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format, isSameMonth, parse, startOfMonth } from "date-fns"
import { ArrowDownIcon, ArrowUpIcon, Bell, Building2, CalendarIcon, CreditCard, Download, Edit2, LogOut, MoreHorizontal, Plus, Search, Settings, ShoppingBag, Trash2, User, Wallet, ChevronRight, ChevronDown } from 'lucide-react'
import * as XLSX from 'xlsx'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

type Income = {
  id: string
  name: string
  amount: number
  color: string
}

type Expense = {
  id: string
  name: string
  description: string
  category: 'loans' | 'groceries' | 'creditCard' | 'lifestyle'
  amount: number
  date: Date
  incomeId: string
}

const incomeColors = [
  'bg-red-200 text-red-800',
  'bg-blue-200 text-blue-800',
  'bg-green-200 text-green-800',
  'bg-yellow-200 text-yellow-800',
  'bg-purple-200 text-purple-800',
  'bg-pink-200 text-pink-800',
  'bg-indigo-200 text-indigo-800',
  'bg-teal-200 text-teal-800',
]

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

function SummaryCards({ totalIncome, totalExpenses }) {
  const remainingAmount = totalIncome - totalExpenses

  return (
    <div className="space-y-4">
      <Card className="bg-[#0066FF] text-white">
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">$ {totalIncome.toFixed(2)}</div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-white/90">Income</div>
            <div className="flex items-center text-xs text-white/80">
              <ArrowDownIcon className="h-4 w-4 mr-1" />
              -2% than last month
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#FF3366] text-white">
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">$ {totalExpenses.toFixed(2)}</div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-white/90">Expense</div>
            <div className="flex items-center text-xs text-white/80">
              <ArrowUpIcon className="h-4 w-4 mr-1" />
              +0.5% than last month
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#00CC88] text-white">
        <CardContent className="pt-6">
          <div className="text-2xl font-bold">$ {remainingAmount.toFixed(2)}</div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-white/90">Remaining</div>
            <div className="flex items-center text-xs text-white/80">
              <ArrowUpIcon className="h-4 w-4 mr-1" />
              +1.5% than last month
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function Dashboard() {
  const [incomes, setIncomes] = useState<Income[]>([
    { id: 'income-1', name: 'Arun', amount: 80000, color: incomeColors[0] },
    { id: 'income-2', name: 'Akhil', amount: 70000, color: incomeColors[1] },
  ])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false)
  const [isAddIncomeOpen, setIsAddIncomeOpen] = useState(false)
  const [newExpense, setNewExpense] = useState<Expense>({
    id: '',
    name: '',
    description: '',
    category: 'loans',
    amount: 0,
    date: new Date(),
    incomeId: ''
  })
  const [newIncome, setNewIncome] = useState<Income>({
    id: '',
    name: '',
    amount: 0,
    color: ''
  })
  const [editingExpense, setEditingExpense] = useState<string | null>(null)
  const [selectedMonth, setSelectedMonth] = useState<Date>(startOfMonth(new Date()))

  useEffect(() => {
    // Initialize with some dummy expenses
    const initialExpenses = [
      {
        id: 'expense-1',
        name: 'Rent',
        description: 'Monthly rent',
        category: 'loans',
        amount: 15000,
        date: new Date(),
        incomeId: 'income-1'
      },
      {
        id: 'expense-2',
        name: 'Groceries',
        description: 'Weekly groceries',
        category: 'groceries',
        amount: 5000,
        date: new Date(),
        incomeId: 'income-2'
      },
    ] as Expense[]
    setExpenses(initialExpenses)
  }, [])

  const addIncome = (e: React.FormEvent) => {
    e.preventDefault()
    if (newIncome.name && newIncome.amount > 0) {
      const incomeWithId = { 
        ...newIncome, 
        id: `income-${Date.now()}`,
        color: incomeColors[incomes.length % incomeColors.length]
      }
      setIncomes([...incomes, incomeWithId])
      setNewIncome({ id: '', name: '', amount: 0, color: '' })
      setIsAddIncomeOpen(false)
    }
  }

  const addExpense = (e: React.FormEvent) => {
    e.preventDefault()
    if (newExpense.name && newExpense.amount > 0 && newExpense.incomeId) {
      const expenseWithId = { ...newExpense, id: `expense-${Date.now()}` }
      setExpenses([...expenses, expenseWithId])
      setNewExpense({
        id: '',
        name: '',
        description: '',
        category: 'loans',
        amount: 0,
        date: new Date(),
        incomeId: ''
      })
      setIsAddExpenseOpen(false)
    }
  }

  const editExpense = (expense: Expense) => {
    setEditingExpense(expense.id)
    setNewExpense(expense)
    setIsAddExpenseOpen(true)
  }

  const updateExpense = (e: React.FormEvent) => {
    e.preventDefault()
    setExpenses(expenses.map(expense => 
      expense.id === editingExpense ? newExpense : expense
    ))
    setEditingExpense(null)
    setIsAddExpenseOpen(false)
    setNewExpense({
      id: '',
      name: '',
      description: '',
      category: 'loans',
      amount: 0,
      date: new Date(),
      incomeId: ''
    })
  }

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(expense => expense.id !== id))
  }

  const handleExpenseChange = (field: string, value: string | number | Date) => {
    setNewExpense({ ...newExpense, [field]: value })
  }

  const handleIncomeChange = (field: string, value: string | number) => {
    setNewIncome({ ...newIncome, [field]: value })
  }

  const filteredExpenses = expenses.filter(expense => 
    (expense.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    expense.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
    isSameMonth(expense.date, selectedMonth)
  )

  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0)
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)

  const getIncomeStats = (incomeId: string) => {
    const incomeAmount = incomes.find(income => income.id === incomeId)?.amount || 0
    const spentAmount = filteredExpenses
      .filter(expense => expense.incomeId === incomeId)
      .reduce((sum, expense) => sum + expense.amount, 0)
    const remainingAmount = incomeAmount - spentAmount
    return { incomeAmount, spentAmount, remainingAmount }
  }

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(expenses)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Expenses")
    XLSX.writeFile(wb, "Expenses.xlsx")
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800">
        <div className="flex h-16 items-center px-4 gap-4">
          <div className="flex items-center text-white gap-2 font-semibold text-lg">
            <Wallet className="h-6 w-6" />
            Expense
          </div>
          <div className="flex-1 flex items-center">
            <div className="w-full md:w-[400px] relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search expenses..."
                className="w-full bg-slate-800 border-slate-700 pl-8 text-white placeholder:text-slate-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <Button size="icon" variant="ghost" className="text-slate-400">
            <Bell className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="ghost" className="text-slate-400">
            <Settings className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <img
                  src="/placeholder.svg?height=32&width=32"
                  alt="Avatar"
                  className="rounded-full object-cover"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 border-r border-slate-200 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
          <div className="p-4">
            <div className="space-y-4">
              <SummaryCards totalIncome={totalIncome} totalExpenses={totalExpenses} />
              
              <div className="space-y-2">
                {incomes.map((income) => {
                  const stats = getIncomeStats(income.id);
                  return (
                    <Collapsible key={income.id}>
                      <CollapsibleTrigger asChild>
                        <Button
                          style={{backgroundColor:'#371366'}}
                          className="w-full justify-start p-4 h-auto hover:bg-accent rounded-lg"
                        >
                          <div className="flex items-center w-full">
                            <div className="mr-3">
                              <Wallet style={{color:'#fff'}} className="h-5 w-5" />
                            </div>
                            <div className="flex-1 text-left">
                              <div className="font-medium" style={{color:'#fff'}}>{income.name}</div>
                              <div style={{color:'#fff'}} className="text-xs text-muted-foreground">
                                Income • ₹{income.amount.toFixed(2)}
                              </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform ui-expanded:rotate-90" />
                          </div>
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent style={{backgroundColor:'#f1e6ff', border:'1px solid #b6a0d3 ' }} className="px-4 py-2 mt-2 rounded-lg">
                        <div  className="space-y-2 text-sm">
                          <div style={{backgroundColor:'#dbc9f1' }} className="flex justify-between p-2 rounded-md">
                            <span>Income:</span>
                            <span className="font-semibold">₹{stats.incomeAmount.toFixed(2)}</span>
                          </div>
                          <div style={{backgroundColor:'#dbc9f1' }} className="flex justify-between p-2 rounded-md">
                            <span>Spent:</span>
                            <span className="font-semibold">₹{stats.spentAmount.toFixed(2)}</span>
                          </div>
                          <div style={{backgroundColor:'#dbc9f1' }} className="flex justify-between p-2 rounded-md">
                            <span>Remaining:</span>
                            <span className="font-semibold">₹{stats.remainingAmount.toFixed(2)}</span>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Expenses</h1>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(selectedMonth, "MMMM yyyy")}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {months.map((month,) => (
                    <DropdownMenuItem 
                      key={month} 
                      onSelect={() => setSelectedMonth(parse(month, 'MMMM', new Date()))}
                    >
                      {month}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Dialog open={isAddIncomeOpen} onOpenChange={setIsAddIncomeOpen}>
                <DialogTrigger asChild>
                  <Button>
                  <Plus className="h-4 w-4 mr-2" />Add Income Source</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Income Source</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={addIncome} className="space-y-4">
                    <div>
                      <Label htmlFor="income-name">Income Name</Label>
                      <Input
                        id="income-name"
                        value={newIncome.name}
                        onChange={(e) => handleIncomeChange('name', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="income-amount">Amount (INR)</Label>
                      <Input
                        id="income-amount"
                        type="number"
                        value={newIncome.amount}
                        onChange={(e) => handleIncomeChange('amount', parseFloat(e.target.value))}
                        required
                      />
                    </div>
                    <Button type="submit">Add Income</Button>
                  </form>
                </DialogContent>
              </Dialog>
              <Button onClick={exportToExcel} className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all" className="mb-6">
            <TabsList>
              <TabsTrigger value="all">All Expenses</TabsTrigger>
              <TabsTrigger value="loans">
                <Building2 className="h-4 w-4 mr-2" />
                Loans
              </TabsTrigger>
              <TabsTrigger value="groceries">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Groceries
              </TabsTrigger>
              <TabsTrigger value="creditCard">
                <CreditCard className="h-4 w-4 mr-2" />
                Credit Card
              </TabsTrigger>
              <TabsTrigger value="lifestyle">
                <Wallet className="h-4 w-4 mr-2" />
                Lifestyle
              </TabsTrigger>
            </TabsList>

            {['all', 'loans', 'groceries', 'creditCard', 'lifestyle'].map((tab) => (
              <TabsContent key={tab} value={tab}>
                <div className="grid gap-4">
                  {filteredExpenses
                    .filter(expense => tab === 'all' || expense.category === tab)
                    .map((expense) => (
                      <Card key={expense.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold">{expense.name}</span>
                                  <Badge className={incomes.find(income => income.id === expense.incomeId)?.color}>
                                    {incomes.find(income => income.id === expense.incomeId)?.name || 'Unknown'}
                                  </Badge>
                                </div>
                                <span className="text-sm text-slate-500">{expense.description}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <div className="font-semibold">₹{expense.amount.toFixed(2)}</div>
                                <div className="text-sm text-slate-500">{format(expense.date, 'dd MMM yyyy')}</div>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => editExpense(expense)}>
                                    <Edit2 className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => deleteExpense(expense.id)} className="text-red-600">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </main>
      </div>

      {/* Add/Edit Expense Dialog */}
      <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
        <DialogTrigger asChild>
          <Button
            className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg"
            size="icon"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingExpense ? 'Edit Expense' : 'Add New Expense'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={editingExpense ? updateExpense : addExpense} className="space-y-4">
            <div>
              <Label htmlFor="expense-name">Expense Name</Label>
              <Input
                id="expense-name"
                value={newExpense.name}
                onChange={(e) => handleExpenseChange('name', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="expense-description">Description</Label>
              <Input
                id="expense-description"
                value={newExpense.description}
                onChange={(e) => handleExpenseChange('description', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="expense-category">Category</Label>
              <Select
                value={newExpense.category}
                onValueChange={(value) => handleExpenseChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="loans">Loans</SelectItem>
                  <SelectItem value="groceries">Groceries</SelectItem>
                  <SelectItem value="creditCard">Credit Card</SelectItem>
                  <SelectItem value="lifestyle">Lifestyle</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="expense-amount">Amount (INR)</Label>
              <Input
                id="expense-amount"
                type="number"
                value={newExpense.amount}
                onChange={(e) => handleExpenseChange('amount', parseFloat(e.target.value))}
                required
              />
            </div>
            <div>
              <Label htmlFor="expense-date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={`w-full justify-start text-left font-normal ${!newExpense.date && "text-muted-foreground"}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newExpense.date ? format(newExpense.date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={newExpense.date}
                    onSelect={(date) => handleExpenseChange('date', date || new Date())}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="expense-income">Income Source</Label>
              <Select
                value={newExpense.incomeId}
                onValueChange={(value) => handleExpenseChange('incomeId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select income source" />
                </SelectTrigger>
                <SelectContent>
                  {incomes.map((income) => (
                    <SelectItem key={income.id} value={income.id}>{income.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit">{editingExpense ? 'Update Expense' : 'Add Expense'}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}