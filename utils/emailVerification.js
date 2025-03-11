import { auth } from '../config/firebase';
import { reload, sendEmailVerification } from 'firebase/auth';

// Check if user has verified their email
export const isEmailVerified = async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      // Force refresh the user to get the most current verification status
      await reload(user);
      return user.emailVerified;
    }
    return false;
  } catch (error) {
    console.error("Error checking email verification status:", error);
    return false;
  }
};

// Resend verification email
export const resendVerificationEmail = async (user) => {
  try {
    await sendEmailVerification(user);
    return true;
  } catch (error) {
    console.error("Error sending verification email:", error);
    return false;
  }
};

// Function that can be used in login screen to verify user's email is verified
export const verifyBeforeLogin = async (user) => {
  if (!user) return false;
  
  await reload(user);
  if (!user.emailVerified) {
    return false;
  }
  return true;
};
