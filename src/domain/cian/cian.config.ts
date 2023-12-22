import { WebsiteConfig } from "../config.types";
import { Project } from "../project.enum";

export const CIAN_CONFIG: WebsiteConfig = {
  project: Project.CIAN,
  mainUrl: 'https://spb.cian.ru/snyat-kvartiru-1-komn-ili-2-komn/',
  waitingSelectors: {
    main: '[data-name="RecommendationDesktop"]',
    rent: '[data-name="MainNew"]',
    link: '[data-name="CardComponent"] [data-testid="offer-card"] a'
  },
  selectors: {
    title: '',
    card: '[data-name="CardComponent"]',
    link: '[data-name="CardComponent"] [data-testid="offer-card"] a'
  }
}