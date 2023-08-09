import { ITimeTable } from '../models/timeTable';
import MappedCache from './mappedCache';
import FieldCache from './fieldCache';
import { UserCredentials } from '../redux/reducers/authSlice';
import { ISessionTeachPlan } from '../models/teachPlan';
import { ISessionMarks } from '../models/sessionMarks';
import { ISessionPoints } from '../models/sessionPoints';
import { ISessionRating } from '../models/rating';
import SecuredFieldCache from './securedFieldCache';
import { ThemeType } from '../redux/reducers/settingsSlice';
import { TeacherType } from '../models/teachers';
import { IOrder } from '../models/order';
import { IMessagesData } from '../models/messages';
import { StudentInfo } from '../parser/menu';
import {AppConfig} from '../redux/reducers/settingsSlice';

export default class SmartCache {
  private keys = {
    // ETIS related keys
    ANNOUNCES: 'ANNOUNCES',
    MESSAGES: 'MESSAGES',
    ORDERS: 'ORDERS',
    ORDERS_INFO: 'ORDERS_INFO',
    SIGNS_POINTS: 'SIGNS_POINTS',
    SIGNS_MARKS: 'SIGNS_MARKS',
    SIGNS_RATING: 'SIGNS_RATING',
    STUDENT: 'STUDENT',
    TEACH_PLAN: 'TEACH_PLAN',
    TEACHERS: 'TEACHERS',
    TIMETABLE: 'TIMETABLE',

    // Internal keys
    USER: 'USER',
    APP: 'APP',
  };

  announce: FieldCache<string[]>;
  messages: MappedCache<number, IMessagesData>;
  orders: {
    list: FieldCache<IOrder[]>;
    info: MappedCache<string, string>;
  };
  timeTable: MappedCache<number, ITimeTable>;
  teachers: FieldCache<TeacherType>;
  teachPlan: FieldCache<ISessionTeachPlan[]>;
  signsMarks: MappedCache<number, ISessionMarks>;
  signsPoints: MappedCache<number, ISessionPoints>;
  signsRating: MappedCache<number, ISessionRating>;
  student: FieldCache<StudentInfo>;

  user: SecuredFieldCache<UserCredentials>;
  app: FieldCache<AppConfig>;

  constructor() {
    this.announce = new FieldCache(this.keys.ANNOUNCES, []);
    this.messages = new MappedCache<number, IMessagesData>(this.keys.MESSAGES);
    this.orders = {
      list: new FieldCache<IOrder[]>(this.keys.ORDERS, []),
      info: new MappedCache<string, string>(this.keys.ORDERS_INFO),
    };
    this.timeTable = new MappedCache(this.keys.TIMETABLE);
    this.teachers = new FieldCache<TeacherType>(this.keys.TEACHERS);
    this.teachPlan = new FieldCache(this.keys.TEACH_PLAN, []);
    this.signsMarks = new MappedCache(this.keys.SIGNS_MARKS);
    this.signsPoints = new MappedCache(this.keys.SIGNS_POINTS);
    this.signsRating = new MappedCache(this.keys.SIGNS_RATING);
    this.student = new FieldCache<StudentInfo>(this.keys.STUDENT);

    this.user = new SecuredFieldCache<UserCredentials>(this.keys.USER);
    this.app = new FieldCache<AppConfig>(this.keys.APP);
  }

  // Announce Region

  async getAnnounce() {
    if (!this.announce.isReady()) await this.announce.init();
    return this.announce.get();
  }

  async placeAnnounce(data: string[]) {
    this.announce.place(data);
    await this.announce.save();
  }

  // End Announce Region

  // Messages Region

  async getMessages(page: number) {
    if (!this.messages.isReady()) await this.messages.init();
    return this.messages.get(page);
  }

  async placeMessages(data: IMessagesData) {
    const page = Number.isNaN(data.page) ? 1 : data.page;
    this.messages.place(page, data);
    await this.messages.save();
  }

  // End Messages Region

  // Orders Region

  async getOrders() {
    if (!this.orders.list.isReady()) await this.orders.list.init();
    return this.orders.list.get();
  }

  async placeOrders(data: IOrder[]) {
    this.orders.list.place(data);
    await this.orders.list.save();
  }

  async getOrder(orderID: string) {
    if (!this.orders.info.isReady()) await this.orders.info.init();
    return this.orders.info.get(orderID);
  }

  async placeOrder(orderID: string, data: string) {
    this.orders.info.place(orderID, data);
    await this.orders.info.save();
  }

  // End Orders Region

  // TimeTable region

  async getTimeTable(week: number) {
    if (!this.timeTable.isReady()) await this.timeTable.init();
    return this.timeTable.get(week);
  }

  async placeTimeTable(data: ITimeTable) {
    this.timeTable.place(data.selectedWeek, data);
    await this.timeTable.save();
  }

