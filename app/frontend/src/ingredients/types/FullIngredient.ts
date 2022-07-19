import { SimpleIngredient } from './SimpleIngredient';

export type LocalizedValue = {
  '@value': string;
  '@language': string;
};

export type MeasuredValue = {
  '@value': string;
  '@type': string;
};

export type Category = {
  name: string;
  ingredients: SimpleIngredient[];
};

export type FullIngredient = {
  name: string;
  structured: {
    categories: Category[];
    madeOfIngredients: SimpleIngredient[];
  };
  jsonld: {
    '@context': Record<
      string,
      {
        '@id': string;
        '@type'?: string;
      }
    >;
    '@type': string;
    '@id': string;
    label: LocalizedValue;
    comment?: LocalizedValue;
    subject?: string[];
    country?: LocalizedValue | string;
    countryOfOrigin?: LocalizedValue;
    imageCaption?: LocalizedValue;
    thumbnail?: string;
    image?: string | string[];
    color?: LocalizedValue | LocalizedValue[];
    subclassOf?: string | string[];
    unicodeChar?: LocalizedValue | LocalizedValue[];
    hasParts?: string | string[];
    description?: LocalizedValue;
    ingredient?: string | string[];
    madeFromMaterial?: string | string[];
    abstract?: LocalizedValue;
    isPrimaryTopicOf: string;
    sugars?: MeasuredValue | MeasuredValue[];
    carbs?: MeasuredValue | MeasuredValue[];
    fat?: MeasuredValue | MeasuredValue[];
    fiber?: MeasuredValue | MeasuredValue[];
    protein?: MeasuredValue | MeasuredValue[];
    kj?: number | number[];
    sameAs?: string | string[];
  };
};
