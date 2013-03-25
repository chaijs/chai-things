# This file describes the behavior of the `something` property

describe "using something", ->

  describe "without include", ->
    it "should throw an error", ->
      (() -> [].should.something.that.deep.equals 1).
        should.throw "cannot use something without include or contains"


describe "using something()", ->

  describe "without include", ->
    it "should throw an error", ->
      (() -> [].should.something()).
        should.throw "cannot use something without include or contains"


describe "an object without length", ->
  nonLengthObject = {}

  it "fails to include something", ->
    (() -> nonLengthObject.should.include.something()).
      should.throw "expected {} to have a property 'length'"

  it "fails not to include something", ->
    (() -> nonLengthObject.should.not.include.something()).
      should.throw "expected {} to have a property 'length'"

  it "fails to include something that equals 1", ->
    (() -> nonLengthObject.should.include.something.that.equals 1).
      should.throw "expected {} to have a property 'length'"

  it "fails not to include something that equals 1", ->
    (() -> nonLengthObject.should.not.include.something.that.equals 1).
      should.throw "expected {} to have a property 'length'"


describe "an object without numeric length", ->
  nonNumLengthObject = { length: 'a' }

  it "fails to include something", ->
    (() -> nonNumLengthObject.should.include.something()).
      should.throw "something object length: expected 'a' to be a number"

  it "fails not to include something", ->
    (() -> nonNumLengthObject.should.not.include.something()).
      should.throw "something object length: expected 'a' to be a number"

  it "fails to include something that equals 1", ->
    (() -> nonNumLengthObject.should.include.something.that.equals 1).
      should.throw "something object length: expected 'a' to be a number"

  it "fails not to include something that equals 1", ->
    (() -> nonNumLengthObject.should.not.include.something.that.equals 1).
      should.throw "something object length: expected 'a' to be a number"


describe "an empty array", ->
  emptyArray = []

  it "does not include something", ->
    (() -> emptyArray.should.include.something()).
      should.throw "expected [] to contain something"

  it "should not include something", ->
    emptyArray.should.not.include.something()

  it "does not include something that equals 1", ->
    (() -> emptyArray.should.include.something.that.equals 1).
      should.throw "expected [] to contain something"

  it "should not include something that equals 1", ->
    emptyArray.should.not.include.something.that.equals 1


describe "the array [{ a: 1 }, { b: 2 }]", ->
  array = [{ a: 1 }, { b: 2 }]

  it "should include something", ->
    array.should.include.something()

  it "does not *not* include something", ->
    (() -> array.should.not.include.something()).
      should.throw "expected [ { a: 1 }, { b: 2 } ] not to contain something"

  it "should include something that deep equals { b: 2 }", ->
    array.should.include.something.that.deep.equals { b: 2 }

  it "should include something that not deep equals { b: 2 }", ->
    array.should.include.something.that.not.deep.equals { b: 2 }

  it "does not include something that deep equals { c: 3 }", ->
    (() -> array.should.include.something.that.deep.equals { c: 3 }).
      should.throw "expected an element of [ { a: 1 }, { b: 2 } ] to deeply equal { c: 3 }"

  it "should not include something that deep equals { c : 3 }", ->
    array.should.not.include.something.that.deep.equals { c: 3 }

  it "should include something that not deep equals { c: 3 }", ->
    array.should.include.something.that.not.deep.equals { c: 3 }

  it "does not *not* include something that deep equals { b: 2 }", ->
    (() -> array.should.not.include.something.that.deep.equals { b: 2 }).
      should.throw "expected no element of [ { a: 1 }, { b: 2 } ] to deeply equal { b: 2 }"

  it "should include something with a property b of 2", ->
    array.should.include.something.with.property('b', 2)

  it "does not include something with a property b of 3", ->
    (() -> array.should.include.something.with.property('b', 3)).
      should.throw "expected an element of [ { a: 1 }, { b: 2 } ]" +
                   " to have a property 'b' of 3, but got 2"

  it "should not include something with a property b of 3", ->
    array.should.not.include.something.with.property('b', 3)


describe "the array [{ a: 1 }, { a: 1 }]", ->
  array = [{ a: 1 }, { a: 1 }]

  it "should not include something that not deep equals { a: 1 }", ->
    array.should.not.include.something.that.not.deep.equals { a: 1 }

  it "does not *not* include something that deep equals { a: 1 }", ->
    (() -> array.should.not.include.something.that.deep.equals { a: 1 }).
      should.throw "expected no element of [ { a: 1 }, { a: 1 } ] to deeply equal { a: 1 }"


describe "the array [[{ a: 1 }, { a: 1 }]]", ->
  array = [[{ a: 1 }, { a: 1 }]]

  it "should include something that includes something that deep equals { a: 1 }", ->
    array.should.include.something.that.includes.something.that.deep.equals { a: 1 }

  it "should not include something that not deep equals { a: 1 }", ->
    array.should.not.include.something.that.includes.something.that.not.deep.equals { a: 1 }

  it "does not *not* include something that deep equals { a: 1 }", ->
    (() -> array.should.not.include.something.that.includes.something.that.deep.equals { a: 1 }).
      should.throw "expected no element of [ [ { a: 1 }, { a: 1 } ] ] to satisfy the assertion"


describe "the string 'abcde'", ->
  string = 'abcde'

  it "should include something", ->
    string.should.include.something()

  it "does not *not* include something", ->
    (() -> string.should.not.include.something()).
      should.throw "expected 'abcde' not to contain something"

  it "should include something that equals 'a'", ->
    string.should.include.something.that.equals 'a'

  it "should include something that not equals 'a'", ->
    string.should.include.something.that.not.equals 'a'

  it "does not include something that equals 'x'", ->
    (() -> string.should.include.something.that.equals 'x').
      should.throw "expected an element of 'abcde' to equal 'x'"

  it "should not include something that equals 'x'", ->
    string.should.not.include.something.that.equals 'x'

  it "should include something that not equals 'x'", ->
    string.should.include.something.that.not.equals 'x'

  it "does not *not* include something that not equals 'x'", ->
    (() -> string.should.not.include.something.that.not.equals 'x').
      should.throw "expected no element of 'abcde' to not equal 'x'"
