import { useEffect } from "react"

import { NavigationContainer } from "@react-navigation/native"

import { LogBox } from "react-native"

import StackNavigator from "./StackNavigator"

import { AuthProvider } from "./hooks/useAuth"

const App = () => {
  useEffect(() =>
    LogBox.ignoreLogs([
      "VirtualizedLists should never be nested",
      "Setting a timer for a long period of time",
      "Uncaught Error in snapshot listener"
    ])
    , [])

  return (
    <NavigationContainer>
      <AuthProvider>
        <StackNavigator />
      </AuthProvider>
    </NavigationContainer>
  )
}

export default App