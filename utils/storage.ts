import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

import { ITeacher, TeacherType } from '../models/teachers';
import { ITimeTable } from '../models/timeTable';
import { ThemeType } from '../redux/reducers/settingsSlice';
import { ISessionSignsData } from '../models/sessionPoints';

export default class Storage {
  async bumpReviewRequest() {
    const reviewStep = await SecureStore.getItemAsync('reviewStep');
    if (reviewStep === null) {
      // первый запуск
      await SecureStore.setItemAsync('reviewStep', 'first-login');
    } else if (reviewStep === 'first-login') {
      // второй запуск - предложить отставить отзыв
      return true;
    }
    return false;
  }

  async setReviewSubmitted() {
    await SecureStore.setItemAsync('reviewStep', 'stop');
  }

  async storeAccountData(login: string, password: string) {
    await SecureStore.setItemAsync('userLogin', login);
    await SecureStore.setItemAsync('userPassword', password);
  }

  async getAccountData() {
    const login = await SecureStore.getItemAsync('userLogin');

    if (login === null) return;

    const password = await SecureStore.getItemAsync('userPassword');
    return {
      login,
      password,
    };
  }

  async deleteAccountData() {
    await SecureStore.deleteItemAsync('userLogin');
    await SecureStore.deleteItemAsync('userPassword');
  }

  hasAcceptedPrivacyPolicy() {
    return SecureStore.getItemAsync('hasAcceptedPrivacyPolicy');
  }

  async acceptPrivacyPolicy() {
    await SecureStore.setItemAsync('hasAcceptedPrivacyPolicy', 'true');
  }

  async getTimeTableData(week: number): Promise<ITimeTable> {
    let stringData;
    if (week === undefined) {
      stringData = await AsyncStorage.getItem('timetable-current');
    } else stringData = await AsyncStorage.getItem(`timetable-${week}`);

    return JSON.parse(stringData);
  }

  async storeTimeTableData(data: ITimeTable, week?: number) {
    const stringData = JSON.stringify(data);

    if (week === undefined) {
      await AsyncStorage.setItem('timetable-current', stringData);
    } else await AsyncStorage.setItem(`timetable-${week}`, stringData);
  }

  async getTeacherData(): Promise<TeacherType | null> {
    const stringData = await AsyncStorage.getItem('teachers');
    if (stringData) JSON.parse(stringData);
  }

  storeTeacherData(data: TeacherType) {
    return AsyncStorage.setItem('teachers', JSON.stringify(data));
  }

  async getSignsData(session: number): Promise<ISessionSignsData> {
    const stringData = await AsyncStorage.getItem(`session-${session}`);
    if (stringData) return JSON.parse(stringData);
  }

  storeSignsData(data: ISessionSignsData) {
    return AsyncStorage.setItem(`session-${data.currentSession}`, JSON.stringify(data))
  }

  async getMarksData() {
    const stringData = await AsyncStorage.getItem(`marks`);
    if (stringData) return JSON.parse(stringData);
  }

  async storeMarksData(data) {
    return AsyncStorage.setItem(`marks`, JSON.stringify(data))
  }

  storeAppTheme(theme: ThemeType) {
    return AsyncStorage.setItem('theme', theme);
  }

  async getAppTheme() {
    const theme = await AsyncStorage.getItem('theme');
    if (theme === null) return ThemeType.auto;
    return theme;
  }
}
