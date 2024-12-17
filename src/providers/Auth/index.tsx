'use client';

import type { Permissions } from 'payload';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import type { User } from '@/payload-types';
import type {
  AuthContext,
  Create,
  ForgotPassword,
  Login,
  Logout,
  ResetPassword,
} from './types';

import { gql, USER } from './gql';
import { rest } from './rest';

const Context = createContext({} as AuthContext);

export const AuthProvider: React.FC<{
  api?: 'gql' | 'rest';
  children: React.ReactNode;
}> = ({ api = 'rest', children }) => {
  const [isSignedIn, setisSignedIn] = useState<boolean>(false);
  const [isLoaded, setisLoaded] = useState<boolean>(false);
  const [user, setUser] = useState<null | User>();
  const [permissions, setPermissions] = useState<null | Permissions>(null);

  const create = useCallback<Create>(
    async (args) => {
      if (api === 'rest') {
        const user = await rest(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users`,
          args,
        );
        setUser(user);
        return user;
      }

      if (api === 'gql') {
        const { createUser: user } = await gql(`mutation {
        createUser(data: { email: "${args.email}", password: "${args.password}", firstName: "${args.firstName}", lastName: "${args.lastName}" }) {
          ${USER}
        }
      }`);

        setUser(user);
        return user;
      }
    },
    [api],
  );

  const login = useCallback<Login>(
    async (args) => {
      if (api === 'rest') {
        const user = await rest(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/login`,
          args,
        );
        setUser(user);
        if (user) setisSignedIn(true);
        return user;
      }

      if (api === 'gql') {
        const { loginUser } = await gql(`mutation {
        loginUser(email: "${args.email}", password: "${args.password}") {
          user {
            ${USER}
          }
          exp
        }
      }`);

        setUser(loginUser?.user);
        if (loginUser?.user) setisSignedIn(true);
        return loginUser?.user;
      }
    },
    [api],
  );

  const logout = useCallback<Logout>(async () => {
    if (api === 'rest') {
      await rest(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/logout`);
      setUser(null);
      setisSignedIn(false);
      return;
    }

    if (api === 'gql') {
      await gql(`mutation {
        logoutUser
      }`);

      setUser(null);
      setisSignedIn(false);
    }
  }, [api]);

  // On mount, get user and set
  useEffect(() => {
    const fetchMe = async () => {
      setisLoaded(false);
      if (api === 'rest') {
        const user = await rest(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me`,
          {},
          {
            method: 'GET',
          },
        );
        setUser(user);
      }

      if (api === 'gql') {
        const { meUser } = await gql(`query {
          meUser {
            user {
              ${USER}
            }
            exp
          }
        }`);

        setUser(meUser.user);
      }
    };

    void fetchMe();
    if (user) setisSignedIn(true);
    setisLoaded(true);
  }, [api]);

  const forgotPassword = useCallback<ForgotPassword>(
    async (args) => {
      if (api === 'rest') {
        const user = await rest(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/forgot-password`,
          args,
        );
        setUser(user);
        return user;
      }

      if (api === 'gql') {
        const { forgotPasswordUser } = await gql(`mutation {
        forgotPasswordUser(email: "${args.email}")
      }`);

        return forgotPasswordUser;
      }
    },
    [api],
  );

  const resetPassword = useCallback<ResetPassword>(
    async (args) => {
      if (api === 'rest') {
        const user = await rest(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/reset-password`,
          args,
        );
        setUser(user);
        return user;
      }

      if (api === 'gql') {
        const { resetPasswordUser } = await gql(`mutation {
        resetPasswordUser(password: "${args.password}", token: "${args.token}") {
          user {
            ${USER}
          }
        }
      }`);

        setUser(resetPasswordUser.user);
        return resetPasswordUser.user;
      }
    },
    [api],
  );

  return (
    <Context.Provider
      value={{
        create,
        forgotPassword,
        login,
        logout,
        permissions,
        resetPassword,
        setPermissions,
        setUser,
        user,
        isSignedIn,
        isLoaded,
      }}
    >
      {children}
    </Context.Provider>
  );
};

type UseAuth<T = User> = () => AuthContext;

export const useAuth: UseAuth = () => useContext(Context);
