interface Payment {
  amount: number;
  beneficiary: string;
  description: string;
}

interface StoredPayment extends Payment {
  id: number;
}

interface StoredPayments {
  [key: number]: StoredPayment;
}

export { Payment, StoredPayment, StoredPayments };