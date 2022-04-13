import { NavigationContainer } from '@react-navigation/native';

import StackNavigator from './StackNavigator';

import { AuthProvider } from "./hooks/useAuth"
import { StripeProvider } from '@stripe/stripe-react-native';

export default function App () {
  return (
    <NavigationContainer>
      <AuthProvider>
        <StripeProvider
          publishableKey='pk_test_51I0Dk8AX4NIcpyf3y2FxrILBCYiToGjzGatZPUOuidiOgmbFpbz4uePYb0MKtD3BbsOBkWOIn7vUGW59MiVodiva00htd0xyYX'
        >
          <StackNavigator />
        </StripeProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}