export type AddProductRequest = {
  productCategory: number;
  productName: string;
  currency: string;
  productType: number;
  creditLimit?: number | null;
  initialBalance?: number | null;
};

export type RepayLoanRequest = {
  sourceProductId: string;
  amount: number;
  currency: string;
  title: string;
};
