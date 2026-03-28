import { WineType, Country } from './wine';

export interface WineTemplate {
  id: string;
  name: string;
  type: WineType;
  country: Country;
  region: string;
  subRegion?: string;
  grapeVariety: string;
  producers: string[];
  aliases?: string[];
  minVintage?: number;
  maxVintage?: number;
  avgPrice?: number;
  description?: string;
  agingRequirement?: string;
  classification?: string;
}

export interface WineSearchResult {
  wine: WineTemplate;
  score: number;
}
