import { UserData } from '../types/User';

export async function saveUserData(token: string, userData: UserData) {
  await fetch('/api/usuario', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });
}
