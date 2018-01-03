import promiseRetry from 'promise-retry'

export const expectEventuallyNotToExist = async (mountedComponent, selector) => {
    await promiseRetry((retry) => {
        try {
            mountedComponent.update()
            const shouldNotExist = mountedComponent.find(selector)
            expect(shouldNotExist.exists()).toEqual(false)
        } catch (e) {
            retry(e)
        }
    })
}
