import { Avatar, Icon, Link, Stack, SvgIcon, Tooltip } from '@mui/material';
import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import reactStringReplace from 'react-string-replace';
import { A_HREF_GROUPS_REGEX, PRIMARY_COLOR } from '../../../../shared/constants';
import { escapeAHrefContent } from '../../../../shared/tools/value-prettifier';
import { RecipeIngredient } from '../../../types/FullRecipe';
import MenuBookIcon from '@mui/icons-material/MenuBook';

type HighlightedIngredientProps = {
  ingredient: RecipeIngredient;
};

export default function HighlightedIngredient({
  ingredient,
}: HighlightedIngredientProps) {
  const { identifier, label = { '@value': '' }, thumbnail, text } = ingredient;

  const navigate = useNavigate();

  const handleViewClick = (ingredientId: string) => {
    navigate(`/ingredients/${ingredientId}`);
  };

  const lowercaseLabel = label['@value'].toLowerCase();
  const containsHrefLink = text.match(A_HREF_GROUPS_REGEX);

  const escapedText = containsHrefLink ? escapeAHrefContent(text) : text;

  const highlightedText =
    !lowercaseLabel || containsHrefLink
      ? escapedText
      : reactStringReplace(text, lowercaseLabel, (match, index) => {
          if (index === 1) {
            return (
              <Tooltip
                key={index}
                placement='bottom-start'
                title={
                  <Stack>
                    See more
                    {thumbnail && (
                      <Avatar
                        onClick={() => handleViewClick(identifier)}
                        src={thumbnail}
                        alt={match}
                        sx={{ bgcolor: 'transparent' }}
                      >
                        <MenuBookIcon fontSize='large' />
                      </Avatar>
                    )}
                  </Stack>
                }
              >
                <Link
                  key={index}
                  color={PRIMARY_COLOR}
                  onClick={() => handleViewClick(identifier)}
                >
                  {match}
                </Link>
              </Tooltip>
            );
          } else {
            return match;
          }
        });

  return <Fragment>{highlightedText}</Fragment>;
}
