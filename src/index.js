
import fs from 'fs';

import parse from 'shift-parser';
import reduce, { MonoidalReducer } from "shift-reducer";
import Lev from "levenshtein";

export default function(source, minLength = 6, threshold = 4) {
  let ast = parse(source);

  let identifiers = reduce(new IdentifierGetter, ast);

  let identifierCount = identifiers.reduce((a, n) => { a[n] = ++a[n] || 1; return a; }, {});

  let uniqueIdentifiers = Object.keys(identifierCount);

  let matches = findNearestMatches(uniqueIdentifiers, minLength, threshold);

  let nonEmptyMatches = Object.keys(matches)
                              .reduce((a, n) => {if (matches[n].length) a[n] = matches[n]; return a; }, {});

  return nonEmptyMatches;
}


class IdentifierGetter extends MonoidalReducer {
  constructor() {
    super({
      empty : function() { return []; },
      concat : function(a) { return this.concat(a); }
    });
  }

  reduceIdentifierExpression(node) {
    return [ node.identifier.name ];
  }
}

function findNearestMatches(uniqueIdentifiers, minLength = 6, threshold = 4) {
  let rv = {},
      copy = uniqueIdentifiers.concat(),
      string, compare, l;

  while (string = copy.shift()) {
    if (string.length <= minLength) continue;
    rv[string] = rv[string] || [];

    for (let j = 0; j < copy.length; j++) {
      compare = copy[j];
      l = new Lev(string, compare);
      if (l.distance < threshold) {
        rv[compare] = rv[compare] || [];
        try {
          rv[string].push(compare);
          rv[compare].push(string);
        } catch (e) {
          // reserved word skipped;
        }
      }
    }
  }
  return rv;
}

