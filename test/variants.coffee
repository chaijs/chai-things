# This file describes the behavior of `something` variants

describe "the array [{ a: 1 }, { b: 2 }]", ->
  array = [{ a: 1 }, { b: 2 }]

  it "should include a thing", ->
    array.should.include.a.thing()

  it "should include a thing that deep equals { b: 2 }", ->
    array.should.include.a.thing.that.deep.equals { b: 2 }

  it "should include an item", ->
    array.should.include.an.item()

  it "should include an item that deep equals { b: 2 }", ->
    array.should.include.an.item.that.deep.equals { b: 2 }

  it "should include one that deep equals { b: 2 }", ->
    array.should.include.one.that.deep.equals { b: 2 }

  it "should include some", ->
    array.should.include.some()

  it "should include some that deep equal { b: 2 }", ->
    array.should.include.some.that.deep.equal { b: 2 }

describe "the empty array", ->
  emptyArray = []

  it "should not include any", ->
    emptyArray.should.not.include.any()

  it "should not include any that deep equal { b: 2 }", ->
    emptyArray.should.not.include.any.that.deep.equal { b: 2 }
