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
      expect = chai.expect;

  /* `something` assertion function */
  function assertSomething() {
    // does not perform any assertion
  }

  /* `something` chain property */
  function chainSomething() {
    // `include` or `contains` should have been called before
    if (!utils.flag(this, "contains"))
      throw new Error("cannot use something without include or contains");
    // `something` has already been used
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

  // Define the `something` chainable assertion method
  Assertion.addChainableMethod("something", assertSomething, chainSomething);

  // Find all assertion methods
  var methodNames = Object.getOwnPropertyNames(Assertion.prototype)
    .filter(function (propertyName) {
      var property = Object.getOwnPropertyDescriptor(Assertion.prototype, propertyName);
      return typeof property.value  === "function";
    });

  // Override all methods to react on a possible `something` in the chain
  methodNames.forEach(function (methodName) {
    Assertion.overwriteMethod(methodName, function (_super) {
      return function () {
        var somethingFlags = utils.flag(this, "something");
        // Return if no `something` has been used in the chain
        if (!somethingFlags)
          return _super.apply(this, arguments);

        // The assertion's object for `something` should be an array
        var arrayObject = utils.flag(this, "object");
        expect(arrayObject).to.be.an("array");
        // In the negative case, an empty array means success
        var negate = somethingFlags.negate;
        if (negate && !arrayObject.length)
          return;
        // In the positive case, the array should not be empty
        expect(arrayObject).not.to.be.empty;

        // Try the assertion on every array element
        var assertionError;
        for (var i = 0; i < arrayObject.length; i++) {
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
          Assertion.prototype.assert.call(this, test,
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

  // Copy a `something` assertion to another item, using the specified assert function
  function copyAssertion(somethingAssertion, item, assert, negate) {
    var assertion = new Assertion(item);
    utils.transferFlags(somethingAssertion, assertion, false);
    assertion.assert = assert;
    // Remove the `something` flag; it should not be handled again
    utils.flag(assertion, "something", false);
    // Negate if necessary
    if (negate)
      utils.flag(assertion, "negate", !utils.flag(assertion, "negate"));
    return assertion;
  }
}));
