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

  // An assertion on some values in an array
  function SomethingAssertion(targetArray, baseAssertion) {
    var somethingAssertion = this;
    // Add a customized version of Assertion properties
    Object.getOwnPropertyNames(Assertion.prototype).forEach(function (propertyName) {
      // Only add non-predefined properties
      if (propertyName === "something")
        return;
      var property = Object.getOwnPropertyDescriptor(Assertion.prototype, propertyName);

      // If the item is a chai assertion function
      if (typeof property.value === "function") {
        // Make it with a function that tries the assertion on every array element
        utils.addMethod(this, propertyName, function () {
          var object = utils.flag(this, "object"),
              asserter = property.value,
              args = arguments,
              assertionError;
          // The assertion's object should be a non-empty array
          expect(object).to.be.an('array');
          expect(object).to.be.not.empty;

          // Try the assertion on every array element
          for (var i = 0; i < object.length; i++) {
            // Create assertion for the current element
            var itemAssertion = new Assertion();
            utils.transferFlags(somethingAssertion, itemAssertion);
            utils.flag(itemAssertion, "object", object[i]);
            itemAssertion.assert = assert;
            // Return if the assertion succeeds, store the error otherwise
            try { return asserter.apply(itemAssertion, args); }
            catch (error) { assertionError = error; }
          }
          // Change the assertion message to an array viewpoint
          function assert(test, positive, negative, expected, actual) {
            utils.flag(itemAssertion, "object", object);
            Assertion.prototype.assert.call(this, test,
              positive.replace("#{this}", "an element of #{this}"),
              negative.replace("#{this}", "an element of #{this}"),
              expected, actual);
          }
          // Restore original assertion object
          // If we reach this point, no element that satisfies the assertion has been found
          throw assertionError;
        });
      }
      // If the item is a property or chainable method
      else if (typeof property.get === "function") {
        // Find out if it is chainable
        var isChainable = false;
        try { isChainable = typeof property.get.call({}) === "function"; }
        catch (error) { }

        // If not chainable, use it as a regular property on this SomethingAssertion
        if (!isChainable) {
          utils.addProperty(this, propertyName, property.get);
        }
        // If chainable, define as a chainable method on this SomethingAssertion
        else {
          utils.addChainableMethod(this, propertyName,
            function () { return property.get().apply(this, arguments); },
            function () { return property.get.call(this); }
          );
        }
      }
    }, this);

    // Set the assertion object to the array
    utils.flag(this, "object", targetArray);
  }

  // Define the something property on all Chai assertions
  Assertion.addProperty("something", function () {
    return new SomethingAssertion(this._obj, this);
  });
}));
