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
    imageCaption?: LocalizedValue;
    thumbnail?: string;
    ingredient?: string[];
    abstract?: LocalizedValue;
    isPrimaryTopicOf: string;
    sugars?: MeasuredValue | MeasuredValue[];
    carbs?: MeasuredValue | MeasuredValue[];
    fat?: MeasuredValue | MeasuredValue[];
    fiber?: MeasuredValue | MeasuredValue[];
    protein?: MeasuredValue | MeasuredValue[];
    kj?: number | number[];
  };
};
