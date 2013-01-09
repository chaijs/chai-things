# Chai Things
Chai Things adds support to [Chai](http://chaijs.com/) for assertions on array elements.

## Example
Use the `something` property on an array to test whether the assertion holds for one of its elements.

```javascript
// Although they are equal, two different { a: 'cat' } objects are not the same
[{ a: 'cat' }, { a: 'dog' }].should.not.include({ a: 'cat' })
// Chai Things allows us to test deep equality on one of the elements
[{ a: 'cat' }, { a: 'dog' }].should.include.something.that.deep.equals({ a: 'cat' })
// If the test fails, we get a descriptive message
[{ a: 'cat' }, { a: 'dog' }].should.include.something.that.deep.equals({ a: 'cow' })
/* expected an element of [ { a: 'cat' }, { a: 'dog' } ] to deeply equal { a: 'cow' } */
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
