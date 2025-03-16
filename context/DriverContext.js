import { createContext, useContext, useState } from "react";

const DriverContext = createContext();

export function DriverProvider({ children, initialData = {} }) {
  const [driverDetails, setDriverDetails] = useState(initialData);

  return (
    <DriverContext.Provider value={{ driverDetails, setDriverDetails }}>
      {children}
    </DriverContext.Provider>
  );
}

export function useDriverData() {
  return useContext(DriverContext);
}
