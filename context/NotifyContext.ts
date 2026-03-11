"use client";
import React, { createContext } from "react";
import { INotification } from "@/components/providers/NotifyProvider.tsx";

export interface INotifyContext {
  isNotify: boolean;
  setIsNotify: React.Dispatch<React.SetStateAction<boolean>>;
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  newNotify: number;
  setNewNotify: React.Dispatch<React.SetStateAction<number>>;
  notifications: INotification[];
  setNotifications: React.Dispatch<React.SetStateAction<INotification[]>>;
  countNotifications: number;
  setCountNotifications: React.Dispatch<React.SetStateAction<number>>;
}
export const NotifyContext = createContext<INotifyContext | null>(null);
