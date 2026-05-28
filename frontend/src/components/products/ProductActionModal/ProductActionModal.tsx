import type { FormEvent } from 'react';
import { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAppSelector } from '../../../app/store/hooks';
import { formatProductNumber, getProductDisplayName } from '../../../features/dashboard/productPresentation';
import type { DashboardData, DashboardProduct } from '../../../features/dashboard/types/dashboard.types';
import { repayLoanRequest } from '../../../features/products/api/productApi';
import { createTransferRequest } from '../../../features/transfers/api/transferApi';
import './ProductActionModal.css';

type ProductActionModalProps = {
  dashboard: DashboardData;
  product: DashboardProduct;
  onClose: () => void;
};

function isFundingProduct(product: DashboardProduct) {
  return product.productCategory === 'BankAccount' || product.productCategory === 'Card';
}

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat('pl-PL', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount) + ` ${currency}`;
}

export function ProductActionModal({ dashboard, product, onClose }: ProductActionModalProps) {
  const queryClient = useQueryClient();
  const token = useAppSelector((state) => state.auth.token);
  const customerId = useAppSelector((state) => state.auth.customerId);
  const [sourceProductId, setSourceProductId] = useState('');
  const [amount, setAmount] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const operationLabel = product.productCategory === 'Loan' ? 'Spłać kredyt' : 'Zasil kartę';
  const availableSources = useMemo(
    () => dashboard.products.filter((candidate) => isFundingProduct(candidate) && candidate.productId !== product.productId),
    [dashboard.products, product.productId],
  );

  const selectedSourceProductId = sourceProductId || availableSources[0]?.productId || '';

  const refreshDashboard = () => {
    if (!customerId) {
      return;
    }

    const queryKey = ['dashboard', customerId];

    void queryClient.invalidateQueries({ queryKey });
    void queryClient.refetchQueries({ queryKey, type: 'active' });

    window.setTimeout(() => {
      void queryClient.invalidateQueries({ queryKey });
      void queryClient.refetchQueries({ queryKey, type: 'active' });
    }, 2500);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!token || !customerId) {
      setErrorMessage('Sesja wygasła. Zaloguj się ponownie.');
      return;
    }

    if (!selectedSourceProductId) {
      setErrorMessage('Brak produktu źródłowego do wykonania operacji.');
      return;
    }

    const parsedAmount = Number(amount);

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setErrorMessage('Kwota musi być większa od zera.');
      return;
    }

    if (product.productCategory === 'Loan' && parsedAmount > product.balance) {
      setErrorMessage('Kwota spłaty nie może przekraczać pozostałego salda kredytu.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      if (product.productCategory === 'Loan') {
        await repayLoanRequest(token, product.productId, {
          sourceProductId: selectedSourceProductId,
          amount: parsedAmount,
          currency: product.currency,
          title: `Spłata: ${getProductDisplayName(product.productName)}`,
        });
      } else {
        await createTransferRequest(token, {
          transferType: 'Own',
          sourceAccountId: selectedSourceProductId,
          targetAccountId: product.productId,
          amount: parsedAmount,
          currency: product.currency,
          title: `Zasilenie: ${getProductDisplayName(product.productName)}`,
        });
      }

      refreshDashboard();
      onClose();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Nie udało się wykonać operacji.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="product-action-modal__overlay" role="dialog" aria-modal="true" aria-label={operationLabel} onClick={onClose}>
      <div className="product-action-modal" onClick={(event) => event.stopPropagation()}>
        <button className="product-action-modal__close" type="button" onClick={onClose} aria-label="Zamknij">x</button>
        <h2>{operationLabel}</h2>
        <div className="product-action-modal__target">
          <span>{getProductDisplayName(product.productName)}</span>
          <strong>{formatMoney(product.balance, product.currency)}</strong>
        </div>

        <form className="product-action-modal__form" onSubmit={handleSubmit}>
          <label htmlFor="sourceProductId">Produkt źródłowy</label>
          <select
            id="sourceProductId"
            value={selectedSourceProductId}
            onChange={(event) => setSourceProductId(event.target.value)}
            disabled={isSubmitting || availableSources.length === 0}
          >
            {availableSources.map((sourceProduct) => (
              <option key={sourceProduct.productId} value={sourceProduct.productId}>
                {getProductDisplayName(sourceProduct.productName)} - {formatProductNumber(sourceProduct)}
              </option>
            ))}
          </select>

          <label htmlFor="productActionAmount">Kwota</label>
          <div className="product-action-modal__money">
            <input
              id="productActionAmount"
              type="number"
              min="0.01"
              max={product.productCategory === 'Loan' ? product.balance : undefined}
              step="0.01"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              disabled={isSubmitting}
            />
            <span>{product.currency}</span>
          </div>

          {errorMessage && <p className="product-action-modal__error">{errorMessage}</p>}

          <div className="product-action-modal__buttons">
            <button type="button" className="product-action-modal__secondary" onClick={onClose}>
              Anuluj
            </button>
            <button type="submit" className="product-action-modal__primary" disabled={isSubmitting || availableSources.length === 0}>
              {isSubmitting ? 'Przetwarzanie...' : operationLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
