import PushNotification, { Importance } from 'react-native-push-notification';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageService, UserPreferences } from '../utils/storage';
import { getPortfolioValue } from './price';

const NOTIFICATION_STORAGE_KEY = '__vaseNotificationSettings';
const LAST_NOTIFICATION_KEY = '__vaseLastNotification';

export interface NotificationSettings {
  goalNotificationsEnabled: boolean;
  reminderNotificationsEnabled: boolean;
  lastGoalNotificationTime?: number;
  lastReminderNotificationTime?: number;
}

class NotificationService {
  private static instance: NotificationService;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    return new Promise((resolve) => {
      PushNotification.configure({
        onRegister: function (token) {
          console.log('TOKEN:', token);
        },

        onNotification: function (notification) {
          console.log('NOTIFICATION:', notification);
          if (notification.userInteraction) {
            console.log('User clicked notification');
          }
        },

        onAction: function (notification) {
          console.log('ACTION:', notification.action);
          console.log('NOTIFICATION:', notification);
        },

        onRegistrationError: function(err) {
          console.error('Registration Error:', err.message);
        },

        permissions: {
          alert: true,
          badge: true,
          sound: true,
        },

        popInitialNotification: true,
        requestPermissions: Platform.OS === 'ios',
      });

      if (Platform.OS === 'android') {
        PushNotification.createChannel(
          {
            channelId: 'vase-goal-notifications',
            channelName: 'Goal Progress',
            channelDescription: 'Notifications about your savings goals',
            importance: Importance.HIGH,
            vibrate: true,
          },
          (created) => console.log(`Goal channel created: ${created}`)
        );

        PushNotification.createChannel(
          {
            channelId: 'vase-reminder-notifications',
            channelName: 'Daily Reminders',
            channelDescription: 'Daily reminders to add funds',
            importance: Importance.DEFAULT,
            vibrate: true,
          },
          (created) => console.log(`Reminder channel created: ${created}`)
        );
      }

      this.isInitialized = true;
      resolve();
    });
  }

  async scheduleGoalNotifications(): Promise<void> {
    const userPreferences = await StorageService.getUserPreferences();
    if (!userPreferences) return;
    this.cancelGoalNotifications();
    if (userPreferences.unlockType === 'amount' && userPreferences.unlockAmount) {
      await this.scheduleAmountBasedNotifications(userPreferences);
    } else if (userPreferences.unlockType === 'date' && userPreferences.unlockDate) {
      await this.scheduleDateBasedNotifications(userPreferences);
    }
  }

  private async scheduleAmountBasedNotifications(preferences: UserPreferences): Promise<void> {
    if (!preferences.unlockAmount) return;

    const publicKey = await StorageService.getWalletPublicKey();
    if (!publicKey) return;

    try {
      const portfolioValue = await getPortfolioValue(publicKey);
      const currentBalance = portfolioValue.totalUsdValue;
      const remaining = preferences.unlockAmount - currentBalance;

      if (remaining <= 0) {
        this.scheduleLocalNotification({
          title: 'Goal Achieved!',
          message: 'Congratulations! You can now unlock your funds!',
          date: new Date(Date.now() + 1000 * 60), 
          channelId: 'vase-goal-notifications',
          id: 9999,
        });
        return;
      }
      const now = new Date();
      const notificationTimes = [
        { hour: 9, minute: 0 }, // 9:00 AM
        { hour: 15, minute: 0 }, // 3:00 PM  
        { hour: 20, minute: 0 }, // 8:00 PM
      ];

      notificationTimes.forEach((time, index) => {
        const notificationDate = new Date(now);
        notificationDate.setHours(time.hour, time.minute, 0, 0);
        if (notificationDate <= now) {
          notificationDate.setDate(notificationDate.getDate() + 1);
        }

        this.scheduleLocalNotification({
          title: 'Goal Progress Update',
          message: `You're $${remaining.toFixed(2)} away from your goal of $${preferences.unlockAmount?.toFixed(2)}. Keep saving!`,
          date: notificationDate,
          channelId: 'vase-goal-notifications',
          id: 1000 + index,
          repeatType: 'day',
        });
      });

    } catch (error) {
      console.error('Error scheduling amount-based notifications:', error);
    }
  }

  private async scheduleDateBasedNotifications(preferences: UserPreferences): Promise<void> {
    if (!preferences.unlockDate) return;

    const now = new Date();
    const unlockDate = new Date(preferences.unlockDate);
    
    if (unlockDate <= now) {
      this.scheduleLocalNotification({
        title: 'Funds Available!',
        message: 'Your funds are now available for withdrawal!',
        date: new Date(Date.now() + 1000 * 60),
        channelId: 'vase-reminder-notifications',
        id: 9998,
      });
      return;
    }

    const daysUntilUnlock = Math.ceil((unlockDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const unlockDateStr = unlockDate.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });

    const notificationDate = new Date(now);
    notificationDate.setHours(10, 0, 0, 0);
    
    if (notificationDate <= now) {
      notificationDate.setDate(notificationDate.getDate() + 1);
    }

    this.scheduleLocalNotification({
      title: 'Add to Your Savings',
      message: `Add your funds for today! Your funds will unlock on ${unlockDateStr} (${daysUntilUnlock} days left).`,
      date: notificationDate,
      channelId: 'vase-reminder-notifications',
      id: 2000,
      repeatType: 'day',
    });
  }

  private scheduleLocalNotification(options: {
    title: string;
    message: string;
    date: Date;
    channelId: string;
    id: number;
    repeatType?: 'day' | 'week' | 'month';
  }): void {
    PushNotification.localNotificationSchedule({
      title: options.title,
      message: options.message,
      date: options.date,
      channelId: options.channelId,
      id: options.id.toString(),
      repeatType: options.repeatType,
      smallIcon: 'ic_notification',
      largeIcon: 'ic_launcher',
      color: '#6366F1',
      vibrate: true,
      vibration: 300,
      tag: 'vase-notification',
      group: 'vase',
      ongoing: false,
      priority: 'default',
      visibility: 'public',
      importance: 'default',
    });
  }

  cancelGoalNotifications(): void {
    for (let i = 1000; i <= 1002; i++) {
      PushNotification.cancelLocalNotification(i.toString());
    }
    PushNotification.cancelLocalNotification('2000');
    PushNotification.cancelLocalNotification('9998');
    PushNotification.cancelLocalNotification('9999');
  }

  cancelAllNotifications(): void {
    PushNotification.cancelAllLocalNotifications();
  }

  async getNotificationSettings(): Promise<NotificationSettings> {
    try {
      const settings = await AsyncStorage.getItem(NOTIFICATION_STORAGE_KEY);
      if (settings) {
        return JSON.parse(settings);
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
    
    return {
      goalNotificationsEnabled: true,
      reminderNotificationsEnabled: true,
    };
  }

  async updateNotificationSettings(settings: Partial<NotificationSettings>): Promise<void> {
    try {
      const currentSettings = await this.getNotificationSettings();
      const newSettings = { ...currentSettings, ...settings };
      await AsyncStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(newSettings));
      
      if (newSettings.goalNotificationsEnabled || newSettings.reminderNotificationsEnabled) {
        await this.scheduleGoalNotifications();
      } else {
        this.cancelAllNotifications();
      }
    } catch (error) {
      console.error('Error updating notification settings:', error);
    }
  }

  async checkAndUpdateNotifications(): Promise<void> {
    const settings = await this.getNotificationSettings();
    if (settings.goalNotificationsEnabled || settings.reminderNotificationsEnabled) {
      await this.scheduleGoalNotifications();
    }
  }

  sendTestNotification(): void {
    PushNotification.localNotification({
      title: 'Vase Notifications',
      message: 'Notifications are working! You\'ll receive updates about your savings goals.',
      channelId: 'vase-goal-notifications',
      smallIcon: 'ic_notification',
      largeIcon: 'ic_launcher',
      color: '#6366F1',
    });
  }
}

export default NotificationService.getInstance();