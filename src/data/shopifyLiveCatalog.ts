import { Product, MegaMenuCategory } from "../types/index";
import { SHOPIFY_LIVE_PART1 } from "./shopifyPart1";
import { SHOPIFY_LIVE_PART2 } from "./shopifyPart2";
import { SHOPIFY_LIVE_PART3 } from "./shopifyPart3";
import { SHOPIFY_LIVE_PART4 } from "./shopifyPart4";
export { SHOPIFY_LIVE_CATEGORIES, SHOPIFY_SYNC_STATS } from "./shopifyMeta";

export const SHOPIFY_LIVE_PRODUCTS: Product[] = [
  ...SHOPIFY_LIVE_PART1,
  ...SHOPIFY_LIVE_PART2,
  ...SHOPIFY_LIVE_PART3,
  ...SHOPIFY_LIVE_PART4,
];
