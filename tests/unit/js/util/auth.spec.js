const {
  signUp,
  confirmSignUp,
  signIn,
  resendSignUpCode,
  confirmSignIn,
  signOut,
  getCurrentUser,
  deleteUser
} = require('@aws-amplify/auth')
const {
  handleSignup,
  handleConfirmSignUp,
  handleSignin,
  resendConfirmationCode,
  completeNewPassword,
  handleSignout,
  checkCurrentUser,
  handleDeleteAccount
} = require('../../../../src/utils/auth')

jest.mock('@aws-amplify/auth', () => ({
  signUp: jest.fn(),
  confirmSignUp: jest.fn(),
  signIn: jest.fn(),
  resendSignUpCode: jest.fn(),
  confirmSignIn: jest.fn(),
  signOut: jest.fn(),
  getCurrentUser: jest.fn(),
  deleteUser: jest.fn()
}))

describe('auth utils', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('handleSignup', () => {
    it('calls signUp with correct params', async () => {
      const result = { user: 'test' }
      signUp.mockResolvedValueOnce(result)
      await expect(handleSignup('user', 'email', 'pass')).resolves.toBe(result)
      expect(signUp).toHaveBeenCalledWith({
        username: 'user',
        password: 'pass',
        options: { userAttributes: { email: 'email' } }
      })
    })

    it('logs and throws error on failure', async () => {
      const error = new Error('signup fail')
      signUp.mockRejectedValueOnce(error)
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
      await expect(handleSignup('u', 'e', 'p')).rejects.toThrow('signup fail')
      expect(spy).toHaveBeenCalledWith('Error signing up:', error)
      spy.mockRestore()
    })
  })

  describe('handleConfirmSignUp', () => {
    it('calls confirmSignUp with correct params', async () => {
      const result = { confirmed: true }
      confirmSignUp.mockResolvedValueOnce(result)
      await expect(handleConfirmSignUp('user', 'code')).resolves.toBe(result)
      expect(confirmSignUp).toHaveBeenCalledWith({
        username: 'user',
        confirmationCode: 'code'
      })
    })

    it('logs and throws error on failure', async () => {
      const error = new Error('confirm fail')
      confirmSignUp.mockRejectedValueOnce(error)
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
      await expect(handleConfirmSignUp('u', 'c')).rejects.toThrow('confirm fail')
      expect(spy).toHaveBeenCalledWith('Error signing up confirm:', error)
      spy.mockRestore()
    })
  })

  describe('handleSignin', () => {
    it('returns requiresNewPassword true if nextStep is CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED', async () => {
      const user = { nextStep: { signInStep: 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED' } }
      signIn.mockResolvedValueOnce(user)
      await expect(handleSignin('u', 'p')).resolves.toEqual({ requiresNewPassword: true, user })
    })

    it('returns requiresNewPassword false otherwise', async () => {
      const user = { nextStep: { signInStep: 'DONE' } }
      signIn.mockResolvedValueOnce(user)
      await expect(handleSignin('u', 'p')).resolves.toEqual({ requiresNewPassword: false, user })
    })

    it('logs and throws error on failure', async () => {
      const error = new Error('signin fail')
      signIn.mockRejectedValueOnce(error)
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
      await expect(handleSignin('u', 'p')).rejects.toThrow('signin fail')
      expect(spy).toHaveBeenCalledWith('Error signing in:', error)
      spy.mockRestore()
    })
  })

  describe('resendConfirmationCode', () => {
    const username = 'testuser'

    it('calls resendSignUpCode with correct username', async () => {
      resendSignUpCode.mockResolvedValueOnce()
      await expect(resendConfirmationCode(username)).resolves.toBeUndefined()
      expect(resendSignUpCode).toHaveBeenCalledWith({ username })
    })

    it('throws and logs error if resendSignUpCode fails', async () => {
      const error = new Error('fail')
      resendSignUpCode.mockRejectedValueOnce(error)
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      await expect(resendConfirmationCode(username)).rejects.toThrow('fail')
      expect(consoleSpy).toHaveBeenCalledWith('Error resending code:', error)
      consoleSpy.mockRestore()
    })
  })

  describe('completeNewPassword', () => {
    it('calls confirmSignIn with correct params', async () => {
      const result = { ok: true }
      confirmSignIn.mockResolvedValueOnce(result)
      await expect(completeNewPassword('user', 'newpass')).resolves.toBe(result)
      expect(confirmSignIn).toHaveBeenCalledWith({ challengeResponse: 'newpass' })
    })

    it('logs and throws error on failure', async () => {
      const error = new Error('newpass fail')
      confirmSignIn.mockRejectedValueOnce(error)
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
      await expect(completeNewPassword('u', 'p')).rejects.toThrow('newpass fail')
      expect(spy).toHaveBeenCalledWith('Error setting new password:', error)
      spy.mockRestore()
    })
  })

  describe('handleSignout', () => {
    it('calls signOut', async () => {
      signOut.mockResolvedValueOnce()
      await expect(handleSignout()).resolves.toBeUndefined()
      expect(signOut).toHaveBeenCalled()
    })

    it('logs and throws error on failure', async () => {
      const error = new Error('signout fail')
      signOut.mockRejectedValueOnce(error)
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
      await expect(handleSignout()).rejects.toThrow('signout fail')
      expect(spy).toHaveBeenCalledWith('Error signing out:', error)
      spy.mockRestore()
    })
  })

  describe('checkCurrentUser', () => {
    it('returns user if getCurrentUser succeeds', async () => {
      const user = { id: 1 }
      getCurrentUser.mockResolvedValueOnce(user)
      await expect(checkCurrentUser()).resolves.toBe(user)
    })

    it('returns null if getCurrentUser fails', async () => {
      getCurrentUser.mockRejectedValueOnce(new Error('fail'))
      await expect(checkCurrentUser()).resolves.toBeNull()
    })
  })

  describe('handleDeleteAccount', () => {
    it('calls deleteUser', async () => {
      deleteUser.mockResolvedValueOnce()
      await expect(handleDeleteAccount()).resolves.toBeUndefined()
      expect(deleteUser).toHaveBeenCalled()
    })

    it('logs and throws error on failure', async () => {
      const error = new Error('delete fail')
      deleteUser.mockRejectedValueOnce(error)
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
      await expect(handleDeleteAccount()).rejects.toThrow('delete fail')
      expect(spy).toHaveBeenCalledWith('Error deleting account:', error)
      spy.mockRestore()
    })
  })
})
