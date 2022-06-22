import Link from '@mui/material/Link';
import { LIGHTER_PRIMARY_COLOR } from '../constants';

type FlaticonLinkProps = {
  iconCategory: string;
  author: string;
};

export default function FlaticonLink({ iconCategory, author }: FlaticonLinkProps) {
  const lowercaseCategory = iconCategory.toLowerCase();
  const urlCategory = lowercaseCategory.replaceAll(' ', '-');

  return (
    <Link
      style={{ color: LIGHTER_PRIMARY_COLOR }}
      href={`https://www.flaticon.com/free-icons/${urlCategory}`}
      title={`${lowercaseCategory} icons`}
    >
      {iconCategory} icons created by {author} - Flaticon.
    </Link>
  );
}
