import type { AppDispatch } from '../../app/store/store';
import { createSessionFromLogin, saveAuthSession } from './authSession';
import { loginRequest } from './api/authApi';
import { setCredentials } from './store/authSlice';

export async function loginAndInitializeSession(
  email: string,
  password: string,
  dispatch: AppDispatch,
) {
  const response = await loginRequest({
    email,
    password,
  });

  const session = createSessionFromLogin(email, response);

  saveAuthSession(session);
  dispatch(setCredentials(session));

  return session;
}
