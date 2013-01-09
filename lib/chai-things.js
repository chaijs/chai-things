(function (chaiModule) {
  "use strict";
  // NodeJS
  if (typeof require === "function" && typeof exports === "object" && typeof module === "object")
    module.exports = chaiModule;
  // AMD
  else if (typeof define === "function" && define.amd)
    define(function () { return chaiModule; });
  // Other
  else
    chai.use(chaiModule);
}(function chaiAsPromised(chai, utils) {
  "use strict";

  var Assertion = chai.Assertion,
      assertionPrototype = Assertion.prototype,
      expect = chai.expect;

  // Handles the `something` chain property
  function chainSomething() {
    // `include` or `contains` should have been called before
    if (!utils.flag(this, "contains"))
      throw new Error("cannot use something without include or contains");
    // `something` should not have been used already
    if (utils.flag(this, "something"))
      throw new Error("cannot use something twice in an assertion");
    // flag that this is a `something` chain
    utils.flag(this, "something", {
      // remember if `something` was negated
      negate: utils.flag(this, "negate")
    });
    // reset the negation flag for the coming assertion
    utils.flag(this, "negate", false);
  }

  // Performs the `something()` assertion
  function assertSomething() {
    // Undo the flags set by the `something` chain property
    var somethingFlags = utils.flag(this, "something");
    utils.flag(this, "something", false);
    utils.flag(this, "negate", somethingFlags.negate);

    // The assertion's object for `something` should be array-like
    var object = utils.flag(this, "object");
    expect(object).to.have.property("length");
    expect(object.length).to.be.a("number", "something object length");

    // The object should contain something
    this.assert(object.length > 0,
      "expected #{this} to contain something",
      "expected #{this} not to contain something"
    );
  }

  // Find all assertion methods
  var methodNames = Object.getOwnPropertyNames(assertionPrototype)
    .filter(function (propertyName) {
      var property = Object.getOwnPropertyDescriptor(assertionPrototype, propertyName);
      return typeof property.value  === "function";
    });

  // Override all methods to react on a possible `something` in the chain
  methodNames.forEach(function (methodName) {
    Assertion.overwriteMethod(methodName, function (_super) {
      return function () {
        // Return if no `something` has been used in the chain
        var somethingFlags = utils.flag(this, "something");
        if (!somethingFlags)
          return _super.apply(this, arguments);
        // Clear the `something` flag; it should not be handled again
        utils.flag(this, "something", false);

        // The assertion's object for `something` should be array-like
        var arrayObject = utils.flag(this, "object");
        expect(arrayObject).to.have.property("length");
        var length = arrayObject.length;
        expect(length).to.be.a("number", "something object length");

        // In the negative case, an empty array means success
        var negate = somethingFlags.negate;
        if (negate && !length)
          return;
        // In the positive case, the array should not be empty
        new Assertion(arrayObject).assert(length,
          "expected #{this} to contain something");

        // Try the assertion on every array element
        var assertionError;
        for (var i = 0; i < length; i++) {
          // Test whether the element satisfies the assertion
          var item = arrayObject[i],
              itemAssertion = copyAssertion(this, item, somethingAssert);
          assertionError = null;
          try { _super.apply(itemAssertion, arguments); }
          catch (error) { assertionError = error; }
          // If the element satisfies the assertion
          if (!assertionError) {
            // In case of negation, this is a witness that the assertion fails
            if (negate) {
              // Generate an error by asserting the negated item assertion
              var negItemAssertion = copyAssertion(this, item, somethingAssert, true);
              _super.apply(negItemAssertion, arguments);
            }
            // In the positive case, this is a witness that the assertion holds
            return;
          }
        }
        // Changes the assertion message to an array viewpoint
        function somethingAssert(test, positive, negative, expected, actual) {
          var replacement = (negate ? "no" : "an") + " element of #{this}";
          utils.flag(this, "object", arrayObject);
          assertionPrototype.assert.call(this, test,
            (negate ? negative : positive).replace("#{this}", replacement),
            (negate ? positive : negative).replace("#{this}", replacement),
            expected, actual);
        }
        // If we reach this point, no element that satisfies the assertion has been found
        if (!negate)
          throw assertionError;
      };
    });
  });

  // Copies an assertion to another item, using the specified assert function
  function copyAssertion(baseAssertion, item, assert, negate) {
    var assertion = new Assertion(item);
    utils.transferFlags(baseAssertion, assertion, false);
    assertion.assert = assert;
    if (negate)
      utils.flag(assertion, "negate", !utils.flag(assertion, "negate"));
    return assertion;
  }

  // Define the `something` chainable assertion method and its variants
  ["something", "thing", "item", "one", "some", "any"].forEach(function (methodName) {
    if (!(methodName in assertionPrototype))
      Assertion.addChainableMethod(methodName, assertSomething, chainSomething);
  });
}));
