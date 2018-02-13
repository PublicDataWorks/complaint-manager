export const mockLocalStorage = () => {
    global.window = {}
    window.localStorage = {
        getItem: jest.fn(),
        setItem: jest.fn()
    }
}

