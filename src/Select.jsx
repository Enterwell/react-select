import React, { useState, useEffect } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';

/**
 * Produces copy of array without duplicates (value property used for queality comparison).
 *
 * @param {*} array The input array.
 * @return {item} Returns new array.
 */
const distinctByValue = (array) => {
  const a = array.concat();
  for (let i = 0; i < a.length; ++i) {
    for (let j = i + 1; j < a.length; ++j) {
      if (a[i].value === a[j].value) a.splice(j--, 1);
    }
  }

  return a;
};

/**
 * The select component.
 *
 * @param {*} props The props.
 * @return {*} Returns the component.
 */
const Select = (props) => {
  const {
    multiple,
    items = [],
    placeholder,
    outlined,
    selected = [],
    loading: parentLoading,
    label,
    onSelection,
    pageSize,
    onPage,
    size,
    debounce = 200,
    noOptionsText = 'No options',
    loadingOptionsText = 'Loading...'
  } = props;

  // Input text and debounced text are used to more cleanly
  // call an BE for additional data when user changes input.
  const [inputText, setInputText] = useState(null);
  const [debouncedText, setDebouncedText] = useState(inputText);

  // Used to display loading icon when calling a callback for new data.
  const [loading, setLoading] = useState(false);

  /**
     * When input items change, checks if we can call for more pages
     * and sets loading indicator to false if it was true.
     * @returns {void}
     */
  const handleItemsChange = () => setLoading(false);

  /**
     * Used for text debouncing. We don't want to call a BE for new data
     * every time a user inputs a character. Instead, if the user writes fast,
     * call a BE only if he stopped for set amount of time.
     * @returns {void}
     */
  const handleInputChange = () => {
    const timerId = setTimeout(() => {
      setDebouncedText(inputText);
    }, debounce);

    return () => clearTimeout(timerId);
  };

  /**
     * Handle the debounced input change.
     * This will request first page from server.
     * @returns {void}
     */
  const handleDebouncedInputChange = () => {
    if (debouncedText !== null) {
      onPage(debouncedText, 0, pageSize);
    }
  };

  useEffect(handleItemsChange, [items, pageSize]);
  useEffect(handleInputChange, [inputText]);
  useEffect(handleDebouncedInputChange, [debouncedText]);

  /**
     * Handle the list scroll.
     * When user scroll to end, next page is requested.
     * @return {void}
     */
  const handleScroll = () => {
    // If there is more pages to load, request next page
    if (items.length % pageSize === 0) {
      setLoading(true);
      onPage(debouncedText, Math.floor(items.length / pageSize), pageSize);
    }
  };

  /**
     * Handle the dropdown opening.
     * Request initial page.
     * @return {void}
     */
  const handleOnOpen = () => {
    onPage(debouncedText, 0, pageSize);
  };

  /**
     * Handle the dropwdown closed.
     * Clears the input text.
     * @return {void}
     */
  const handleOnClose = () => {
    setInputText(null);
    setDebouncedText(null);
  };

  // If we passed in selected elements to the component, check if its an array.
  // Because, if its not, it needs to be.
  const defaultValue = Array.isArray(selected)
    ? selected
    : [selected];

  // Merges both arrays and gets unique items
  const optionItems = distinctByValue(items.concat(defaultValue))
    .map((o) => ({ ...o, text: o.value }));

  return (
    <Autocomplete
      onOpen={handleOnOpen}
      onClose={handleOnClose}
      multiple={multiple}
      options={optionItems}
      value={defaultValue}
      size={size || 'medium'}
      noOptionsText={parentLoading || loading ? loadingOptionsText : noOptionsText}
      // Options should have label property!
      getOptionSelected={(to, cv) => to.value === cv.value}
      getOptionLabel={(option) => option.label}
      // Passing only the value to the callback, because we don't really need an event or reason.
      onChange={(event, value) => onSelection(value)}
      onInput={(e) => setInputText(e.target.value)}
      renderInput={(params) => (
        <TextField
          {...params}
          variant={outlined ? 'outlined' : 'standard'}
          label={label}
          placeholder={placeholder}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {parentLoading || loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            )
          }}
        />
      )}
            // A workaround to handle scroll event in the material UI Autocomplete component.
            // GitHub issue to implement a proper pagination onAutocomplete
            // component was opened few days ago.
      ListboxProps={{
        onScroll: (event) => {
          const listboxNode = event.currentTarget;
          if (listboxNode.scrollTop + listboxNode.clientHeight === listboxNode.scrollHeight) {
            handleScroll();
          }
        }
      }}
    />
  );
};

export default Select;
