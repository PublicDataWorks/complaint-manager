export const mockLocalStorage = () => {
  global.window = Object.create(window);
  window.localStorage.__proto__ = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn()
  };
};
