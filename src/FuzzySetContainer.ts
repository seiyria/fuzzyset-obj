
import * as FuzzySet from 'fuzzyset.js';

export type FuzzySetMatch = [number, string];

export interface FuzzySetArguments {

  // fuzzyset arguments
  array?: any[],
  useLevenshtein?: boolean;
  gramSizeLower?: number;
  gramSizeUpper?: number;

  // my arguments
  key?: string;
}

const DEFAULT_SEARCH_KEY = 'key';

const FuzzySetDefaults = { 
  array: [], 
  useLevenshtein: true, 
  gramSizeLower: 2, 
  gramSizeUpper: 3,
  key: DEFAULT_SEARCH_KEY
}

export class FuzzySetContainer<ContainedObject = string> {

  private objHash: { [key: string]: ContainedObject } = {};
  private set: FuzzySet;
  private searchKey: string = DEFAULT_SEARCH_KEY;

  constructor(opts: FuzzySetArguments = {}) {
    const combinedOpts = Object.assign({}, FuzzySetDefaults, opts);

    this.searchKey = opts.key || DEFAULT_SEARCH_KEY;

    // if there is a specified array and it is an object array
    if(opts.array && opts.array[0] && typeof opts.array[0] !== 'string') {

      // validate that the first object has our search key on it
      if(!opts.array[0][this.searchKey]) {
        throw new Error(`Cannot specify object array without object having searchKey \`${opts.key}\` set.`);
      }
    }

    // if an array exists, remove it from the ctor opts, and re-add it afterwards, so it can go through parsing correctly
    const dataArray: any[] = opts.array;
    if(dataArray) {
      delete opts.array;
    }

    this.set = new FuzzySet(combinedOpts);

    if(dataArray) {
      dataArray.forEach(item => this.add(item));
    }
  }

  /**
   * Add an item to the fuzzySet
   * 
   * @param value the value to add to the FuzzySet
   */
  public add(value: ContainedObject): boolean {

    // it is an object
    if(value && typeof value === 'object') {

      if(!value[this.searchKey]) throw new Error(`Cannot add object ${JSON.stringify(value)} because it has no \`searchKey\` \`${this.searchKey}\` specified.`);

      // get the searchKey, add it to the set, and then track the whole object
      const valueKeyValue = value[this.searchKey];

      this.set.add(valueKeyValue);
      this.objHash[valueKeyValue] = value;

      return;
    }

    // it is a string
    return this.set.add(value);
  }

  /**
   * Get the first item that matches `searchValue` from the FuzzySet.
   * 
   * @param searchValue the search string
   * @param defaultValue the default value to return if no match is found
   * @param minScore the minimum match score required to return a value
   */
  public getFirst(searchValue: string, defaultValue: any = null, minScore: number = 0.33): ContainedObject {
    return this.getAll(searchValue, defaultValue, minScore)[0];
  }

  /**
   * Get the first raw item that matches `searchValue` from the FuzzySet.
   * 
   * @param searchValue the search string
   * @param defaultValue the default value to return if no match is found
   * @param minScore the minimum match score required to return a value
   */
  public getFirstRaw(searchValue: string, defaultValue: any = null, minScore: number = 0.33): FuzzySetMatch {
    return this.getAllRaw(searchValue, defaultValue, minScore)[0];
  }

  /**
   * Get all items that match `searchValue` from the FuzzySet.
   * 
   * @param searchValue the search string
   * @param defaultValue the default value to return if no match is found
   * @param minScore the minimum match score required to return a value
   */
  public getAll(searchValue: string, defaultValue: any = null, minScore: number = 0.33): ContainedObject {
    const value = this.set.get(searchValue, defaultValue, minScore);

    return value.map(([matchPercent, matchValue]) => {
      // (object) if there exists an object with a key matching the value, return the object
      if(this.objHash[matchValue]) return this.objHash[matchValue];
  
      // (string) just return the string value
      return matchValue;
    });
  }

  /**
   * Get all raw matches that match `searchValue` from the FuzzySet.
   * 
   * @param searchValue the search string
   * @param defaultValue the default value to return if no match is found
   * @param minScore the minimum match score required to return a value
   */
  public getAllRaw(searchValue: string, defaultValue: any = null, minScore: number = 0.33): FuzzySetMatch[] {
    return this.set.get(searchValue, defaultValue, minScore);
  }

  /**
   * Get the number of items from the FuzzySet.
   */
  public length(): number {
    return this.set.length();
  }

  /**
   * Check whether or not the FuzzySet is empty.
   */
  public isEmpty(): boolean {
    return this.set.isEmpty();
  }

  /**
   * Get the raw values from the FuzzySet.
   */
  public values(): ContainedObject[] {
    // if there exists an object, map to that - otherwise, just return the string
    return this.set.values().map(potentialKey => this.objHash[potentialKey] || potentialKey);
  }

  /**
   * Get a clone of the raw hash-stored values from the FuzzySetContainer.
   */
  public valuesHash(): { [key: string]: ContainedObject } {
    return Object.assign({}, this.objHash);
  }

}
