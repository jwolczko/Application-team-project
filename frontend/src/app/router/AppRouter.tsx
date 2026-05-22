import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from '../../layouts/PublicLayout';
import { AuthenticatedLayout } from '../../layouts/AuthenticatedLayout';
import { LandingPage } from '../../views/LandingPage/LandingPage';
import { LoginPage } from '../../views/LoginPage/LoginPage';
import { CreateAccountPage } from '../../views/CreateAccountPage/CreateAccountPage';
import { AccountOperationsPage } from '../../views/AccountOperationsPage/AccountOperationsPage';

export function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/create-account" element={<CreateAccountPage />} />
      </Route>

      <Route element={<AuthenticatedLayout />}>
        <Route path="/accounts" element={<AccountOperationsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
