import { ReactNode } from 'react';

export enum AppType {
  TERMINAL = 'TERMINAL',
  EXPLORER = 'EXPLORER',
  BROWSER = 'BROWSER',
  SETTINGS = 'SETTINGS',
  CALCULATOR = 'CALCULATOR',
  EDITOR = 'EDITOR'
}

export interface AppDefinition {
  id: AppType;
  name: string;
  icon: ReactNode;
  component: React.FC<AppComponentProps>;
  defaultWidth: number;
  defaultHeight: number;
}

export interface WindowInstance {
  id: string;
  appType: AppType;
  title: string;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface AppComponentProps {
  windowId: string;
}

export interface FileSystemItem {
  name: string;
  type: 'file' | 'folder';
  size?: string;
  date: string;
}