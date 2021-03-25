# React Select

The Select control for [React](https://reactjs.com). Wrapper above [Material UI Autocomplete](https://material-ui.com/components/autocomplete/) that supports pagination on menu scroll.

## Installation and usage

### Build

| `yarn build` | Build the sample app |
| `yarn start` | Start the sample app server|
| `yarn test` | Run tests |

### With React Component

```js
import React from "react";
import Select from "select";

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
  { value: "blueberry", label: "Blueberry" },
];

class App extends React.Component {
  state = {
    loading: false,
    items: [],
    selectedItems: [
      { value: "vanilla", label: "Vanilla" },
      { value: "strawberry", label: "Strawberry" },
    ],
  };

  handleSelection = (selectedItems) => {
    this.setState({ selectedItems });
  };

  handlePageRequested = async (filter, page, pageSize) => {
    try {
      this.setState({ loading: true });

      const newItems = await // GET ITEMS

      this.setState({
        items: [
          ...(page > 0 ? items : []),
          ...newItems.slice(page * pageSize, (page + 1) * pageSize),
        ],
      });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { loading, items, selectedItems } = this.state;

    return (
      <Select
        multiple
        items={items}
        placeholder="Placeholder text"
        outlined
        loading={loading}
        selected={selectedItems}
        onSelection={this.handleSelection}
        pageSize={15}
        onPage={this.handlePageRequested}
      />
    );
  }
}
```

### With React Hooks

```js
import React, { useState } from "react";
import Select from "select";

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
  { value: "blueberry", label: "Blueberry" },
];

const App = () => {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([
    { value: "vanilla", label: "Vanilla" },
    { value: "strawberry", label: "Strawberry" },
  ]);

  const handlePageRequested = async (filter, page, pageSize) => {
    try {
      setLoading(true);

      const newItems = await // GET ITEMS

      setItems([
        ...(page > 0 ? items : []),
        ...newItems.slice(page * pageSize, (page + 1) * pageSize),
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Select
      multiple
      items={items}
      placeholder="Placeholder text"
      outlined
      loading={loading}
      selected={selectedItems}
      onSelection={setSelectedItems}
      pageSize={15}
      onPage={handlePageRequested}
    />
  );
};

export default App;
```

## Props

Common props you may want to specify include:

- `multiple` - allow the user to select multiple values
- `items` - specify the options the user can select from
- `placeholder` - change the text displayed when no option is selected
- `outlined` - specify if the select component is supposed to look outlined
- `loading` - specify if the component should be in a loading state
- `selected` - control the current value selected
- `onSelection` - subscribe to change event
- `onPage` - subscribe to requesting new page of options event
- `pageSize` - specify the number of options the component will request when

### Items

Option items passed to the component need to be of type:

```js
{ value: string, label: string }
```

### onPage

onPage property points to the callback function that will be called whenever component requests new page

```js
handlePageRequested: (filter: (string | null), page: number, pageSize: number) => Promise<void>
```

where:

- filter: (string | null)
  - a string that represents user input at the moment of requesting a new page. Value can be and will be null the first time component requests new data and as long as user did not type anything. After typing and emptying the input, value is an empty string.
- page: number:
  - index of the new page to paginate the data for.
- pageSize: number:
  - size of the page
