import { createStackNavigator } from '@react-navigation/stack';
import { MainTabParamList } from '../types/navigation';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/DepositScreen';
import SettingsScreen from '../screens/HoldingsScreen';
import WithdrawScreen from '../screens/WithdrawScreen';
import HoldingsScreen from '../screens/HoldingsScreen';
import DepositScreen from '../screens/DepositScreen';

const Stack = createStackNavigator<MainTabParamList>();

export default function MainStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#F5F5F7' },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
      />
      <Stack.Screen
        name="Deposit"
        component={DepositScreen}
        options={
          {
            presentation: "modal",
            headerShown: true
          }
        }
      />
      <Stack.Screen
        name="Holdings"
        component={HoldingsScreen}
        options={
          {
            presentation: "modal",
            headerShown: true
          }
        }
      />
      <Stack.Screen
        name="Withdraw"
        component={WithdrawScreen}
        options={
          {
            presentation: "modal",
            headerShown: false
          }
        }
      />
    </Stack.Navigator>
  );
}
