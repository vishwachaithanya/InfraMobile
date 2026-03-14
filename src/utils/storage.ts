import AsyncStorage from "@react-native-async-storage/async-storage";

export const Storage = {
  async get(key: string): Promise<string | null> {
    return AsyncStorage.getItem(key);
  },

  async set(key: string, value: string): Promise<void> {
    return AsyncStorage.setItem(key, value);
  },

  async remove(key: string): Promise<void> {
    return AsyncStorage.removeItem(key);
  },

  async multiRemove(keys: string[]): Promise<void> {
    return Promise.all(keys.map(key => AsyncStorage.removeItem(key))).then(() => {});
  },

  async getToken(): Promise<string | null> {
    return AsyncStorage.getItem("auth_token");
  },

  async setAuth(token: string, name: string, userId: number): Promise<void> {
    await Promise.all([
      AsyncStorage.setItem("auth_token", token),
      AsyncStorage.setItem("consumer_name", name),
      AsyncStorage.setItem("user_id", String(userId)),
    ]);
  },

  async clearAuth(): Promise<void> {
    await this.multiRemove(["auth_token", "consumer_name", "user_id"]);
  },

  async hasSeenOnboarding(): Promise<boolean> {
    const val = await AsyncStorage.getItem("seen_onboarding");
    return val === "true";
  },

  async markOnboardingSeen(): Promise<void> {
    return AsyncStorage.setItem("seen_onboarding", "true");
  },
};
