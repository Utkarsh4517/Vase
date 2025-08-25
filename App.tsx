import { GestureHandlerRootView } from "react-native-gesture-handler";
import "./global.css"
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigation/AppNavigator";
import { AppProvider } from "./src/contexts/AppContext";
import { useEffect } from "react";
import NotificationService from "./src/services/notification";
export default function App() {
  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        await NotificationService.initialize();
        console.log('Notification service initialized');
        await NotificationService.checkAndUpdateNotifications();
      } catch (error) {
        console.error('Failed to initialize notifications:', error);
      }
    };

    initializeNotifications();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AppProvider>
    </GestureHandlerRootView>
  );
}