# Chai Things
Chai Things adds support to [Chai](http://chaijs.com/) for assertions on array elements.

## Example
Use the `something` property on an array to test whether the assertion holds for one of its elements.

```javascript
// Although they are equal, two different { a: 1 } objects are not the same
[{ a: 1 }, { b: 2 }].should.not.include({ a: 1 })
// Chai Things allows us to test deep equality on one of the elements
[{ a: 1 }, { b: 2 }].should.include.something.that.deep.equals({ b: 2 })
// If the test fails, we get a descriptive message
[{ a: 1 }, { b: 2 }].should.include.something.that.deep.equals({ c: 3 })
/* expected an element of [ { a: 1 }, { b: 2 } ] to deeply equal { c: 3 } */
```

You are free to choose the syntactic variant you like most:

```javascript
[4, 11, 15].should.include.one.below(10)
[4, 11, 15].should.contain.some.above(10)
[4, 11, 15].should.not.contain.any.above(20)
[{ a: 'cat' }, { a: 'dog' }].should.contain.a.thing.with.property('a', 'cat')
[{ a: 'cat' }, { a: 'dog' }].should.contain.an.item.with.property('a', 'dog')
```

## Installation and usage
```bash
$ npm install chai-things
```

```javascript
var chai = require("chai");
chai.should();
chai.use(require('chai-things'));
```
