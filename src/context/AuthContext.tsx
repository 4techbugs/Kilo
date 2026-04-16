"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";

export interface User {
  mobile: string;
  name: string;
  email: string;
  pan: string;
  aadhaar: string;
  dob: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  employment: string;
  income: string;
  bankName: string;
  accountNo: string;
  ifsc: string;
  profileComplete: boolean;
  kycComplete: boolean;
  creditLimit: number;
  creditScore: number;
}

export interface Loan {
  id: string;
  amount: number;
  tenure: number;
  emi: number;
  interestRate: number;
  disbursedDate: string;
  nextDueDate: string;
  totalPaid: number;
  outstandingAmount: number;
  status: "active" | "closed" | "overdue";
  loanType: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loans: Loan[];
  notifications: Notification[];
  login: (mobile: string) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  applyLoan: (amount: number, tenure: number, loanType: string) => Loan;
  unreadCount: number;
  markAllRead: () => void;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "loan" | "payment" | "offer" | "alert";
}

const defaultUser: User = {
  mobile: "",
  name: "",
  email: "",
  pan: "",
  aadhaar: "",
  dob: "",
  gender: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  employment: "",
  income: "",
  bankName: "",
  accountNo: "",
  ifsc: "",
  profileComplete: false,
  kycComplete: false,
  creditLimit: 400000,
  creditScore: 742,
};

const sampleNotifications: Notification[] = [
  {
    id: "1",
    title: "Loan Approved! 🎉",
    message: "Your personal loan of ₹50,000 has been approved and will be disbursed within 2 hours.",
    time: "2 min ago",
    read: false,
    type: "loan",
  },
  {
    id: "2",
    title: "EMI Due Reminder",
    message: "Your EMI of ₹2,345 is due on 20th April. Please ensure sufficient balance.",
    time: "1 hour ago",
    read: false,
    type: "payment",
  },
  {
    id: "3",
    title: "Special Offer for You!",
    message: "Get instant loan up to ₹2 Lakh at just 1.5% monthly interest. Limited time offer!",
    time: "Yesterday",
    read: false,
    type: "offer",
  },
  {
    id: "4",
    title: "Credit Limit Increased",
    message: "Congratulations! Your credit limit has been increased to ₹4,00,000.",
    time: "2 days ago",
    read: true,
    type: "alert",
  },
  {
    id: "5",
    title: "Payment Successful",
    message: "Your EMI payment of ₹3,200 has been received. Thank you!",
    time: "3 days ago",
    read: true,
    type: "payment",
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    // Load from localStorage
    const stored = localStorage.getItem("kb_user");
    const storedLoans = localStorage.getItem("kb_loans");
    const updates: (() => void)[] = [];
    if (stored) {
      updates.push(() => {
        setUser(JSON.parse(stored));
        setIsAuthenticated(true);
      });
    }
    if (storedLoans) {
      updates.push(() => setLoans(JSON.parse(storedLoans)));
    }
    updates.forEach((fn) => fn());
  }, []);

  const login = (mobile: string) => {
    const newUser = { ...defaultUser, mobile };
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem("kb_user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setLoans([]);
    localStorage.removeItem("kb_user");
    localStorage.removeItem("kb_loans");
  };

  const updateUser = (data: Partial<User>) => {
    const updated = { ...user!, ...data };
    setUser(updated);
    localStorage.setItem("kb_user", JSON.stringify(updated));
  };

  const applyLoan = (amount: number, tenure: number, loanType: string): Loan => {
    const rate = 1.8; // monthly rate %
    const emi = Math.round((amount * rate / 100 * Math.pow(1 + rate / 100, tenure)) / (Math.pow(1 + rate / 100, tenure) - 1));
    const today = new Date();
    const disbursedDate = today.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    const nextDue = new Date(today);
    nextDue.setMonth(nextDue.getMonth() + 1);
    const nextDueDate = nextDue.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

    const newLoan: Loan = {
      id: `KBL${Date.now()}`,
      amount,
      tenure,
      emi,
      interestRate: rate,
      disbursedDate,
      nextDueDate,
      totalPaid: 0,
      outstandingAmount: amount,
      status: "active",
      loanType,
    };

    const updatedLoans = [newLoan, ...loans];
    setLoans(updatedLoans);
    localStorage.setItem("kb_loans", JSON.stringify(updatedLoans));
    return newLoan;
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loans,
        notifications,
        login,
        logout,
        updateUser,
        applyLoan,
        unreadCount,
        markAllRead,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
