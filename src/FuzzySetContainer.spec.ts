
import test from 'ava-ts';

import { FuzzySetContainer } from './FuzzySetContainer';

interface Fruit {
  fruit: string;
}

test.beforeEach(t => {
  const fruits = ['Banana', 'Blueberry', 'Raspberry', 'Cherry', 'Apple'];
  t.context.fuzzySetStrings = new FuzzySetContainer<string>({ array: fruits });
  t.context.fuzzySetObjects = new FuzzySetContainer<Fruit>({ key: 'fruit', array: fruits.map(f => ({ fruit: f }) )});
});

test('FuzzySetContainer is initialized correctly with an array of strings', t => {
  const fuzzySet: FuzzySetContainer = t.context.fuzzySetStrings;

  t.is(fuzzySet.length(), 5);
  t.is(fuzzySet.values()[0], 'Banana');
});

test('FuzzySetContainer is initialized correctly with an array of objects', t => {
  const fuzzySet: FuzzySetContainer<Fruit> = t.context.fuzzySetObjects;

  t.is(fuzzySet.length(), 5);
  t.is(fuzzySet.values()[0].fruit, 'Banana');
});

test('FuzzySetContainer throws an error with an invalid array of objects', t => {
  t.throws(() => new FuzzySetContainer({ array: [{ test: 'Fail' }] }));
});

test('FuzzySetContainer adds a new string successfully', t => {
  const fuzzySet: FuzzySetContainer<string> = t.context.fuzzySetStrings;

  t.is(fuzzySet.length(), 5);
  fuzzySet.add('Dragonfruit');
  t.is(fuzzySet.length(), 6);
});

test('FuzzySetContainer adds a new object successfully', t => {
  const fuzzySet: FuzzySetContainer<Fruit> = t.context.fuzzySetObjects;

  t.is(fuzzySet.length(), 5);
  fuzzySet.add({ fruit: 'Dragonfruit' });
  t.is(fuzzySet.length(), 6);
});

test('FuzzySetContainer retrieves string values correctly', t => {
  const fuzzySet: FuzzySetContainer<string> = t.context.fuzzySetStrings;

  t.is(fuzzySet.values().length, 5);
  t.is(Object.keys(fuzzySet.valuesHash()).length, 0);
});

test('FuzzySetContainer retrieves object values correctly', t => {
  const fuzzySet: FuzzySetContainer<Fruit> = t.context.fuzzySetObjects;

  t.is(fuzzySet.values().length, 5);
  t.is(Object.keys(fuzzySet.valuesHash()).length, 5);
});

