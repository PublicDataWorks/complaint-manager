export const deleteDuplicateRowsByName = async (
  duplicateRows,
  originalRows,
  transaction
) => {
  for (let i = 0; i < duplicateRows.length; i++) {
    const duplicateRow = duplicateRows[i];
    try {
      for (let j = 0; j < originalRows.length; j++) {
        const originalRow = originalRows[j];
        if (originalRow.name === duplicateRow.name) {
          await duplicateRow.destroy();
        }
      }
    } catch (error) {
      throw new Error(
        `Error while deleting duplicate row where the id is ${duplicateRow.id}. \nInternal Error: ${error}`
      );
    }
  }
};
