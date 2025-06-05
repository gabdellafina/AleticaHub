import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { app } from '../../lib/firebase';

export async function registerUser(email: string, senha: string) {
  const auth = getAuth(app);
  return createUserWithEmailAndPassword(auth, email, senha);
}
