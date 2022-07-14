import nutritionIcon from '../assets/pyramid-icon.png';
import caloriesIcon from '../assets/kcal-icon.png';
import carbohydratesIcon from '../assets/grain-icon.png';
import proteinIcon from '../assets/protein-icon.png';
import fatIcon from '../assets/fat-icon.png';
import fiberIcon from '../assets/fiber-icon.png';
import sugarIcon from '../assets/sugar-icon.png';
import sodiumIcon from '../assets/sodium-icon.png';
import cholesterolIcon from '../assets/cholesterol-icon.png';

export const PRIMARY_COLOR = '#dc1a22';
export const SECONDARY_COLOR = '#548664';
export const LIGHTER_PRIMARY_COLOR = '#ff6d75';
export const LIGHTER_SECONDARY_COLOR = '#82b692';

export const MAX_MINUTES_FOR_RAW_MINUTES_FORMAT = 300;
export const MAX_ITEMS_FOR_FAST_AUTOCOMPLETE_RENDERING = 2000;

export const A_HREF_GROUPS_REGEX = /(<a href=[^<]*<\/a>)/gim;
export const HREF_URL_REGEX = /href=\\?"([^"\\]*)/gim;
export const A_HREF_CONTENT_REGEX = />([^<]*)(?:<\/a>)?/gi;

export const ICON_PATHS = {
  nutritionIcon,
  caloriesIcon,
  carbohydratesIcon,
  proteinIcon,
  fatIcon,
  fiberIcon,
  sugarIcon,
  sodiumIcon,
  cholesterolIcon,
};
