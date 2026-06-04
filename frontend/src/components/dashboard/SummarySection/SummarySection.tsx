import { useState } from 'react';
import type { DashboardData } from '../../../features/dashboard/types/dashboard.types';
import './SummarySection.css';

type SummarySectionProps = {
  dashboard: DashboardData;
  onOpenTransfer: () => void;
};

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat('pl-PL', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount) + ` ${currency}`;
}

function formatTransactionDate(eventDateUtc: string) {
  return new Intl.DateTimeFormat('pl-PL', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(eventDateUtc));
}

export function SummarySection({ dashboard, onOpenTransfer }: SummarySectionProps) {
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const transactions = [...dashboard.events].sort(
    (firstEvent, secondEvent) =>
      new Date(secondEvent.eventDateUtc).getTime() - new Date(firstEvent.eventDateUtc).getTime(),
  );

  return (
    <>
      <section className="summary-section">
        {/* <div className="summary-section__header-row">
          <h2>Podsumowanie środków</h2>
        </div> */}

        {/* <div className="summary-section__top-grid">
          <div className="summary-section__left">
            <div className="summary-section__stack summary-section__stack--back-1" />
            <div className="summary-section__stack summary-section__stack--back-2" /> */}

            <div className="summary-section__card">
              <div className="summary-section__card-header">
                {/*}
                <h3>{featuredProduct ? getProductDisplayName(featuredProduct.productName) : 'Brak aktywnych produktow'}</h3>
                */}
                Podsumowanie środków
              </div>

              <div className="summary-section__amount">
                {formatMoney(dashboard.totalBalance, dashboard.currency)}
              </div>

              <div className="summary-section__actions">
                <button type="button" className="summary-section__primary-btn" onClick={onOpenTransfer}>
                  Wykonaj przelew
                </button>
                <button
                  type="button"
                  className="summary-section__outline-btn"
                  onClick={() => setIsHistoryModalOpen(true)}
                >
                  Historia
                </button>
              </div>
            </div>
         {/* </div>

          
          <div className="summary-section__right">         
          </div>
        </div> */}
      </section>

      {isHistoryModalOpen && (
        <div
          className="history-modal__overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Historia transakcji"
          onClick={() => setIsHistoryModalOpen(false)}
        >
          <div className="history-modal" onClick={(event) => event.stopPropagation()}>
            <button
              className="history-modal__close"
              type="button"
              aria-label="Zamknij historię transakcji"
              onClick={() => setIsHistoryModalOpen(false)}
            >
              x
            </button>

            <div className="history-modal__header">
              <span className="history-modal__eyebrow">Historia rachunku</span>
              <h2>Transakcje</h2>
              <p>Ostatnie operacje widoczne na osi czasu dashboardu.</p>
            </div>

            <div className="history-modal__summary">
              <span>Saldo łączne</span>
              <strong>{formatMoney(dashboard.totalBalance, dashboard.currency)}</strong>
            </div>

            <div className="history-modal__list">
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <article className="history-modal__item" key={transaction.id}>
                    <div className={`history-modal__mark ${transaction.isPositive ? 'history-modal__mark--positive' : ''}`}>
                      {transaction.isPositive ? '+' : '-'}
                    </div>
                    <div className="history-modal__details">
                      <h3>{transaction.title}</h3>
                      <p>{formatTransactionDate(transaction.eventDateUtc)}</p>
                    </div>
                    <strong className={`history-modal__amount ${transaction.isPositive ? 'history-modal__amount--positive' : ''}`}>
                      {transaction.isPositive ? '+' : '-'}{formatMoney(Math.abs(transaction.amount), transaction.currency)}
                    </strong>
                  </article>
                ))
              ) : (
                <div className="history-modal__empty">
                  Brak transakcji do wyświetlenia.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
