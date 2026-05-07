import { useMemo, useState } from 'react';
import type { DashboardData } from '../../../features/dashboard/types/dashboard.types';
import {
  getProductAmountLabel,
  getProductCategoryLabel,
  getProductDisplayBalance,
  getProductDisplayName,
  getProductSubtitle,
  getProductTypeLabel,
} from '../../../features/dashboard/productPresentation';
import { InfoPopup } from '../../../shared/ui/InfoPopup/InfoPopup';
import './ProductsSection.css';

type ProductsSectionProps = {
  dashboard: DashboardData;
};

type TabType = 'all' | 'accounts' | 'cards' | 'credits';

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat('pl-PL', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount) + ` ${currency}`;
}

export function ProductsSection({ dashboard }: ProductsSectionProps) {
  const [isInfoPopupOpen, setIsInfoPopupOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('all');

  // filtr produktów
  const filteredProducts = useMemo(() => {
    switch (activeTab) {
      case 'accounts':
        return dashboard.products.filter((p) => p.productCategory === 'account');
      case 'cards':
        return dashboard.products.filter((p) => p.productCategory === 'card');
      case 'credits':
        return dashboard.products.filter((p) => p.productCategory === 'credit');
      default:
        return dashboard.products;
    }
  }, [dashboard.products, activeTab]);

  return (
    <>
      <section className="products-section">

        {/*  TABS */}
        <div className="products-tabs">
          <div
            className={`products-tab ${activeTab === 'all' ? 'products-tab--active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            Wszystko
          </div>

          <div
            className={`products-tab ${activeTab === 'accounts' ? 'products-tab--active' : ''}`}
            onClick={() => setActiveTab('accounts')}
          >
            Konta
          </div>

          <div
            className={`products-tab ${activeTab === 'cards' ? 'products-tab--active' : ''}`}
            onClick={() => setActiveTab('cards')}
          >
            Karty
          </div>

          <div
            className={`products-tab ${activeTab === 'credits' ? 'products-tab--active' : ''}`}
            onClick={() => setActiveTab('credits')}
          >
            Kredyty
          </div>

          <div
            className="products-tab"
            onClick={() => setIsInfoPopupOpen(true)}
          >
            +
          </div>
        </div>

        {/* SCROLL CONTAINER */}
        <div className="products-scroll">

          {/* produkty */}
          {filteredProducts.map((product) => {
            const displayBalance = getProductDisplayBalance(product, dashboard.products);

            return (
              <article className="products-section__card" key={product.productId}>
                <div className="products-section__card-header">
                  <h3>{getProductDisplayName(product.productName)}</h3>
                  <button type="button">⋮</button>
                </div>

                <div className="products-section__subtitle">
                  {getProductSubtitle(product)}
                </div>

                <div className="products-section__label">
                  {getProductCategoryLabel(product.productCategory)} • {getProductTypeLabel(product.productType)}
                </div>

                <div className="products-section__label">
                  {getProductAmountLabel(product)}
                </div>

                <div className="products-section__amount">
                  {formatMoney(displayBalance.amount, displayBalance.currency)}
                </div>
              </article>
            );
          })}

          {/* ADD CARD */}
          {(activeTab === 'all') && (
            <article
              className="products-section__add-card"
              role="button"
              tabIndex={0}
              onClick={() => setIsInfoPopupOpen(true)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  setIsInfoPopupOpen(true);
                }
              }}
            >
              <div className="products-section__plus">＋</div>
              <h3>Dodaj produkt</h3>
            </article>
          )}

        </div>
      </section>

      {isInfoPopupOpen && (
        <InfoPopup
          message="Funkcjonalność nie jest jeszcze zaimplementowana"
          onClose={() => setIsInfoPopupOpen(false)}
        />
      )}
    </>
  );
}