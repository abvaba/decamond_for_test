import React, {JSX} from "react";
import { Metadata } from 'next'
export const metadata: Metadata = {
  title: "Authentication",
  description: "Sign in or create an account to access your dashboard",
}
const AuthLayout = ({children}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element => {
  return (
    <>
      {children}
    </>
  )
}

export default AuthLayout;
