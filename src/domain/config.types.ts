import { Project } from "./project.enum";

export interface PageSelector {
  title?: string;
  card?: string;
  link?: string;

  address?: string;
  pricePerMonth?: string;
  commission?: string;
  floor?: string;
  totalFloor?: string;
  square?: string;
  description?: string;
}

export interface WaitSelector {
  main?: string;
  rent?: string;
  link?: string;
}

export interface WebsiteConfig {
  mainUrl: string;
  project: Project;
  selectors: PageSelector
  waitingSelectors: WaitSelector;
}