import { signUp, confirmSignUp, signIn, resendSignUpCode, confirmSignIn, signOut, getCurrentUser, deleteUser } from '@aws-amplify/auth';

export const handleSignup = async (username, email, password) => {
  try {
    const result = await signUp({
      username,
      password,
      options: {
        userAttributes: {
          email: email
        }
      }
    });
    return result;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

export const handleConfirmSignUp = async (username, confirmationCode) => {
  try {
    return await confirmSignUp({
      username,
      confirmationCode
    });
  } catch (error) {
    console.error('Error signing up confirm:', error);
    throw error;
  }
};

export const handleSignin = async (username, password) => {
  try {
    const user = await signIn({
      username,
      password,
      options: {
        authFlowType: 'USER_SRP_AUTH'
      }
    });

    if (user.nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
      return {
        requiresNewPassword: true,
        user
      };
    }

    return { requiresNewPassword: false, user };
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

export const resendConfirmationCode = async (username) => {
  try {
    await resendSignUpCode({
      username
    });
  } catch (error) {
    console.error('Error resending code:', error);
    throw error;
  }
};

export const completeNewPassword = async (user, newPassword) => {
  try {
    const result = await confirmSignIn({
      challengeResponse: newPassword
    });
    return result;
  } catch (error) {
    console.error('Error setting new password:', error);
    throw error;
  }
};

export const handleSignout = async () => {
  try {
    await signOut();
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const checkCurrentUser = async () => {
  try {
    return await getCurrentUser();
  } catch (error) {
    return null;
  }
};

export const handleDeleteAccount = async () => {
  try {
    await deleteUser();
  } catch (error) {
    console.error('Error deleting account:', error);
    throw error;
  }
};
