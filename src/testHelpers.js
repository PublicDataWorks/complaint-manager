import promiseRetry from 'promise-retry'

export const changeInput = (mountedComponent, inputSelector, value) => {
    const input = mountedComponent.find(inputSelector)
    input.simulate('change', {target: {value: value}})
}

export const selectDropdownOption = (mountedComponent, dropdownSelector, optionSelector) => {
    const dropdown = mountedComponent.find(dropdownSelector).find('[role="button"]');
    dropdown.simulate('click')

    const option = mountedComponent.find(optionSelector)
    option.simulate('click')
}

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
