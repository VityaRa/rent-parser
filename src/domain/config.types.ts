import { Project } from "./project.enum";

export interface PageSelector {
  title?: string;
  card?: string;
  link?: string;
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