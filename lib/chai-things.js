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

  var Assertion = chai.Assertion;
  var assert = chai.assert;

  // An assertion on some values in an array
  function SomethingAssertion(targetArray, baseAssertion) {
    // Add a customized version of Assertion properties
    Object.getOwnPropertyNames(Assertion.prototype).forEach(function (propertyName) {
      // Only add non-predefined properties
      if (propertyName in this)
        return;
      var property = Object.getOwnPropertyDescriptor(Assertion.prototype, propertyName);

      // If the item is a chai assertion function
      if (typeof property.value === "function") {
        // Make it with a function that tries the assertion on every array element
        utils.addMethod(this, propertyName, function () {
          var asserter = property.value,
              args = arguments,
              assertionError;
          // Try the assertion on every array element
          for (var i = 0; i < targetArray.length; i++) {
            // Set the assertion object to the array element
            utils.flag(this, "object", targetArray[i]);
            // Return if the assertion succeeds, store the error otherwise
            try {
              return asserter.apply(this, args);
            }
            catch (error) {
              assertionError = error;
            }
          }
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

    this._targetArray = targetArray;
  }

  // SomethingAssertion members
  SomethingAssertion.prototype = {
    // Change the assertion message to an array viewpoint
    assert: function (test, positive, negative, expected, actual) {
      utils.flag(this, "object", this._targetArray);
      Assertion.prototype.assert.call(this,
        test,
        positive.replace("#{this}", "an element of #{this}"),
        negative.replace("#{this}", "an element of #{this}"),
        expected,
        actual);
    },
    something: null,
  };

  // Define the something property on all Chai assertions
  Assertion.addProperty("something", function () {
    return new SomethingAssertion(this._obj, this);
  });
}));
