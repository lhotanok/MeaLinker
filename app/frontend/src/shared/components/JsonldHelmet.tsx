import { Helmet } from 'react-helmet-async';

type JsonldHelmetProps = {
  jsonld: string;
  typeLabel: string;
};

export default function JsonldHelmet({ jsonld, typeLabel }: JsonldHelmetProps) {
  return (
    <Helmet>
      <script className={`${typeLabel}-jsonld`} type='application/ld+json'>
        {jsonld}
      </script>
    </Helmet>
  );
}