  async deleteTimeTable(week: number) {
    this.timeTable.delete(week);
    await this.timeTable.save();
  }

  // End TimeTable region

  // Teachers Region

  async getTeachers() {
    if (!this.teachers.isReady()) await this.teachers.init();
    return this.teachers.get();
  }

  async placeTeachers(data: TeacherType) {
    this.teachers.place(data);
    await this.teachers.save();
  }

  // End Teachers Region

  // TeachPlan Region

  async getTeachPlan() {
    if (!this.teachPlan.isReady()) await this.teachPlan.init();
    return this.teachPlan.get();
  }

  async placeTeachPlan(teachPlan: ISessionTeachPlan[]) {
    this.teachPlan.place(teachPlan);
    await this.teachPlan.save();
  }

  // End TeachPlan Region

  // Region Signs

  // // Marks Region

  async getSessionMarks(session: number) {
    if (!this.signsMarks.isReady()) await this.signsMarks.init();
    return this.signsMarks.get(session);
  }

  async getAllSessionMarks() {
    if (!this.signsMarks.isReady()) await this.signsMarks.init();
    return this.signsMarks.values();
  }

  async placeSessionMarks(data: ISessionMarks[]) {
    data.every((d) => {
      this.signsMarks.place(d.session, d);
    });

    await this.signsMarks.save();
  }

  // // End Marks Region

  // // Points Region

  async getSessionPoints(session: number) {
    if (!this.signsPoints.isReady()) await this.signsPoints.init();
    return this.signsPoints.get(session);
  }

  async placeSessionPoints(data: ISessionPoints) {
    this.signsPoints.place(data.currentSession, data);
    await this.signsPoints.save();
  }

  // // End Points Region

  // // Rating Region

  async getSessionRating(session: number) {
    if (!this.signsRating.isReady()) await this.signsRating.init();
    return this.signsRating.get(session);
  }

  async placeSessionRating(data: ISessionRating) {
    this.signsRating.place(data.session.current, data);
    await this.signsRating.save();
  }

  // // End Rating Region

  // End Signs Region

  // Student Region

  async getStudent() {
    if (!this.student.isReady()) await this.student.init();
    return this.student.get();
  }

  async placeStudent(data: StudentInfo) {
    this.student.place(data);

    await this.student.save();
  }

  // End Student Region

  // Secure Region

  async getUserCredentials() {
    if (!this.user.isReady()) await this.user.init();
    return this.user.get();
  }

  async placeUserCredentials(data: UserCredentials) {
    this.user.place(data);
    await this.user.save();
  }

  async deleteUserCredentials() {
    await this.user.delete();
  }

  // End Secure Region

  // Internal Region

  async getAppConfig() {
    if (!this.app.isReady()) await this.app.init();
    return this.app.get();
  }

  async get() {
    const data = await this.getAppConfig();
    return data.theme;
  }

  async placeTheme(theme: ThemeType) {
    const data = await this.getAppConfig();
    data.theme = theme;
    this.app.place(data);
    await this.app.save();
  }

  async getSignNotification() {
    const data = await this.getAppConfig();
    return data.signNotificationEnabled;
  }

  async placeSignNotification(enabled: boolean) {
    const data = await this.getAppConfig();
    data.signNotificationEnabled = enabled;
    this.app.place(data);
    await this.app.save();
  }

  async getIntroViewed() {
    const data = await this.getAppConfig();
    return data.introViewed;
  }

  async placeIntroViewed(status: boolean) {
    const data = await this.getAppConfig();
    data.introViewed = status;
    this.app.place(data);
    await this.app.save();
  }

  async getReviewStep() {
    return (await this.getAppConfig()).reviewStep;
  }

  async setReviewStep(step: 'pending' | 'stop') {
    const config = await this.getAppConfig();
    config.reviewStep = step;

    await this.app.save();
  }

  async bumpReviewRequest() {
    const step = await this.getReviewStep();

    if (!step) {
      await this.setReviewStep('pending');
      return false;
    } else if (step === 'pending') {
      return true;
    }
  }

  async hasAcceptedPrivacyPolicy() {
    const config = await this.getAppConfig();
    return config.privacyPolicyAccepted;
  }

  async setPrivacyPolicyStatus(status: boolean) {
    const config = await this.getAppConfig();
    config.privacyPolicyAccepted = status;

    await this.app.save();
  }

  // End Internal Region

  // Helper methods

  async clear() {
    await this.announce.delete();
    await this.messages.clear();
    await this.orders.list.delete();
    await this.orders.info.clear();
    await this.timeTable.clear();
    await this.teachers.delete();
    await this.teachPlan.delete();
    await this.signsMarks.clear();
    await this.signsPoints.clear();
    await this.signsRating.clear();
    await this.student.delete();
    await this.user.delete();
    // await this.app.delete();
  }
}

export const cache = new SmartCache();
