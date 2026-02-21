"use client";

import { Mail, Lock, User } from "lucide-react";

interface AuthFormProps {
  isSignUp: boolean;
  isLoading: boolean;
  onSubmit: (data: any) => void;
}

export default function AuthForm({ isSignUp, isLoading, onSubmit }: AuthFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      {isSignUp && (
        <div className="relative group">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input 
            name="name" required type="text" placeholder="Full Name"
            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-slate-900 dark:text-white"
          />
        </div>
      )}
      <div className="relative group">
        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
        <input 
          name="email" required type="email" placeholder="Email Address"
          className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-slate-900 dark:text-white"
        />
      </div>
      <div className="relative group">
        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
        <input 
          name="password" required type="password" placeholder="Password"
          className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-slate-900 dark:text-white"
        />
      </div>
      
      <button 
        disabled={isLoading}
        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 dark:shadow-blue-900/20 transition-all disabled:opacity-50 active:scale-[0.98]"
      >
        {isLoading ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
      </button>
    </form>
  );
}