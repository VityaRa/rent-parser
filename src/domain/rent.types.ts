import { WebsiteConfig } from "./config.types";

export interface IPage {
  config: WebsiteConfig;
  instance: string;
}

export interface ISubway {
  place: string;
  time: string;
}

export interface IGeo {
  general: string;
  address?: string;
  subway?: ISubway[];
}

export interface IRentData {
  id: number | string;
  title?: string;
  geo: IGeo;
  price: string;
}
