// src/routes/admin/Users.tsx
'use client'

import { useEffect, useState } from 'react'
import { AdminService } from '@/services/admin.service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Search, Shield, User as UserIcon, Ban, CheckCircle } from 'lucide-react'
import type { UserInterface } from '@/types/user'

export default function AdminUsers() {
  const [users, setUsers] = useState<UserInterface[]>([])
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 })
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState<'active' | 'blocked' | ''>('')
  const [selected, setSelected] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const loadUsers = async () => {
    setLoading(true)
    const res = await AdminService.AdminUserService.getAll({
      search,
      role: roleFilter,
      status: statusFilter || undefined,
      page: pagination.page,
      limit: pagination.limit
    })
    if (res) {
      setUsers(res.users)
      setPagination(res.pagination)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadUsers()
  }, [search, roleFilter, statusFilter, pagination.page])

  const handleToggleBlock = async (id: string, isBlocked: boolean) => {
    await AdminService.AdminUserService.toggleBlock(id, isBlocked)
    loadUsers()
  }

  const handleBulkAction = async (isBlocked: boolean) => {
    if (!selected.length || !confirm(`${isBlocked ? 'Block' : 'Unblock'} ${selected.length} users?`)) return
    await AdminService.AdminUserService.bulkToggleBlock(selected, isBlocked)
    setSelected([])
    loadUsers()
  }

  const statusBadge = (isBlocked: boolean) => {
    return isBlocked ? (
      <Badge className="bg-red-100 text-red-700 flex items-center gap-1">
        <Ban className="h-3 w-3" /> Blocked
      </Badge>
    ) : (
      <Badge className="bg-green-100 text-green-700 flex items-center gap-1">
        <CheckCircle className="h-3 w-3" /> Active
      </Badge>
    )
  }

  const roleBadge = (role: string) => {
    return role === 'admin' ? (
      <Badge className="bg-purple-100 text-purple-700 flex items-center gap-1">
        <Shield className="h-3 w-3" /> Admin
      </Badge>
    ) : (
      <Badge variant="secondary" className="flex items-center gap-1">
        <UserIcon className="h-3 w-3" /> User
      </Badge>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          User Management
        </h1>
        <p className="text-muted-foreground">Block or unblock users</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={roleFilter || 'all'}
          onValueChange={value => setRoleFilter(value === 'all' ? '' : value)}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem> {/* ✅ fixed */}
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={statusFilter || 'all'}
          onValueChange={value => setStatusFilter(value === 'all' ? '' : value as 'active' | 'blocked' | '')}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem> {/* ✅ fixed */}
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="blocked">Blocked</SelectItem>
          </SelectContent>
        </Select>

        {selected.length > 0 && (
          <div className="flex gap-2">
            <Button variant="destructive" size="sm" onClick={() => handleBulkAction(true)}>
              <Ban className="h-4 w-4 mr-1" /> Block ({selected.length})
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleBulkAction(false)}>
              <CheckCircle className="h-4 w-4 mr-1" /> Unblock
            </Button>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-linear-to-r from-indigo-500 to-purple-500 p-6 rounded-lg text-white">
          <p className="text-sm opacity-90">Total Users</p>
          <p className="text-3xl font-bold">{pagination.total}</p>
        </div>
        <div className="bg-linear-to-r from-green-500 to-emerald-500 p-6 rounded-lg text-white">
          <p className="text-sm opacity-90">Active Users</p>
          <p className="text-3xl font-bold">
            {users.filter(u => !u.isBlocked).length}
          </p>
        </div>
        <div className="bg-linear-to-r from-red-500 to-rose-500 p-6 rounded-lg text-white">
          <p className="text-sm opacity-90">Blocked Users</p>
          <p className="text-3xl font-bold">
            {users.filter(u => u.isBlocked).length}
          </p>
        </div>
        <div className="bg-linear-to-r from-yellow-500 to-orange-500 p-6 rounded-lg text-white">
          <p className="text-sm opacity-90">Avg Score (Active)</p>
          <p className="text-3xl font-bold">
            {users.filter(u => !u.isBlocked && u.quizzesTaken > 0).length > 0
              ? Math.round(
                  users
                    .filter(u => !u.isBlocked && u.quizzesTaken > 0)
                    .reduce((s, u) => s + u.avgScore, 0) /
                  users.filter(u => !u.isBlocked && u.quizzesTaken > 0).length
                )
              : 0}%
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        {loading ? (
          <div className="p-8 text-center">Loading users...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selected.length === users.length && users.length > 0}
                    onCheckedChange={checked => {
                      if (checked) setSelected(users.map(u => u._id))
                      else setSelected([])
                    }}
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Quizzes Taken</TableHead>
                <TableHead>Avg Score</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(user => (
                <TableRow key={user._id}>
                  <TableCell>
                    <Checkbox
                      checked={selected.includes(user._id)}
                      onCheckedChange={checked => {
                        if (checked) setSelected([...selected, user._id])
                        else setSelected(selected.filter(id => id !== user._id))
                      }}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{roleBadge(user.role)}</TableCell>
                  <TableCell>{statusBadge(user.isBlocked)}</TableCell>
                  <TableCell>{user.quizzesTaken}</TableCell>
                  <TableCell>
                    <span className={`font-bold ${user.avgScore >= 80 ? 'text-green-600' : user.avgScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {user.avgScore}%
                    </span>
                  </TableCell>
                  <TableCell>{user.joined}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant={user.isBlocked ? 'outline' : 'destructive'}
                      onClick={() => handleToggleBlock(user._id, !user.isBlocked)}
                    >
                      {user.isBlocked ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-1" /> Unblock
                        </>
                      ) : (
                        <>
                          <Ban className="h-4 w-4 mr-1" /> Block
                        </>
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
          {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page === 1}
            onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page * pagination.limit >= pagination.total}
            onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}