"use client";

import { ISocketProvider } from "@/components/providers/SocketProvider";
import React from "react";

export const SocketContext = React.createContext<ISocketProvider | null>(null);
