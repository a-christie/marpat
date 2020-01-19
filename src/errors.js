'use strict';

/*
 * @class MarpatError
 * @description an extension of the error class. THis error is used as the base marpat error.
 */
class MarpatError extends Error {
  constructor(message) {
    super(message);

    // Extending Error is weird and does not propagate `message`
    Object.defineProperty(this, 'message', {
      enumerable: false,
      value: message
    });

    Object.defineProperty(this, 'name', {
      enumerable: false,
      value: this.constructor.name
    });
  }
}

/*
 * @class ValidationError
 * @description an error indicating document didn't pass validation.
 */
class ValidationError extends MarpatError {
  constructor(message) {
    super(message);
  }
}

/* @class ConnectionError
 * @description An error indicating a connection to a data-store could not be made.
 */
class ConnectionError extends MarpatError {
  constructor(message) {
    super(message);
  }
}

module.exports = {
  ValidationError,
  ConnectionError
};
