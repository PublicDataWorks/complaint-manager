import promiseRetry from 'promise-retry'

export const changeInput = (mountedComponent, inputSelector, value) => {
    const input = mountedComponent.find(inputSelector).last()
    input.simulate('change', {target: {value}})
}

export const findDropdownOption = (mountedComponent, dropdownSelector, optionName) => {
    const dropdown = mountedComponent
        .find(dropdownSelector)
        .find('[role="button"]')
        .first();

    dropdown.simulate('click')

    const option = mountedComponent
        .find('[role="option"]')
        .filterWhere(option => option.text() === optionName)
        .last()

    return option
}

export const selectDropdownOption = (mountedComponent, dropdownSelector, optionName) => {
    const option = findDropdownOption(mountedComponent, dropdownSelector, optionName)
    option.simulate('click')
}

export const expectEventuallyNotToExist = async (mountedComponent, selector) => {
    await retry(() => {
        mountedComponent.update()
        const shouldNotExist = mountedComponent.find(selector)
        expect(shouldNotExist.exists()).toEqual(false)
    })
}

//handles if input contains value
export const containsValue = (mountedComponent, inputSelector, expectedText) => {

    const containsValue = mountedComponent
        .find(inputSelector)
        .last()

    expect(containsValue).not.toBeUndefined()
    return expect(containsValue.instance().value).toEqual(expectedText)
}

//handles if node contains text
export const containsText = (mountedComponent, selector, expectedText) => {

    const containsText = mountedComponent
        .find(selector)
        .filterWhere(node => node.text().includes(expectedText))

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

