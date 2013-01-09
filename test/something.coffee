describe "include.something", ->

  describe "without negation", ->
    it "asserts whether the object is an array", ->
      (() -> "not an array".should.include.something.that.deep.equals { a: 1 }).
        should.throw "expected 'not an array' to be an array"

    it "asserts whether the array is non-empty", ->
      (() -> [].should.include.something.that.deep.equals { a: 1 }).
        should.throw "expected [] not to be empty"

    it "passes if an equal element exists", ->
      [{ a: 1 }, { b: 2 }].should.include.something.that.deep.equals { b: 2 }

    it "passes if a non-equal element exists (double negation)", ->
      [{ a: 1 }, { b: 2 }].should.include.something.that.not.deep.equals { c: 3 }

    it "does not pass if an equal element does not exist", ->
      (() -> [{ a: 1 }, { b: 2 }].should.include.something.that.deep.equals { c: 3 }).
        should.throw "expected an element of [ { a: 1 }, { b: 2 } ] to deeply equal { c: 3 }"

  describe "with negation", ->
    it "asserts whether the object is an array", ->
      (() -> "not an array".should.not.include.something.that.deep.equals { a: 1 }).
        should.throw "expected 'not an array' to be an array"

    it "passes on empty arrays", ->
      [].should.not.include.something.that.deep.equals { a: 1 }

    it "passes if an equal element does not exist", ->
      [{ a: 1 }, { b: 2 }].should.not.include.something.that.deep.equals { c: 3 }

    it "passes if a non-equal element does not exist (double negation)", ->
      [{ a: 1 }, { a: 1 }].should.not.include.something.that.not.deep.equals { a: 1 }

    it "does not pass if an equal element does exist", ->
      (() -> [{ a: 1 }, { b: 2 }].should.not.include.something.that.deep.equals { b: 2 }).
        should.throw "expected no element of [ { a: 1 }, { b: 2 } ] to deeply equal { b: 2 }"

describe "something in wrong context", ->

  describe "without include", ->
    it "should throw an error", ->
      (() -> [{ a: 1 }, { b: 2 }].should.something.that.deep.equals { b: 2 }).
        should.throw "cannot use something without include or contains"

  describe "when something has already been used", ->
    it "should throw an error", ->
      (() -> [].should.include.something.that.something).
        should.throw "cannot use something twice in an assertion"
