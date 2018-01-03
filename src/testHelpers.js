import promiseRetry from 'promise-retry'

export const expectToEventuallyNotExist = async (mountedComponent, selector) => {
    await promiseRetry((retry) => {
        try {
            mountedComponent.update()
            const resultMessage = mountedComponent.find(selector)
            expect(resultMessage.exists()).toEqual(false)
        } catch (e) {
            retry(e)
        }
    })
}
