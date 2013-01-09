describe "using something", ->

  describe "without include", ->
    it "should throw an error", ->
      (() -> [{ a: 1 }, { b: 2 }].should.something.that.deep.equals { b: 2 }).
        should.throw "cannot use something without include or contains"


  describe "when something has already been used", ->
    it "should throw an error", ->
      (() -> [].should.include.something.that.something).
        should.throw "cannot use something twice in an assertion"


describe "a non-array", ->
  nonArray = "not an array"

  it "fails to include something", ->
    (() -> nonArray.should.include.something.that.deep.equals { a: 1 }).
      should.throw "expected 'not an array' to be an array"

  it "fails not to include something", ->
    (() -> nonArray.should.not.include.something.that.deep.equals { a: 1 }).
      should.throw "expected 'not an array' to be an array"


describe "an empty array", ->
  emptyArray = []

  it "does not include something", ->
    (() -> emptyArray.should.include.something.that.deep.equals { a: 1 }).
      should.throw "expected [] not to be empty"

  it "should not include something", ->
    emptyArray.should.not.include.something.that.deep.equals { a: 1 }


describe "the array [{ a: 1 }, { b: 2 }]", ->
  array = [{ a: 1 }, { b: 2 }]

  it "should include something that deep equals { b: 2 }", ->
    array.should.include.something.that.deep.equals { b: 2 }

  it "should include something that not deep equals { c: 3 }", ->
    array.should.include.something.that.not.deep.equals { c: 3 }

  it "does not include something that deep equals { c: 3 }", ->
    (() -> array.should.include.something.that.deep.equals { c: 3 }).
      should.throw "expected an element of [ { a: 1 }, { b: 2 } ] to deeply equal { c: 3 }"

  it "should not include something that deep equals { c : 3 }", ->
    array.should.not.include.something.that.deep.equals { c: 3 }

  it "does not *not* include something that deep equals { b: 2 }", ->
    (() -> array.should.not.include.something.that.deep.equals { b: 2 }).
      should.throw "expected no element of [ { a: 1 }, { b: 2 } ] to deeply equal { b: 2 }"


describe "the array [{ a: 1 }, { a: 1 }]", ->
  array = [{ a: 1 }, { a: 1 }]

  it "should not include something that not deep equals { a: 1 }", ->
    array.should.not.include.something.that.not.deep.equals { a: 1 }

  it "does not *not* include something that deep equals { a: 1 }", ->
    (() -> array.should.not.include.something.that.deep.equals { a: 1 }).
      should.throw "expected no element of [ { a: 1 }, { a: 1 } ] to deeply equal { a: 1 }"
