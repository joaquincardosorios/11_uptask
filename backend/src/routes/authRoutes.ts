import { Router } from 'express'
import { body, param } from 'express-validator'
import { AuthController } from '../controllers/AuthController'
import { handleInputErrors, validateCreateAccount, validateEmailInput, validateLoginInput, validateResetPasswordInput, validateTokenInput } from '../middleware/validation'
import { tokenExist, checkUserNotConfirmed, userExist, validatePassword, checkUserConfirmed } from '../middleware/auth'

const router = Router()

// Create Account
router.post('/create-account',
    validateCreateAccount,
    handleInputErrors,
    AuthController.createAccount
)

// Confirm Account
router.post('/confirm-account',
    validateTokenInput,
    handleInputErrors,
    tokenExist,
    AuthController.confirmAccount
)

// Login Account
router.post('/login',
    validateLoginInput,
    handleInputErrors,
    userExist,
    checkUserNotConfirmed,
    validatePassword,
    AuthController.loginAccount
)

// Resend confirmation code
router.post('/request-code',
    validateEmailInput,
    handleInputErrors,
    userExist,
    checkUserConfirmed,
    AuthController.requestConfirmationCode
)

// Forgot password
router.post('/forgot-password',
    validateEmailInput,
    handleInputErrors,
    userExist,
    AuthController.forgotPassword
)

// Confirm token New password
router.post('/validate-token',
    validateTokenInput,
    handleInputErrors,
    tokenExist,
    AuthController.validateToken
)

// Resrt password
router.post('/reset-password/:token',
    validateResetPasswordInput,
    handleInputErrors,
    tokenExist,
    AuthController.resetPasswordWithToken
)

export default router