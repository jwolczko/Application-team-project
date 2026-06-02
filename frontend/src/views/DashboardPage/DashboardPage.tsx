import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../app/store/hooks';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader/DashboardHeader';
import { useDashboard } from '../../features/dashboard/hooks/useDashboard';
import { SummarySection } from '../../components/dashboard/SummarySection/SummarySection';
import { ProductsSection } from '../../components/dashboard/ProductsSection/ProductsSection';
import { EventsSidebar } from '../../components/dashboard/EventsSidebar/EventsSidebar';
import { TransferPanel } from '../../components/transfers/TransferPanel/TransferPanel';
import { CreateProductModal } from '../../components/products/CreateProductModal/CreateProductModal';
import { repayCreditCard } from '../../features/dashboard/api/cardApi';
import { repayCashLoanEarly } from '../../features/dashboard/api/productApi';
import type { DashboardData, DashboardProduct } from '../../features/dashboard/types/dashboard.types';
import './DashboardPage.css';

export function DashboardPage() {
  const queryClient = useQueryClient();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const token = useAppSelector((state) => state.auth.token);
  const customerId = useAppSelector((state) => state.auth.customerId);
  const [isTransferPanelOpen, setIsTransferPanelOpen] = useState(false);
  const [transferSourceAccountId, setTransferSourceAccountId] = useState<string | undefined>();
  const { data, isLoading, isError, error } = useDashboard();
  const [isCreateProductModalOpen, setIsCreateProductModalOpen] = useState(false);

  const refreshDashboard = async () => {
    if (!customerId) {
      return;
    }

    await queryClient.invalidateQueries({ queryKey: ['dashboard', customerId] });
    await queryClient.refetchQueries({ queryKey: ['dashboard', customerId], type: 'active' });

    window.setTimeout(() => {
      void queryClient.invalidateQueries({ queryKey: ['dashboard', customerId] });
      void queryClient.refetchQueries({ queryKey: ['dashboard', customerId], type: 'active' });
    }, 2500);
  };

  const openTransferForAccount = (sourceAccountId: string) => {
    setTransferSourceAccountId(sourceAccountId);
    setIsTransferPanelOpen(true);
  };

  const handleCreditCardRepayment = async (product: DashboardProduct) => {
    if (!token) {
      return;
    }

    const confirmed = window.confirm(`Spłacić kartę ${product.productName}?`);
    if (!confirmed) {
      return;
    }

    try {
      await repayCreditCard(token, product.productId);
      await refreshDashboard();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Nie udało się spłacić karty.');
    }
  };

  const handleEarlyLoanRepayment = async (product: DashboardProduct) => {
    if (!token || !customerId) {
      return;
    }

    const mainAccount = data?.products.find(
      (candidate) => candidate.productCategory === 'BankAccount' && candidate.mainAccount === true,
    );

    if (!mainAccount) {
      window.alert('Nie znaleziono konta głównego do spłaty kredytu.');
      return;
    }

    const confirmed = window.confirm(`Spłacić wcześniej ${product.productName} kwotą ${product.balance.toFixed(2)} ${product.currency}?`);
    if (!confirmed) {
      return;
    }

    try {
      await repayCashLoanEarly(token, product.productId, mainAccount.productId);

      queryClient.setQueryData<DashboardData>(['dashboard', customerId], (currentDashboard) => {
        if (!currentDashboard) {
          return currentDashboard;
        }

        const updatedProducts = currentDashboard.products
          .filter((candidate) => candidate.productId !== product.productId)
          .map((candidate) => {
            if (candidate.productCategory === 'BankAccount' && candidate.mainAccount === true) {
              return {
                ...candidate,
                balance: candidate.balance - product.balance,
              };
            }

            return candidate;
          });

        return {
          ...currentDashboard,
          totalBalance: currentDashboard.totalBalance - (product.balance * 2),
          products: updatedProducts,
        };
      });

      await refreshDashboard();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Nie udało się spłacić kredytu.');
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return <div className="dashboard-page">Ladowanie danych dashboardu...</div>;
  }

  if (isError || !data) {
    return (
      <div className="dashboard-page">
        {error instanceof Error ? error.message : 'Nie udalo sie pobrac dashboardu.'}
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <DashboardHeader />

      {/* LAYOUT 3-KOLUMNOWY */}
      <div className="dashboard-page__content">

        {/* LEWA – SUMMARY */}
        <SummarySection
          dashboard={data}
          onOpenTransfer={() => setIsTransferPanelOpen(true)}
        />

        {/* ŚRODEK – PRODUCTS */}
        <div className="dashboard-page__center">
          <ProductsSection dashboard={data} 
          onAddProduct={() => setIsCreateProductModalOpen(true)}
          onOpenTransfer={openTransferForAccount}
          onRepayCreditCard={handleCreditCardRepayment}
          onRepayLoanEarly={handleEarlyLoanRepayment}
          />
        </div>

        {/* PRAWA – EVENTS */}
        <EventsSidebar dashboard={data} />

      </div>

      {isTransferPanelOpen && (
        <TransferPanel
          dashboard={data}
          initialSourceAccountId={transferSourceAccountId}
          onClose={() => {
            setIsTransferPanelOpen(false);
            setTransferSourceAccountId(undefined);
          }}
        />
      )}

      {isCreateProductModalOpen && (
  <CreateProductModal onClose={() => setIsCreateProductModalOpen(false)} />
)}
    </div>

    
  );
}
