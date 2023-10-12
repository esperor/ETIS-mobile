import { useEffect, useRef, useState } from 'react';

import { cache } from '../cache/smartCache';
import { useClient } from '../data/client';
import { composePointsAndMarks } from '../data/signs';
import { GetResultType, RequestType } from '../models/results';
import { setCurrentSession } from '../redux/reducers/studentSlice';
import { useAppDispatch, useAppSelector } from './redux';
import useQuery from './useQuery';
import { ISessionPoints } from '../models/sessionPoints';

const useSignsQuery = () => {
  const fetchedSessions = useRef<number[]>([]);
  const dispatch = useAppDispatch();
  const { currentSession } = useAppSelector((state) => state.student);
  const client = useClient();
  const [data, setData] = useState<ISessionPoints>(null);

  const { data: pointsData, isLoading, update, refresh } = useQuery({
    method: client.getSessionSignsData,
    after: async (result) => {
      // Очевидно, что в самом начале мы получаем текущую сессию
      const { currentSession } = result.data;
      if (!pointsData) {
        dispatch(setCurrentSession(currentSession));

        if (result.type === GetResultType.fetched) {
          cache.placePartialStudent({ currentSession });
        }
      }

      if (!fetchedSessions.current.includes(currentSession)) {
        fetchedSessions.current.push(currentSession);
      }
    },
    onFail: async () => {
      const student = await cache.getStudent();
      if (!student || !student.currentSession) return;
      update({
        requestType: RequestType.forceCache,
        data: student.currentSession,
      });
    },
  });

  const marksQuery = useQuery({
    method: client.getSessionMarksData,
  })

  useEffect(() => {
    if (pointsData && marksQuery.data) setData(composePointsAndMarks(pointsData, marksQuery.data));
  }, [pointsData, marksQuery.data]);

  const loadSession = (session: number) => {
    update({
      data: session,
      requestType:
        session < currentSession || fetchedSessions.current.includes(session)
          ? RequestType.tryCache
          : RequestType.tryFetch,
    });
  };

  return { data, isLoading, refresh, loadSession };
};

export default useSignsQuery;
