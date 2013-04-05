# This file describes the behavior of the `all` property

describe "using all()", ->

describe "an object without length", ->
  nonLengthObject = {}

  it "fails to have all elements equal to 1", ->
    (() -> nonLengthObject.should.all.equal 1).
      should.throw "expected {} to have a property 'length'"

  it "fails not to have all elements equal to 1", ->
    (() -> nonLengthObject.should.all.equal 1).
      should.throw "expected {} to have a property 'length'"


describe "an object without numeric length", ->
  nonNumLengthObject = { length: 'a' }

  it "fails to have all elements equal to 1", ->
    (() -> nonNumLengthObject.should.all.equal 1).
      should.throw "all object length: expected 'a' to be a number"

  it "fails not to have all elements equal to 1", ->
    (() -> nonNumLengthObject.should.all.equal 1).
      should.throw "all object length: expected 'a' to be a number"


describe "an empty array's elements", ->
  emptyArray = []

  it "should trivially all equal 1", ->
    emptyArray.should.all.equal(1)

  it "should trivially all not equal 1", ->
    emptyArray.should.all.not.equal(1)


describe "the array [1, 1]'s elements", ->
  array = [1, 1]

  it "should all equal 1", ->
    array.should.all.equal 1

  it "should all not equal 2", ->
    array.should.all.not.equal 2

  it "should not all equal 2", ->
    array.should.not.all.equal 2

  it "should not all not equal 1", ->
    array.should.not.all.not.equal 1

  it "do not all equal 2", ->
    (() -> array.should.all.equal 2).
      should.throw "expected all elements of [ 1, 1 ] to equal 2"

  it "do not all *not* equal 1", ->
    (() -> array.should.all.not.equal 1).
      should.throw "expected all elements of [ 1, 1 ] to not equal 1"

  it "do not *not* all equal 1", ->
    (() -> array.should.not.all.equal 1).
      should.throw "expected not all elements of [ 1, 1 ] to equal 1"

  it "do not *not* all not equal 2", ->
    (() -> array.should.not.all.not.equal 2).
      should.throw "expected not all elements of [ 1, 1 ] to not equal 2"

describe "the array [1, 2]'s elements", ->
  array = [1, 2]

  it "should not all equal 1", ->
    array.should.not.all.equal 1

  it "should not all equal 2", ->
    array.should.not.all.equal 2

  it "should not all not equal 1", ->
    array.should.not.all.not.equal 1

  it "should not all not equal 2", ->
    array.should.not.all.not.equal 2

  it "do not all equal 1", ->
    (() -> array.should.all.equal 1).
      should.throw "expected all elements of [ 1, 2 ] to equal 1"

  it "do not all equal 2", ->
    (() -> array.should.all.equal 2).
      should.throw "expected all elements of [ 1, 2 ] to equal 2"

  it "do not all not equal 1", ->
    (() -> array.should.all.not.equal 1).
      should.throw "expected all elements of [ 1, 2 ] to not equal 1"

  it "do not all not equal 2", ->
    (() -> array.should.all.not.equal 2).
      should.throw "expected all elements of [ 1, 2 ] to not equal 2"
