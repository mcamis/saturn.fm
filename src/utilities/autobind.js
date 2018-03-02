/* eslint-disable no-param-reassign */
/**
 * A helper function for making sure that instances of classes don't have to worry about what `this` means
 * (Can also be used to reduce constructor boilerplate in React components)
 * @param {object}
 * @returns {object} - input object, with each method's `this` bound to the instance
 */
export default function autobind(obj) {
  Object.getOwnPropertyNames(obj.constructor.prototype).forEach(prop => {
    if (typeof obj[prop] === 'function') {
      obj[prop] = obj[prop].bind(obj);
    }
  });
}
