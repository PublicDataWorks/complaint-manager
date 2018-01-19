import promiseRetry from 'promise-retry'

export const changeInput = (mountedComponent, inputSelector, value) => {
    const input = mountedComponent.find(inputSelector)
    input.simulate('change', {target: {value}})
}

export const findDropdownOption = (mountedComponent, dropdownSelector, optionSelector) => {
    const dropdown = mountedComponent.find(dropdownSelector).find('[role="button"]');
    dropdown.simulate('click')

    const option = mountedComponent.find(optionSelector)
    return option
}

export const selectDropdownOption = (mountedComponent, dropdownSelector, optionSelector) => {
    const option = findDropdownOption(mountedComponent, dropdownSelector, optionSelector)
    option.simulate('click')
}

export const expectEventuallyNotToExist = async (mountedComponent, selector) => {
    await retry(() => {
        mountedComponent.update()
        const shouldNotExist = mountedComponent.find(selector)
        expect(shouldNotExist.exists()).toEqual(false)
    })
}

export const containsText = (mountedComponent, selector, expectedText) => {
    const containsText = mountedComponent.find(selector).filterWhere(node => node.text() === expectedText)
    return expect(containsText.length).not.toEqual(0)
}

export const retry = async (retriableFunction) => {
    await promiseRetry((doRetry) => {
        try {
            retriableFunction();
        } catch (e) {
            doRetry(e)
        }
    }, {retries: 2})
}

