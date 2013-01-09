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
    // flag that this is a something chain
    utils.flag(this, "something", true);
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
        // Return if no `something` has been used in the chain
        if (!utils.flag(this, "something"))
          return _super.apply(this, arguments);

        // The assertion's object for `something` should be a non-empty array
        var arrayObject = utils.flag(this, "object");
        expect(arrayObject).to.be.an("array");
        expect(arrayObject).to.be.not.empty;

        // Try the assertion on every array element
        var assertionError;
        for (var i = 0; i < arrayObject.length; i++) {
          // Create assertion for the current element
          var itemAssertion = new Assertion(arrayObject[i]);
          utils.transferFlags(this, itemAssertion, false);
          itemAssertion.assert = somethingAssert;
          // Remove the `something` flag; it should not be handled again
          utils.flag(itemAssertion, "something", false);

          // Return if the assertion succeeds, store the error otherwise
          try { return _super.apply(itemAssertion, arguments); }
          catch (error) { assertionError = error; }
        }
        // Changes the assertion message to an array viewpoint
        function somethingAssert(test, positive, negative, expected, actual) {
          utils.flag(this, "object", arrayObject);
          Assertion.prototype.assert.call(this, test,
            positive.replace("#{this}", "an element of #{this}"),
            negative.replace("#{this}", "an element of #{this}"),
            expected, actual);
        }
        // If we reach this point, no element that satisfies the assertion has been found
        throw assertionError;
      };
    });
  });

}));
