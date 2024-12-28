import type { User } from '../payload-types'

export const isAdmin = (user?: User | null): boolean => {
  if (!user) return false
  return user?.roles.includes('admin')
}

export const isTeacher = (user?: User | null): boolean => {
  if (!user) return false
  return user?.roles.includes('teacher')
}

export const isStudent = (user?: User | null): boolean => {
  if (!user) return false
  return user?.roles.includes('student')
}

export const hasRole = (user?: User | null, role?: string): boolean => {
  if (!user || !role) return false
  return user.roles.includes(role)
}

export const isSameUser = (user?: User | null, id?: string): boolean => {
  if (!user || !id) return false
  return user.id.toString() === id
}
