import React, { createContext } from "react";
import { JSONContent } from "@tiptap/core";

export interface IUser {
  login: string;
  avatar: string | null;
  role: string;
  _count: {
    MessagesPosts: number;
  };
}
export interface IHistory {
  id: string;
  idUser: string;
  updateAt: Date;
  idMessage: string;
  beforeText: JSONContent;
  afterText: JSONContent;
}
export interface IHistoryMessages {
  HistoryMessage: IHistory[];
  _count: {
    HistoryMessage: number;
  };
}
export type ReactionType = "up" | "like" | "down";
export interface IReaction {
  id: string;
  createdAt: Date;
  messagesPostsId: string;
  reactionType: ReactionType;
  fromUser: {
    role: string;
    id: string;
    login: string;
    avatar: string | null;
  };
}
export interface IMessage {
  reactions: IReaction[];
  id: string;
  createdAt: Date;
  idUser: string;
  text: JSONContent;
  idPosts: string;
  Users: IUser;
  Posts: {
    title: string;
    user: {
      login: string;
      avatar: string | null;
      role: string;
    };
    createdAt: Date;
    _count: {
      MessagesPosts: number;
    };
    locked: boolean;
  };
  HistoryMessage: {
    updateAt: Date;
  }[];
}
export interface IPost {
  _count: {
    MessagesPosts: number;
  };
  pinned: boolean;
  locked: boolean;
  title: string;
  id: string;
  lastUpdate: Date;
  user: {
    login: string;
    role: string;
  };
  createdAt: Date;
  MessagesPosts: {
    id: string;
    createdAt: Date;
    Users: {
      login: string;
      role: string;
      avatar: string | null;
    };
    _count: {
      MessagesPosts: number;
    };
  }[];
}
export interface IPosts {
  id: string;
  _count: {
    posts: number;
  };
  title: string;
  change: boolean;
  posts: IPost[];
}
export interface IMessMain {
  createdAt: Date;
  Users: {
    role: string;
    login: string;
    avatar: string | null;
  };
}
export interface IPostsMain {
  id: string;
  idSubCategories: string;
  title: string;
  MessagesPosts: IMessMain[];
}
export interface ISubCategories {
  id: string;
  title: string;
  visible: boolean;
  _count: {
    posts: number;
  };
  idCategories: string;
  icon: string;
  change: boolean;
  position: number;
  posts: IPostsMain[];
}
export interface ICategories {
  id: string;
  title: string;
  visible: string;
  position: number;
  subCategories: ISubCategories[];
}
export interface ICategoriesContext {
  categories: ICategories[];
  setCategories: React.Dispatch<React.SetStateAction<ICategories[]>>;
}
export const CategoriesContext = createContext<ICategoriesContext | null>(null);
