export type LocalizedValue = {
  '@value': string;
  '@language': string;
};

export type MeasuredValue = {
  '@value': string;
  '@type': string;
};

export type FullIngredient = {
  _id: string;
  _rev: string;
  foodComId: string;
  name: string;
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
    country?: string;
    imageCaption?: LocalizedValue;
    thumbnail?: string;
    ingredient?: string[];
    abstract?: LocalizedValue;
    isPrimaryTopicOf: string;
    sugars?: MeasuredValue;
    carbs?: MeasuredValue;
    fat?: MeasuredValue;
    fiber?: MeasuredValue;
    protein?: MeasuredValue;
    kj?: number;
  };
};
