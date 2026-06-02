import { useMemo, useState } from 'react';
import type { DashboardData, DashboardProduct } from '../../../features/dashboard/types/dashboard.types';
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
  onAddProduct: () => void;
  onOpenTransfer: (sourceAccountId: string) => void;
  onRepayLoanEarly: (product: DashboardProduct) => void;
};

type TabType = 'all' | 'accounts' | 'cards' | 'credits';
const accountCategories = ['account', 'BankAccount'];
const cardCategories = ['card', 'Card'];
const creditCategories = ['credit', 'Loan'];

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat('pl-PL', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount) + ` ${currency}`;
}

export function ProductsSection({ dashboard, onAddProduct, onOpenTransfer, onRepayLoanEarly }: ProductsSectionProps) {
  const [isInfoPopupOpen, setIsInfoPopupOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [openMenuProductId, setOpenMenuProductId] = useState<string | null>(null);

  // filtr produktów
  const filteredProducts = useMemo(() => {
    switch (activeTab) {
      case 'accounts':
        return dashboard.products.filter((p) => accountCategories.includes(p.productCategory));
      case 'cards':
        return dashboard.products.filter((p) => cardCategories.includes(p.productCategory));
      case 'credits':
        return dashboard.products.filter((p) => creditCategories.includes(p.productCategory));
      default:
        return dashboard.products;
    }
  }, [dashboard.products, activeTab]);

  return (
    <>
      <section className="products-section">

        {/*  TABS */}
        <div className="products-tabs">
          <button
            type="button"
            className={`products-tab ${activeTab === 'all' ? 'products-tab--active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            Wszystko
          </button>

          <button
            type="button"
            className={`products-tab ${activeTab === 'accounts' ? 'products-tab--active' : ''}`}
            onClick={() => setActiveTab('accounts')}
          >
            Konta
          </button>

          <button
            type="button"
            className={`products-tab ${activeTab === 'cards' ? 'products-tab--active' : ''}`}
            onClick={() => setActiveTab('cards')}
          >
            Karty
          </button>

          <button
            type="button"
            className={`products-tab ${activeTab === 'credits' ? 'products-tab--active' : ''}`}
            onClick={() => setActiveTab('credits')}
          >
            Kredyty
          </button>

          <button
            type="button"
            className="products-tab products-tab--add"
            onClick={onAddProduct}
          >
            +
          </button>
        </div>

        {/* SCROLL CONTAINER */}
        <div className="products-scroll">

          {/* produkty */}
          {filteredProducts.map((product) => {
            const displayBalance = getProductDisplayBalance(product, dashboard.products);
            const isMenuOpen = openMenuProductId === product.productId;
            const isBankAccount = accountCategories.includes(product.productCategory);
            const isCreditCard = product.productCategory === 'Card' && product.productType === 'Credit';
            const isCashLoan = product.productCategory === 'Loan' && product.productType === 'Cash';
            const hasActions = isBankAccount || isCreditCard || isCashLoan;

            return (
              <article className="products-section__card" key={product.productId}>
                <div className="products-section__card-header">
                  <h3>{getProductDisplayName(product.productName)}</h3>
                  {hasActions && (
                    <div className="products-section__menu-wrap">
                      <button
                        type="button"
                        className="products-section__menu-button"
                        aria-label={`Akcje produktu ${getProductDisplayName(product.productName)}`}
                        aria-expanded={isMenuOpen}
                        onClick={() => setOpenMenuProductId(isMenuOpen ? null : product.productId)}
                      >
                        ⋮
                      </button>

                      {isMenuOpen && (
                        <div className="products-section__menu" role="menu">
                          {isBankAccount && (
                            <button
                              type="button"
                              role="menuitem"
                              onClick={() => {
                                setOpenMenuProductId(null);
                                onOpenTransfer(product.productId);
                              }}
                            >
                              Wykonaj przelew
                            </button>
                          )}

                          {isCreditCard && (
                            <button
                              type="button"
                              role="menuitem"
                              onClick={() => {
                                setOpenMenuProductId(null);
                                setIsInfoPopupOpen(true);
                              }}
                            >
                              Spłać kartę
                            </button>
                          )}

                          {isCashLoan && (
                            <button
                              type="button"
                              role="menuitem"
                              onClick={() => {
                                setOpenMenuProductId(null);
                                onRepayLoanEarly(product);
                              }}
                            >
                              Wcześniejsza spłata kredytu
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
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
              onClick={onAddProduct}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onAddProduct();
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
