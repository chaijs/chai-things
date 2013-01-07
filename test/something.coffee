describe "include.something", ->

  describe "without negation", ->
    it "passes if an equal element exists", ->
      [{ a: 1 }, { b: 2 }].should.include.something.that.deep.equals { b: 2 }

    it "does not pass if an equal element does not exist", ->
      (() -> [{ a: 1 }, { b: 2 }].should.include.something.that.deep.equals { c: 3 }).
        should.throw("expected an element of [ { a: 1 }, { b: 2 } ] to deeply equal { c: 3 }")
