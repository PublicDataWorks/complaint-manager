export const mockLocalStorage = () => {
  global.window = Object.create(window);
  window.localStorage.__proto__.getItem = jest.fn();
  window.localStorage.__proto__.setItem= jest.fn();
  window.localStorage.__proto__.removeItem= jest.fn();
};
