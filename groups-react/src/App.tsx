import React, { useContext } from 'react'
import Group from "@interopio/groups-ui-react";
import "@interopio/groups-ui-react/dist/styles/groups.css";
import { IOConnectContext } from '@interopio/react-hooks';

const App = () => {
  (window as any).io = useContext(IOConnectContext);
  return <Group />
};

export default App;
