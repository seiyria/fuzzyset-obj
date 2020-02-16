# FuzzySetObject

A simple upgrade to [fuzzyset.js](https://glench.github.io/fuzzyset.js/) to allow usage of objects instead of strings only.

# Install

`npm i fuzzyset-obj`

# General Usage Information

When using this library, you can either create a `FuzzySetContainer` that contains strings, or objects, but not both. All arguments will take both.

## Usage (JavaScript)

```js
import { FuzzySetContainer } from 'fuzzyset-obj';

const fuzzySet = new FuzzySetContainer();

// add an item to the set
fuzzySet.add('Test');
fuzzySet.add('Apples are great');
fuzzySet.add('Bananas are great');

// search the set for one item
const res = fuzzySet.getFirst('te'); // returns 'Test'

// search the set for multiple items, getting them in descending order
const res = fuzzySet.getAll('are great') // returns ['Apples are great', 'Bananas are great']
```

## Usage (TypeScript)
```ts
import { FuzzySetContainer } from 'fuzzyset-obj';

interface Fruit {
  fruit: string
}

const fuzzySet = new FuzzySetContainer<Fruit>({ key: 'fruit' });

// add an item to the set
fuzzySet.add({ fruit: 'Banana' });
fuzzySet.add({ fruit: 'Blueberry' });

// search the set for one item
const res = fuzzySet.getFirst('Banber'); // returns { fruit: 'Banana' }

// search the set for multiple items, getting them in descending order
const res = fuzzySet.getAll('Banber'); // returns [{ fruit: 'Banana' }, { fruit: 'Blueberry' }]
```

# Contributing

Feel free to contribute features by sending a pull request.
