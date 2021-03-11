import React, { useState, useEffect } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";

const Select = ({
  multiple,
  items,
  placeholder,
  outlined,
  selected,
  loading: parentLoading,
  onSelection,
  pageSize,
  onPage,
}) => {
  /** Input text and debounced text are used to more cleanly call an BE for additional data when user changes input. */
  const [inputText, setInputText] = useState(null);
  const [debouncedText, setDebouncedText] = useState(inputText);

  /** Used to display loading icon when calling a callback for new data. */
  const [loading, setLoading] = useState(false);

  /** Used to determine if we need to call a callback for a new page or not. */
  const [noMorePages, setNoMorePages] = useState(false);

  /* When input items change, checks if we can call for more pages and sets loading indicator to false if it was true */
  useEffect(() => {
    if (items.length % pageSize !== 0) {
      setNoMorePages(true);
    }

    setLoading(false);
  }, [items, pageSize]);

  /* Used for text debouncing. We don't want to call a BE for new data every time a user inputs a character. Instead, if the user writes fast, call a BE only if he
     stopped for 500ms.
   */
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedText(inputText);
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [inputText]);

  const handleInputChange = () => {
    if (debouncedText !== null) {
      setNoMorePages(false);
      onPage && onPage(debouncedText, 0, pageSize);
    }
  };
  useEffect(handleInputChange, [debouncedText]);

  /* Handling event that fires when user scrolls the dropdown to the bottom. 
    If we can call for more data, set the loading state to true and call a callback passed with the props. */
  const handleScroll = () => {
    if (!noMorePages) {
      setLoading(true);
      onPage(debouncedText, Math.floor(items.length / pageSize), pageSize);
    }
  };

  // Called when dropdown is open
  const handleOnOpen = () => {
    setNoMorePages(false);
    onPage(debouncedText, 0, pageSize);
  };

  // Called when dropdown is closed and input clears itself automatically
  const handleOnClose = () => {
    setInputText(null);
  };

  /* If we passed in selected elements to the component, check if its an array. Because, if its not, it needs to be. Even if there is only one selected element.
  If selected element is not passed in, undefined value will handle it. */
  const defaultValue = selected
    ? Array.isArray(selected)
      ? selected
      : [selected]
    : undefined;

  // Concatenates array of items and array of selected values without the duplicates.
  const uniqueAnArray = (array) => {
    var a = array.concat();
    for (var i = 0; i < a.length; ++i) {
      for (var j = i + 1; j < a.length; ++j) {
        if (a[i].value === a[j].value) a.splice(j--, 1);
      }
    }

    return a;
  };

  // Merges both arrays and gets unique items
  const optionItems = uniqueAnArray(items.concat(defaultValue));

  // If the outlined boolean was passed in, the component should be outlined, instead use standard.
  const textFieldVariant = outlined ? "outlined" : "standard";

  return (
    <Autocomplete
      onOpen={handleOnOpen}
      onClose={handleOnClose}
      multiple={multiple}
      options={optionItems}
      value={defaultValue}
      // Options should have label property!
      getOptionSelected={(to, cv) => to.value === cv.value}
      getOptionLabel={(option) => option.label}
      // Passing only the value to the callback, because we don't really need an event or reason.
      onChange={(event, value, reason) => onSelection(value)}
      onInput={(e) => setInputText(e.target.value)}
      renderInput={(params) => (
        <TextField
          {...params}
          variant={textFieldVariant}
          label={placeholder}
          placeholder={placeholder}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {parentLoading || loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
      // A workaround to handle scroll event in the material UI Autocomplete component.
      // GitHub issue to implement a proper pagination on Autocomplete component was opened a day or two ago.
      ListboxProps={{
        onScroll: (event) => {
          const listboxNode = event.currentTarget;
          if (
            listboxNode.scrollTop + listboxNode.clientHeight ===
            listboxNode.scrollHeight
          ) {
            handleScroll();
          }
        },
      }}
    />
  );
};

export default Select;
