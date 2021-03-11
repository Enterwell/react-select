import React, { useState } from "react";

import EwSelect from "./EwSelect";

/** Helper function that delays our "api" calls so that we can test for loading indicators.
 * @param delay Amount to delay for
 */
function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

/** Static options for testing */
const options = [
  { value: "1", label: "A" },
  { value: "2", label: "B" },
  { value: "3", label: "C" },
  { value: "4", label: "D" },
  { value: "5", label: "E" },
  { value: "6", label: "F" },
  { value: "7", label: "G" },
  { value: "8", label: "H" },
  { value: "9", label: "I" },
  { value: "10", label: "J" },
  { value: "11", label: "K" },
  { value: "12", label: "L" },
  { value: "13", label: "M" },
  { value: "14", label: "N" },
  { value: "15", label: "NJ" },
  { value: "16", label: "O" },
  { value: "17", label: "P" },
  { value: "18", label: "R" },
  { value: "19", label: "S" },
  { value: "20", label: "T" },
  { label: "Duro", value: "duro1" },
  { label: "Marta", value: "Marta1" },
];

const App = () => {
  const [staticItems, setStaticItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([
    { label: "Duro", value: "duro1" },
    { label: "Marta", value: "Marta1" },
  ]);
  const [loading, setLoading] = useState(false);

  /** Callback called when selection changes.
   * @param value An array of options selected.
   */
  const handleSelection = (value) => {
    setSelectedItems(value);
  };

  /** Callback called when the new page is requested by the component.
   * @param filter Current input at the moment of requesting a new page.
   * @param pageIndex Index of the new page to paginate the data for.
   * @param pageSize Size of the page.
   */
  const handlePageRequested = async (filter, page, pageSize) => {
    try {
      setLoading(true);

      let filteredItems = [];
      if (filter === null) {
        filteredItems = options;
      } else {
        filteredItems = options.filter(
          (o) => o.label.toLowerCase().indexOf(filter.toLowerCase()) >= 0
        );
      }

      await sleep(1e3);
      setStaticItems([
        ...(page > 0 ? staticItems : []),
        ...filteredItems.slice(page * pageSize, (page + 1) * pageSize),
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <EwSelect
        multiple
        items={staticItems}
        placeholder="Select a Passenger"
        outlined
        loading={loading}
        selected={selectedItems}
        onSelection={handleSelection}
        pageSize={15}
        onPage={handlePageRequested}
      />
    </div>
  );
};

export default App;
