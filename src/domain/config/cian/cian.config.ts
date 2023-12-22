import { WebsiteConfig } from "../config.types";
import { Project } from "../project.enum";

export const CIAN_CONFIG: WebsiteConfig = {
  project: Project.CIAN,
  mainUrl: 'https://spb.cian.ru/cat.php',
  waitingSelectors: {
    main: '[data-name="RecommendationDesktop"]',
    rent: '[data-name="MainNew"]',
    link: '[data-name="CardComponent"] [data-testid="offer-card"] > a'
  },
  selectors: {
    title: '[data-name="OfferTitleNew"]',
    card: '[data-name="CardComponent"]',
    link: '[data-name="CardComponent"] [data-testid="offer-card"] > a',
    address: '[data-name="AddressContainer"]',
    pricePerMonth: '[data-testid="price-amount"]',
    commission: '[data-name="OfferFactsInSidebar"] > :nth-child(3) > :last-child',
    floor: '[data-name="ObjectFactoidsItem"]:nth-child(2) > :last-child > :last-child',
    totalFloor: '[data-name="ObjectFactoidsItem"]:nth-child(2) > :last-child > :last-child',
    square: '[data-name="OfferTitleNew"]',
    description: '[data-name="Description"]',
  }
}