/**
 * Utility function to sort education/experience records
 * Current records (null endDate) come first, then by most recent endDate
 *
 * @param {Array} records - Array of records to sort
 * @returns {Array} - Sorted array
 */
function sortByEndDate(records) {
  if (!records || !Array.isArray(records)) return records;

  return records.sort((a, b) => {
    // Current records (null endDate) come first
    if (a.endDate === null && b.endDate !== null) return -1;
    if (a.endDate !== null && b.endDate === null) return 1;

    // Both current, sort by startDate descending
    if (a.endDate === null && b.endDate === null) {
      return new Date(b.startDate) - new Date(a.startDate);
    }

    // Both completed, sort by endDate descending
    return new Date(b.endDate) - new Date(a.endDate);
  });
}

// Export the function
export { sortByEndDate };
