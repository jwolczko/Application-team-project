import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks';
import { clearAuthSession } from '../../../features/auth/authSession';
import { clearCredentials } from '../../../features/auth/store/authSlice';
import './DashboardHeader.css';

const IDLE_TIMEOUT_SECONDS = 5 * 60;
const ACTIVITY_EVENTS = ['pointerdown', 'keydown', 'scroll', 'touchstart'] as const;

function formatRemainingTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function getUserInitial(userName?: string | null) {
  const trimmedUserName = userName?.trim();

  return trimmedUserName ? trimmedUserName.charAt(0).toLocaleUpperCase('pl-PL') : 'K';
}

export function DashboardHeader() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const userName = useAppSelector((state) => state.auth.userName);
  const [remainingSeconds, setRemainingSeconds] = useState(IDLE_TIMEOUT_SECONDS);
  const lastActivityAtRef = useRef<number | null>(null);
  const hasLoggedOutRef = useRef(false);

  const handleLogout = useCallback(async () => {
    if (hasLoggedOutRef.current) {
      return;
    }

    hasLoggedOutRef.current = true;
    clearAuthSession();
    dispatch(clearCredentials());
    await queryClient.cancelQueries();
    queryClient.removeQueries({ queryKey: ['dashboard'] });
    navigate('/');
  }, [dispatch, navigate, queryClient]);

  useEffect(() => {
    const resetIdleTimer = () => {
      lastActivityAtRef.current = Date.now();
      setRemainingSeconds(IDLE_TIMEOUT_SECONDS);
    };

    resetIdleTimer();

    ACTIVITY_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, resetIdleTimer, { passive: true });
    });

    const intervalId = window.setInterval(() => {
      const lastActivityAt = lastActivityAtRef.current ?? Date.now();
      const elapsedSeconds = Math.floor((Date.now() - lastActivityAt) / 1000);
      const nextRemainingSeconds = Math.max(IDLE_TIMEOUT_SECONDS - elapsedSeconds, 0);

      setRemainingSeconds(nextRemainingSeconds);

      if (nextRemainingSeconds === 0) {
        void handleLogout();
      }
    }, 1000);

    return () => {
      ACTIVITY_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, resetIdleTimer);
      });
      window.clearInterval(intervalId);
    };
  }, [handleLogout]);

  return (
    <header className="dashboard-header">
      {/* LEWA STRONA: LOGO */}
      <div className="dashboard-header__logo">
        <img className="dashboard-header__brand-mark" src="/calisia_logo_transparent.png" alt="" aria-hidden="true" />
        <span className="dashboard-header__brand">Calisia</span>
      </div>

      <div className="dashboard-header__right">
        <div className="dashboard-header__user">
          <div className="dashboard-header__avatar" aria-hidden="true">
            {getUserInitial(userName)}
          </div>
          <span>{userName ?? 'Klient Calisia'}</span>
          
        </div>

        <div className="dashboard-header__mail">✉<span className="dashboard-header__badge">13</span></div>

        <button className="dashboard-header__logout" type="button" onClick={handleLogout}>
          <span>⏻</span>
          <div>
            <strong>Wyloguj</strong>
            <span>{formatRemainingTime(remainingSeconds)}</span>
          </div>
        </button>
      </div>
    </header>
  );
}
