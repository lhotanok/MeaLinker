import { Link, Tooltip } from '@mui/material';
import humanizeDuration from 'humanize-duration';
import reactStringReplace from 'react-string-replace';
import { ALL_SENTENCES_REGEX, MAX_DESCRIPTION_CHARS } from '../../recipes/constants';
import { FacetItem } from '../../recipes/types/Facets';
import { PrepTime, RecipeIngredient } from '../../recipes/types/FullRecipe';
import {
  A_HREF_CONTENT_REGEX,
  A_HREF_GROUPS_REGEX,
  HREF_URL_REGEX,
  MAX_MINUTES_FOR_RAW_MINUTES_FORMAT,
} from '../constants';

export const addThousandsSeparator = (
  number: number,
  separator: string = ',',
): string => {
  const numberFragments: string[] = [];

  const numberReverse = Array.from(number.toString()).reverse();

  for (let index = 0; index < numberReverse.length; index++) {
    const digit = numberReverse[index];
    if (index !== 0 && index % 3 === 0) {
      numberFragments.push(separator);
    }

    numberFragments.push(digit);
  }

  return numberFragments.reverse().join('');
};

export const convertToReadableDate = (date: string): string => {
  if (!date) {
    return '';
  }

  const readableDate = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date)); // example date format: June 5, 2022

  return readableDate;
};

export const convertToReadableTime = (minutes: number): string => {
  const milliseconds = minutes * 60 * 1000;

  // Snippet from: https://www.npmjs.com/package/humanize-duration
  const shortEnglishHumanizer = humanizeDuration.humanizer({
    delimiter: ' ',
    language: 'shortEn',
    languages: {
      shortEn: {
        y: () => 'y',
        mo: () => 'mo',
        w: () => 'w',
        d: () => 'd',
        h: () => 'h',
        m: () => 'min',
        s: () => 's',
        ms: () => 'ms',
      },
    },
  });

  return shortEnglishHumanizer(milliseconds);
};

export const joinTimeEntries = (
  time: PrepTime,
  preferMinutes: boolean = false,
): string => {
  const { weeks = 0, days = 0, hours = 0, minutes = 0 } = time;
  let joinedTime = '';

  if (preferMinutes) {
    const totalMinutes = minutes + hours * 60 + days * 24 * 60 + weeks * 7 * 24 * 60;
    if (totalMinutes < MAX_MINUTES_FOR_RAW_MINUTES_FORMAT) {
      return `${totalMinutes} min`;
    }
  }

  if (time.weeks) {
    joinedTime += ` ${weeks} w`;
  }

  if (time.days) {
    joinedTime += ` ${days} d`;
  }

  if (time.hours) {
    joinedTime += ` ${hours} h`;
  }

  if (time.minutes) {
    joinedTime += ` ${minutes} min`;
  }

  return joinedTime.trim();
};

export const buildDescriptionPreview = (description: string, name: string): string => {
  const sentencesMatches = Array.from(description.matchAll(ALL_SENTENCES_REGEX));

  const sentences: string[] = [];

  let characters = name.length;

  for (const sentenceMatch of sentencesMatches) {
    const sentence = sentenceMatch[0];

    // MAX_DESCRIPTION_CHARS limit doesn't need to be met strictly
    if (characters + sentence.length > MAX_DESCRIPTION_CHARS) {
      break;
    }

    characters += sentence.length;
    sentences.push(sentence);
  }

  if (sentences.length === 0) {
    sentences.push(description.substring(0, MAX_DESCRIPTION_CHARS) + '...');
  }

  return sentences.join('');
};

export const shiftNonAmountIngredientsToBack = (
  ingredients: RecipeIngredient[],
): RecipeIngredient[] => {
  const amountIngredients: RecipeIngredient[] = [];
  const nonAmountIngredients: RecipeIngredient[] = [];

  ingredients.forEach((ingredient) => {
    if (ingredient.amount) {
      amountIngredients.push(ingredient);
    } else {
      nonAmountIngredients.push(ingredient);
    }
  });

  return amountIngredients.concat(nonAmountIngredients);
};

export const buildPlural = (textRoot: string, countable: number | string | any[]) => {
  const count = Array.isArray(countable) ? countable.length : countable;

  return count.toString() !== '1' ? `${count} ${textRoot}s` : `${count} ${textRoot}`;
};

/* Shuffles array elements in-place with Durstenfeld shuffle algorithm */
export const shuffleElements = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

export const escapeAHrefContent = (text: string) => {
  if (!text.match(/a href=/gi)) {
    return text;
  }

  const escapedText = reactStringReplace(text, A_HREF_GROUPS_REGEX, (match, i) => {
    const hrefUrlMatches = new RegExp(HREF_URL_REGEX).exec(match) || [];
    const hrefContentMatches = new RegExp(A_HREF_CONTENT_REGEX).exec(match) || [];

    const url = new URL(hrefUrlMatches[1]);
    const urlWithoutProtocol = url.host + url.pathname;

    return (
      <Tooltip
        key={i}
        title={`Visit ${urlWithoutProtocol.replace(/www./gi, '').replace(/\/$/gi, '')}`}
      >
        <Link href={hrefUrlMatches[1]}>{hrefContentMatches[1] || hrefUrlMatches[1]}</Link>
      </Tooltip>
    );
  });

  return escapedText;
};

export const buildItemsWithCount = (items: FacetItem[]): string[] => {
  const itemsWithCount = items.map((item) => `${item.name} (${item.count})`);

  return itemsWithCount;
};

export const getItemWithoutCount = (item: string): string => {
  return item.replace(/\([^)]*\)$/gi, '').replace(/(,)+/gi, '').trim();
};

export const getItemsWithoutCount = (items: string[]): string[] => {
  const itemsWithoutCount = items.map((item) => getItemWithoutCount(item));

  return itemsWithoutCount;
};
