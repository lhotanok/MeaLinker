export type LocalizedValue = {
  '@value': string;
  '@language': string;
};

export type MeasuredValue = {
  '@value': string;
  '@type': string;
};

export type FullIngredient = {
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
    sugars?: MeasuredValue | MeasuredValue[];
    carbs?: MeasuredValue | MeasuredValue[];
    fat?: MeasuredValue | MeasuredValue[];
    fiber?: MeasuredValue | MeasuredValue[];
    protein?: MeasuredValue | MeasuredValue[];
    kj?: number | number[];
  };
};
