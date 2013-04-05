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
      expect = chai.expect,
      containPropertyDesc = Object.getOwnPropertyDescriptor(assertionPrototype, 'contain');
  Object.defineProperty(assertionPrototype, 'contains', containPropertyDesc);
  Object.defineProperty(assertionPrototype, 'includes', containPropertyDesc);

  // Handles the `something` chain property
  function chainSomething() {
    // `include` or `contains` should have been called before
    if (!utils.flag(this, "contains"))
      throw new Error("cannot use something without include or contains");
    // Flag that this is a `something` chain
    var lastSomething = this, newSomething = {};
    while (utils.flag(lastSomething, "something"))
      lastSomething = utils.flag(lastSomething, "something");
    // Transfer all the flags to the new `something` and remove them from `this`
    utils.transferFlags(this, newSomething, false);
    for (var prop in this.__flags)
      if (!/^(?:something|object|ssfi|message)$/.test(prop))
        delete this.__flags[prop];

    // Add the `newSomething` to the `lastSomething` in the chain.
    utils.flag(lastSomething, "something", newSomething);
    // Clear the `something` flag from `newSomething`.
    utils.flag(newSomething, "something", false);
  }

  // Performs the `something()` assertion
  function assertSomething() {
    // Undo the flags set by the `something` chain property
    var somethingFlags = utils.flag(this, "something");
    utils.flag(this, "something", false);
    if (somethingFlags)
      utils.transferFlags(somethingFlags, this, true);

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

  // Handles the `all` chain property
  function chainAll() {
    // Flag that this is an `all` chain
    var lastAll = this, newAll = {};
    while (utils.flag(lastAll, "all"))
      lastAll = utils.flag(lastAll, "all");
    // Transfer all the flags to the new `all` and remove them from `this`
    utils.transferFlags(this, newAll, false);
    for (var prop in this.__flags)
      if (!/^(?:all|object|ssfi|message)$/.test(prop))
        delete this.__flags[prop];

    // Add the `newAll` to the `lastAll` in the chain.
    utils.flag(lastAll, "all", newAll);
    // Clear the `all` flag from `newAll`.
    utils.flag(newAll, "all", false);
  }

  // Find all assertion methods
  var methodNames = Object.getOwnPropertyNames(assertionPrototype)
    .filter(function (propertyName) {
      var property = Object.getOwnPropertyDescriptor(assertionPrototype, propertyName);
      return typeof property.value  === "function";
    });

  // Override all assertion methods
  methodNames.forEach(function (methodName) {

    // Override the method to react on a possible `something` in the chain
    Assertion.overwriteMethod(methodName, function (_super) {
      return function somethingMethod() {
        // Return if no `something` has been used in the chain
        var somethingFlags = utils.flag(this, "something");
        if (!somethingFlags)
          return _super.apply(this, arguments);
        // Use the nested `something` flag as the new `something` flag for this.
        utils.flag(this, "something", utils.flag(somethingFlags, "something"));

        // The assertion's object for `something` should be array-like
        var arrayObject = utils.flag(this, "object");
        expect(arrayObject).to.have.property("length");
        var length = arrayObject.length;
        expect(length).to.be.a("number", "something object length");

        // In the negative case, an empty array means success
        var negate = utils.flag(somethingFlags, "negate");
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
          try { somethingMethod.apply(itemAssertion, arguments); }
          catch (error) { assertionError = error; }
          // If the element satisfies the assertion
          if (!assertionError) {
            // In case the base assertion is negated, a satisfying element
            // means the base assertion ("no element must satisfy x") fails
            if (negate) {
              if (!utils.flag(somethingFlags, "something")) {
                // If we have no child `something`s then assert the negated item assertion,
                // which should fail and throw an error
                var negItemAssertion = copyAssertion(this, item, somethingAssert, true);
                somethingMethod.apply(negItemAssertion, arguments);
              }
              // Throw here if we have a child `something`,
              // or if the negated item assertion didn't throw for some reason
              new Assertion(arrayObject).assert(false,
                  "expected no element of #{this} to satisfy the assertion");
            }
            // In the positive case, a satisfying element means the assertion holds
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

    // Override the method to react on a possible `all` in the chain
    Assertion.overwriteMethod(methodName, function (_super) {
      return function allMethod() {
        // Return if no `all` has been used in the chain
        var allFlags = utils.flag(this, "all");
        if (!allFlags)
          return _super.apply(this, arguments);
        // Use the nested `all` flag as the new `all` flag for this.
        utils.flag(this, "all", utils.flag(allFlags, "all"));

        // The assertion's object for `all` should be array-like
        var arrayObject = utils.flag(this, "object");
        expect(arrayObject).to.have.property("length");
        var length = arrayObject.length;
        expect(length).to.be.a("number", "all object length");

        // In the positive case, an empty array means success
        var negate = utils.flag(allFlags, "negate");
        if (!negate && !length)
          return;

        // Try the assertion on every array element
        var assertionError, item, itemAssertion;
        for (var i = 0; i < length; i++) {
          // Test whether the element satisfies the assertion
          item = arrayObject[i];
          itemAssertion = copyAssertion(this, item, allAssert);
          assertionError = null;
          try { allMethod.apply(itemAssertion, arguments); }
          catch (error) { assertionError = error; }
          // If the element does not satisfy the assertion
          if (assertionError) {
            // In the positive case, this means the assertion has failed
            if (!negate) {
                // If we have no child `all`s then throw the item's assertion error
              if (!utils.flag(allFlags, "all"))
                throw assertionError;
              // Throw here if we have a child `all`,
              new Assertion(arrayObject).assert(false,
                  "expected all elements of #{this} to satisfy the assertion");
            }
            // In the negative case, a failing element means the assertion holds
            return;
          }
        }
        // Changes the assertion message to an array viewpoint
        function allAssert(test, positive, negative, expected, actual) {
          var replacement = (negate ? "not " : "") + "all elements of #{this}";
          utils.flag(this, "object", arrayObject);
          assertionPrototype.assert.call(this, test,
            (negate ? negative : positive).replace("#{this}", replacement),
            (negate ? positive : negative).replace("#{this}", replacement),
            expected, actual);
        }
        // If we reach this point, no failing element has been found
        if (negate) {
          // Assert the negated item assertion which should fail and throw an error
          var negItemAssertion = copyAssertion(this, item, allAssert, true);
          allMethod.apply(negItemAssertion, arguments);
          // Throw here if the negated item assertion didn't throw for some reason
          new Assertion(arrayObject).assert(false,
            "expected not all elements of #{this} to satisfy the assertion");
        }
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
  // Define the `all` chainable assertion method
  Assertion.addChainableMethod("all", null, chainAll);
}));
