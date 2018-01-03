import promiseRetry from 'promise-retry'

export const expectNotToEventuallyExist = async (mountedComponent, selector) => {
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
