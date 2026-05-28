import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../../../app/apiClient';
import { addProductRequest } from '../../../features/products/api/productApi';
import { useAppSelector } from '../../../app/store/hooks';
import './CreateProductModal.css';

type CreateProductModalProps = {
  onClose: () => void;
};

type ProductCategory = 'account' | 'card' | 'credit';
type AccountTier = 'Standard' | 'Prestige';
type CardKind = 'Debit' | 'Credit';
type LoanKind = 'Cash' | 'Consumer';

const productCategories = {
  account: 1,
  card: 2,
  credit: 3,
} as const;

const accountTypes = {
  Standard: 1,
  Prestige: 2,
} as const;

const cardTypes = {
  Debit: 1,
  Credit: 2,
} as const;

const loanTypes = {
  Cash: 1,
  Consumer: 2,
} as const;

export function CreateProductModal({ onClose }: CreateProductModalProps) {
  const queryClient = useQueryClient();
  const token = useAppSelector((state) => state.auth.token);
  const customerId = useAppSelector((state) => state.auth.customerId);
  const [category, setCategory] = useState<ProductCategory>('account');
  const [accountTier, setAccountTier] = useState<AccountTier>('Standard');
  const [cardKind, setCardKind] = useState<CardKind>('Debit');
  const [loanKind, setLoanKind] = useState<LoanKind>('Cash');
  const [productName, setProductName] = useState('');
  const [initialAmount, setInitialAmount] = useState('');
  const [creditLimit, setCreditLimit] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const refreshDashboard = async () => {
    if (!customerId) {
      return;
    }

    const dashboardQuery = { queryKey: ['dashboard', customerId] };

    await queryClient.invalidateQueries(dashboardQuery);
    await queryClient.refetchQueries({ ...dashboardQuery, type: 'active' });

    window.setTimeout(() => {
      void queryClient.invalidateQueries(dashboardQuery);
      void queryClient.refetchQueries({ ...dashboardQuery, type: 'active' });
    }, 2500);
  };

  const getDefaultName = () => {
    if (category === 'account') return accountTier === 'Prestige' ? 'Konto Prestige' : 'Konto Osobiste';
    if (category === 'card') return cardKind === 'Credit' ? 'Karta Kredytowa' : 'Karta Debetowa';
    return loanKind === 'Consumer' ? 'Kredyt Konsumpcyjny' : 'Kredyt Gotówkowy';
  };

  // Pomocnicza funkcja wykonująca wpłatę
  const executeInitialDeposit = async (accountId: string, amountToDeposit: number) => {
    const depositPayload = {
      targetAccountId: accountId,
      amount: amountToDeposit,
      currency: 'PLN',
      title: 'Wpłata początkowa'
    };

    try {
      await apiRequest<string>('/api/transfers/incoming', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: JSON.stringify(depositPayload)
      });
      console.log('Wpłata początkowa zaksięgowana pomyślnie.');
    } catch (err) {
      console.error('Błąd podczas wykonywania wpłaty początkowej:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!token || !customerId) {
      setErrorMessage('Sesja wygasła. Zaloguj się ponownie.');
      return;
    }

    setIsSubmitting(true);

    const amount = parseFloat(initialAmount) || 0;
    const parsedCreditLimit = parseFloat(creditLimit) || 0;

    try {
      if (category === 'account') {
        const accountPayload = {
          accountNumber: "", 
          accountName: productName.trim() || getDefaultName(),
          currency: 'PLN',
          accountType: accountTypes[accountTier]
        };

        const accountId = await apiRequest<string>('/api/accounts', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(accountPayload)
        });

        if (amount > 0) {
          await executeInitialDeposit(accountId, amount);
        }

      } else if (category === 'card') {
        if (cardKind === 'Credit' && parsedCreditLimit <= 0) {
          setErrorMessage('Limit karty kredytowej musi być większy od zera.');
          return;
        }

        const cardId = await addProductRequest(token, {
          productCategory: productCategories.card,
          productName: productName.trim() || getDefaultName(),
          currency: 'PLN',
          productType: cardTypes[cardKind],
          creditLimit: cardKind === 'Credit' ? parsedCreditLimit : null,
          initialBalance: null,
        });

        if (cardKind === 'Debit' && amount > 0) {
          await executeInitialDeposit(cardId, amount);
        }
      } else {
        if (amount <= 0) {
          setErrorMessage('Wnioskowana kwota kredytu musi być większa od zera.');
          return;
        }

        await addProductRequest(token, {
          productCategory: productCategories.credit,
          productName: productName.trim() || getDefaultName(),
          currency: 'PLN',
          productType: loanTypes[loanKind],
          creditLimit: null,
          initialBalance: amount,
        });
      }

      await refreshDashboard();
      onClose();

    } catch (error: any) {
      console.error('Wystąpił błąd podczas dodawania produktu:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Nie udało się utworzyć konta.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-product-overlay" onClick={onClose}>
      <div className="create-product-dialog" onClick={(e) => e.stopPropagation()}>
        <button className="create-product-close" onClick={onClose} aria-label="Zamknij">✕</button>
        
        <h2 className="create-product-title">Otwórz nowy produkt</h2>
        
        <div className="create-product-tabs">
          <button 
            type="button"
            className={`tab ${category === 'account' ? 'active' : ''}`} 
            onClick={() => setCategory('account')}
          >
            Konto
          </button>
          <button 
            type="button"
            className={`tab ${category === 'card' ? 'active' : ''}`} 
            onClick={() => setCategory('card')}
          >
            Karta
          </button>
          <button 
            type="button"
            className={`tab ${category === 'credit' ? 'active' : ''}`} 
            onClick={() => setCategory('credit')}
          >
            Kredyt
          </button>
        </div>

        <form className="create-product-form" onSubmit={handleSubmit}>
          {errorMessage && (
            <p className="create-product-error" role="alert">
              {errorMessage}
            </p>
          )}
          
          {category === 'account' && (
            <div className="form-group">
              <label>Wariant konta</label>
              <select value={accountTier} onChange={(e) => setAccountTier(e.target.value as AccountTier)}>
                <option value="Standard">Konto Osobiste (Standard)</option>
                <option value="Prestige">Konto Prestige (VIP)</option>
              </select>
            </div>
          )}

          {category === 'card' && (
            <div className="form-group">
              <label>Rodzaj karty</label>
              <select value={cardKind} onChange={(e) => setCardKind(e.target.value as CardKind)}>
                <option value="Debit">Karta Debetowa</option>
                <option value="Credit">Karta Kredytowa</option>
              </select>
            </div>
          )}

          {category === 'credit' && (
            <div className="form-group">
              <label>Rodzaj kredytu</label>
              <select value={loanKind} onChange={(e) => setLoanKind(e.target.value as LoanKind)}>
                <option value="Cash">Kredyt Gotówkowy</option>
                <option value="Consumer">Kredyt Konsumpcyjny</option>
              </select>
            </div>
          )}

          <div className="form-group">
            <label>
              {category === 'account' && 'Wpłata początkowa (PLN)'}
              {category === 'card' && (cardKind === 'Credit' ? 'Początkowa spłata (PLN)' : 'Zasilenie karty (PLN)')}
              {category === 'credit' && 'Wnioskowana kwota (PLN)'}
            </label>
            <div className="input-with-currency">
              <input 
                type="number" 
                min="0"
                step="0.01"
                placeholder="0.00"
                value={initialAmount}
                onChange={(e) => setInitialAmount(e.target.value)}
                required={category === 'credit'}
                disabled={category === 'card' && cardKind === 'Credit'}
              />
              <span className="currency-addon">PLN</span>
            </div>
          </div>

          {category === 'card' && cardKind === 'Credit' && (
            <div className="form-group">
              <label>Limit kredytowy (PLN)</label>
              <div className="input-with-currency">
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="10000.00"
                  value={creditLimit}
                  onChange={(e) => setCreditLimit(e.target.value)}
                  required
                />
                <span className="currency-addon">PLN</span>
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Nazwa własna (opcjonalnie)</label>
            <input 
              type="text" 
              placeholder={`np. ${getDefaultName()}`}
              maxLength={200}
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Przetwarzanie...' : 'Zatwierdź'}
          </button>
        </form>

      </div>
    </div>
  );
}
