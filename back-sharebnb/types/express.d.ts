import { Request } from 'express'

// User type based on what's stored in the token (from auth.service.js getLoginToken)
export interface LoggedInUser {
  _id: string
  fullname: string
  isAdmin?: boolean
  email?: string | null
  imgUrl?: string | null
}

// Extend Express Request to include loggedinUser
export interface AuthenticatedRequest extends Request {
  loggedinUser?: LoggedInUser
}
