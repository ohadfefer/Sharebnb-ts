import { Request } from 'express'
import { LoggedInUser } from './user.js'



// Extend Express Request to include loggedinUser
export interface AuthenticatedRequest extends Request {
  loggedinUser?: LoggedInUser
}
