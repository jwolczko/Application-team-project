import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { apiRequest } from '../../app/apiClient';
import { useAppDispatch, useAppSelector } from '../../app/store/hooks';
import { clearAuthSession } from '../../features/auth/authSession';
import { clearCredentials } from '../../features/auth/store/authSlice';
import './AccountOperationsPage.css';

export function AccountOperationsPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, token, userName } = useAppSelector((state) => state.auth);
  const [accountId, setAccountId] = useState('');
  const [accountName, setAccountName] = useState('Personal Account');
  const [accountType, setAccountType] = useState('1');
  const [currency, setCurrency] = useState('PLN');
  const [incomingAmount, setIncomingAmount] = useState('250.00');
  const [incomingTitle, setIncomingTitle] = useState('Zasilenie rachunku');
  const [withdrawAmount, setWithdrawAmount] = useState('100.00');
  const [withdrawTitle, setWithdrawTitle] = useState('Wyplata');
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace />;
  }

  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };

  const runOperation = async (operation: () => Promise<string>, successMessage: string) => {
    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      const result = await operation();
      setMessage(successMessage);
      return result;
    } catch (error) {
      setMessage(null);
      setErrorMessage(error instanceof Error ? error.message : 'Operacja nie powiodla sie.');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const openAccount = async () => {
    const id = await runOperation(
      () => apiRequest<string>('/api/accounts', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          accountNumber: 'IGNORED',
          accountName,
          currency,
          accountType: Number(accountType),
        }),
      }),
      'Rachunek zostal otwarty.',
    );

    if (id) {
      setAccountId(id);
    }
  };

  const depositIncoming = async () => {
    await runOperation(
      () => apiRequest<string>('/api/accounts/incoming', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          targetAccountId: accountId,
          amount: Number(incomingAmount),
          currency,
          title: incomingTitle,
        }),
      }),
      'Wplyw przychodzacy zostal zaksiegowany.',
    );
  };

  const withdrawMoney = async () => {
    await runOperation(
      () => apiRequest<string>(`/api/accounts/${accountId}/withdraw`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          amount: Number(withdrawAmount),
          currency,
          title: withdrawTitle,
        }),
      }),
      'Wyplata zostala wykonana.',
    );
  };

  const logout = () => {
    clearAuthSession();
    dispatch(clearCredentials());
    navigate('/login');
  };

  return (
    <main className="account-operations-page">
      <header className="account-operations-page__header">
        <div>
          <span className="account-operations-page__eyebrow">Sprint 4</span>
          <h1>Rachunki i operacje pieniezne</h1>
          <p>{userName}</p>
        </div>
        <button type="button" onClick={logout}>Wyloguj</button>
      </header>

      {(message || errorMessage) && (
        <div className={`account-operations-page__notice${errorMessage ? ' account-operations-page__notice--error' : ''}`}>
          {errorMessage ?? message}
        </div>
      )}

      <section className="account-operations-page__grid">
        <form className="account-operations-page__panel" onSubmit={(event) => { event.preventDefault(); void openAccount(); }}>
          <h2>Otworz rachunek</h2>
          <label>
            Nazwa rachunku
            <input value={accountName} onChange={(event) => setAccountName(event.target.value)} disabled={isSubmitting} />
          </label>
          <label>
            Waluta
            <input value={currency} onChange={(event) => setCurrency(event.target.value.toUpperCase())} maxLength={3} disabled={isSubmitting} />
          </label>
          <label>
            Typ rachunku
            <select value={accountType} onChange={(event) => setAccountType(event.target.value)} disabled={isSubmitting}>
              <option value="1">Standard</option>
              <option value="2">Prestige</option>
              <option value="3">Savings</option>
            </select>
          </label>
          <button type="submit" disabled={isSubmitting}>Otworz rachunek</button>
        </form>

        <form className="account-operations-page__panel" onSubmit={(event) => { event.preventDefault(); void depositIncoming(); }}>
          <h2>Wplyw przychodzacy</h2>
          <label>
            ID rachunku
            <input value={accountId} onChange={(event) => setAccountId(event.target.value)} disabled={isSubmitting} />
          </label>
          <label>
            Kwota
            <input value={incomingAmount} onChange={(event) => setIncomingAmount(event.target.value)} inputMode="decimal" disabled={isSubmitting} />
          </label>
          <label>
            Tytul
            <input value={incomingTitle} onChange={(event) => setIncomingTitle(event.target.value)} disabled={isSubmitting} />
          </label>
          <button type="submit" disabled={isSubmitting || !accountId}>Zaksieguj wplyw</button>
        </form>

        <form className="account-operations-page__panel" onSubmit={(event) => { event.preventDefault(); void withdrawMoney(); }}>
          <h2>Wyplata</h2>
          <label>
            ID rachunku
            <input value={accountId} onChange={(event) => setAccountId(event.target.value)} disabled={isSubmitting} />
          </label>
          <label>
            Kwota
            <input value={withdrawAmount} onChange={(event) => setWithdrawAmount(event.target.value)} inputMode="decimal" disabled={isSubmitting} />
          </label>
          <label>
            Tytul
            <input value={withdrawTitle} onChange={(event) => setWithdrawTitle(event.target.value)} disabled={isSubmitting} />
          </label>
          <button type="submit" disabled={isSubmitting || !accountId}>Wyplac srodki</button>
        </form>
      </section>
    </main>
  );
}
