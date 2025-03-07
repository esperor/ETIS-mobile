import * as SentryExpo from 'sentry-expo';

import { ISessionTeachPlan } from '../models/teachPlan';

export default () => {
  if (__DEV__) return;

  console.log('[SENTRY] Initializing...');

  const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;

  if (!dsn) {
    console.warn('[SENTRY] No DSN URL was provided!');
  } else {
    SentryExpo.init({
      dsn,
      tracesSampleRate: 1.0,
      integrations: __DEV__
        ? [
            new SentryExpo.Native.ReactNativeTracing({
              shouldCreateSpanForRequest: (url) => !url.startsWith(`http://`),
            }),
          ]
        : [],
      enableInExpoDevelopment: true,
      debug: __DEV__, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
    });
  }
};

const subjectRegex = /([а-яА-Я\w\s":.,+#-]+(?: \([а-яА-Я\w\s]+\))?(?: \[[а-яА-Я\w\s,]+])*)/s;
export const checkSubjectNames = (teachPlan: ISessionTeachPlan[]) => {
  const incorrectDisciplines = teachPlan
    ?.map((session) => session.disciplines.map((discipline) => discipline.name))
    .flat()
    .filter((name) => !subjectRegex.test(name));
  if (incorrectDisciplines?.length !== 0) {
    SentryExpo.React.captureMessage(
      `Disciplines mismatched w/ regex: ${JSON.stringify(incorrectDisciplines)}`,
      'error'
    );
  }
};

export const reportParserError = (error) => {
  if (!__DEV__) SentryExpo.React.captureException(error);
};

export const executeRegex = (
  regex: RegExp,
  str: string,
  sendReport: boolean = true
): RegExpExecArray => {
  const result = regex.exec(str);
  if (!result && sendReport) {
    SentryExpo.React.captureMessage(`String ${str} mismatched with regex ${regex}`, 'error');
  }
  return result;
};
