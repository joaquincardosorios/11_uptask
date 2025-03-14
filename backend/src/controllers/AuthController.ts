import type {Request, Response} from 'express'

import { handleError } from '../utils/errors'
import User from '../models/User'
import { hashPassword } from '../utils/auth'
import Token from '../models/Token'
import { generateToken } from '../utils/token'
import { AuthEmail } from '../emails/AuthEmail'
import { generateJWT } from '../utils/jwt'

export class AuthController {
    static createAccount = async (req : Request ,res: Response)  => {
        try {
            const { password } = req.body
    
            // Create a user
            const user = new User(req.body)

            // Hash password
            user.password = await hashPassword(password)

            // Generate token
            const token = new Token()
            token.token = generateToken()
            token.user = user.id

            // Send email
            await AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })
            
            //Save new user
            await Promise.allSettled([user.save(), token.save()])
            res.send('Account succesfully created, confirm your email to login')

        } catch (error) {
            handleError(res, error, "Failed to create the account")
        }
        
    }

    static confirmAccount = async (req : Request ,res: Response)  => {
        try {

            const { token } = req

            // Confirm user
            const user = await User.findById(token.user)
            user.confirmed = true

            await Promise.allSettled([user.save(), token.deleteOne()])

            res.send('Account confirmed, you can login now')
        } catch(error) {
            handleError(res, error, "Failed to confirm the account")
        }
    }

    static loginAccount = async (req : Request ,res: Response)  => {
        const { user } = req
        try{
            const token = generateJWT({id: user.id})
            res.send(token)
        } catch (error) {
            handleError(res, error, "Failed to create the account")
        }
    }

    static requestConfirmationCode = async (req : Request ,res: Response)  => {
        try {
            const { user } = req

            // Generate token
            const token = new Token()
            token.token = generateToken()
            token.user = user.id

            // Send email
            await AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })
            
            //Save new user
            await Promise.allSettled([user.save(), token.save()])
            res.send('A new code was sent to your email')

        } catch (error) {
            handleError(res, error, "Failed to create the account")
        }
        
    }

    static forgotPassword = async (req : Request ,res: Response)  => {
        try {
            const { user } = req

            // Generate token
            const token = new Token()
            token.token = generateToken()
            token.user = user.id
            //Save token
            await token.save()

            // Send email
            await AuthEmail.sendPasswordResetToken({
                email: user.email,
                name: user.name,
                token: token.token
            })
            
            res.send('A code was sent to your email to reset your password')

        } catch (error) {
            handleError(res, error, "Failed to create the account")
        }
        
    }

    static validateToken = async (req : Request ,res: Response)  => {
        try {
            res.send('Valid Token, enter your new password')
        } catch(error) {
            handleError(res, error, "Failed to confirm the account")
        }
    }

    static resetPasswordWithToken = async (req : Request ,res: Response)  => {
        try {
            const { token } = req
            const { password } = req.body

            const user = await User.findById(token.user)
            user.password = await hashPassword(password)

            await Promise.allSettled([user.save(), token.deleteOne()])

            res.send('Password change succesfully, you can login now')
        } catch(error) {
            handleError(res, error, "Failed to confirm the account")
        }
    }

    static user = async (req : Request ,res: Response)  => {
        res.json(req.user)
    }


    static updateProfile = async (req : Request ,res: Response)  => {
        const { name, email} = req.body
        const { user } = req

        user.name = name
        user.email = email
        
        try {
            await user.save()
            res.send('Profile updated succesfully')
        } catch (error) {
            handleError(res, error, "Failed to update profile")
        }
    }
    
    static updatePassword = async (req : Request ,res: Response)  => {
        
        const { new_password} = req.body
        const { user } = req
        
        try {
            user.password = await hashPassword(new_password)
            await user.save()
            res.send('Password updated succesfully')
        } catch (error) {
            handleError(res, error, "Failed to change password")
        }
    
    }

    static checkPassword = async (req : Request ,res: Response)  => {  
        res.send('Password is correct')
    }

}