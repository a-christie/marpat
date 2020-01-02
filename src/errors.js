'use strict';

/*
 * Base Camo error.
 * 
 * Adapted from es6-error package.
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
 * Error indicating document didn't pass validation.
 */
class ValidationError extends MarpatError {
  constructor(message) {
    super(message);
  }
}

/*
 * Error indicating document didn't pass validation.
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
