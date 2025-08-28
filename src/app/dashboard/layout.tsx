import React, {JSX} from "react";

const DashboardLayout = ({children}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element => {
  return (
    <main>
      {children}
    </main>
  )
}

export default DashboardLayout;
