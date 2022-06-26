module.exports = {
  propsParser: require('react-docgen-typescript').withCustomConfig('./tsconfig.json')
    .parse,
  ignore: ['**/assets/**', '**/constants.tsx, **/**/*.png'],
  title: 'MeaLinker API Docs',
  template: {
    favicon: '900f1578d859a5cd26b9.png',
  },
  theme: {
    color: {
      sidebarBackground: '#548664',
      link: 'white',
      linkHover: '#222222',
    },
    sidebarWidth: 300,
  },
  ribbon: {
    url: 'https://github.com/lhotanok/MeaLinker',
    text: 'Fork me on GitHub',
  },
  styleguideDir: '../../docs',
  pagePerSection: true,
  sections: [
    {
      name: 'Recipes',
      sectionDepth: 2,
      sections: [
        {
          name: 'Recipe Search',
          components: 'src/recipes/components/Search/**/*.tsx',
          sectionDepth: 2,
        },
        {
          name: 'Recipe Detail',
          components: 'src/recipes/components/Detail/**/*.tsx',
          sectionDepth: 2,
        },
      ],
    },
    {
      name: 'Ingredients',
      components: 'src/ingredients/components/**/*.tsx',
      sectionDepth: 2,
    },
    {
      name: 'Shared',
      components: 'src/shared/components/**/*.tsx',
      sectionDepth: 2,
    },
  ],
};
