export const buildItemsAddedSnackbar = (
  addedItems: string[],
  itemsName: string,
): string => {
  const snackbarText =
    addedItems.length === 1
      ? `${addedItems[0]} added`
      : `${addedItems.length} ${itemsName} added`;

  return snackbarText;
};

export const buildItemsRemovedSnackbar = (
  original: string[],
  removed: string[],
  filtered: string[],
  itemsName: string,
): string => {
  let snackbarText = `${removed.length === 1
    ? removed[0]
    : `${removed.length} ${itemsName}`} removed`;

  if (filtered.length === 0) {
    snackbarText =
      original.length === 1
        ? `${original[0]} removed`
        : `${original.length === 2
            ? 'Both'
            : `All ${original.length}`} ${itemsName} removed`;
  }

  return snackbarText;
};
