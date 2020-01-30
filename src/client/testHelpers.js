import promiseRetry from "promise-retry";

export const changeInput = (mountedComponent, inputSelector, value) => {
  const input = mountedComponent.find(inputSelector).last();
  input.simulate("change", { target: { value } });
};

export const findDropdownOption = (
  mountedComponent,
  dropdownSelector,
  optionName
) => {
  // allows simulated clicks on Material UI Autocomplete options
  // see documentation here: https://github.com/mui-org/material-ui/issues/15726
  global.document.createRange = () => ({
    setStart: () => {},
    setEnd: () => {},
    commonAncestorContainer: {
      nodeName: "BODY",
      ownerDocument: document
    }
  });

  const autocomplete = mountedComponent
    .find(dropdownSelector)
    .first()
    .find("ForwardRef(Autocomplete)");

  const options = autocomplete.props().options;

  const optionIndex = options
    .map(option => {
      return option.label;
    })
    .indexOf(optionName);

  autocomplete
    .find("ForwardRef(IconButton)")
    .last()
    .simulate("click");

  mountedComponent
    .find("ForwardRef(Popper)")
    .find(`li[id$='option-${optionIndex}']`)
    .simulate("click");
};

export const findCreatableDropdownOption = (
  mountedComponent,
  dropdownSelector,
  optionName
) => {
  // allows simulated clicks on Material UI Autocomplete options
  // see documentation here: https://github.com/mui-org/material-ui/issues/15726
  global.document.createRange = () => ({
    setStart: () => {},
    setEnd: () => {},
    commonAncestorContainer: {
      nodeName: "BODY",
      ownerDocument: document
    }
  });

  const autocomplete = mountedComponent
    .find(dropdownSelector)
    .first()
    .find("ForwardRef(Autocomplete)");

  const options = autocomplete.props().options;

  const optionIndex = options
    .map(option => {
      return option.label;
    })
    .indexOf(optionName);

  autocomplete.simulate("click");

  mountedComponent
    .find("ForwardRef(Popper)")
    .find(`li[id$='option-${optionIndex}']`)
    .simulate("click");
};

export const findDropdownOptionReactSelect = (
  mountedComponent,
  dropdownSelector,
  optionName,
  isCreatable
) => {
  let dropdownComponent;
  if (isCreatable) {
    dropdownComponent = "Creatable";
  } else {
    dropdownComponent = "Select";
  }
  const options = mountedComponent
    .find(dropdownSelector)
    .find(dropdownComponent)
    .prop("options")
    .filter(option => option.label.toString() === optionName);

  const value = options[0].value;

  mountedComponent
    .find(dropdownSelector)
    .find(dropdownComponent)
    .props()
    .onChange({ value: value });
};

export const selectDropdownOptionReactSelect = (
  mountedComponent,
  dropdownSelector,
  optionName
) => {
  findDropdownOptionReactSelect(
    mountedComponent,
    dropdownSelector,
    optionName,
    true
  );
};

export const selectDropdownOption = (
  mountedComponent,
  dropdownSelector,
  optionName
) => {
  findDropdownOption(mountedComponent, dropdownSelector, optionName);
};

export const selectCreatableDropdownOption = (
  mountedComponent,
  dropdownSelector,
  optionName
) => {
  findCreatableDropdownOption(mountedComponent, dropdownSelector, optionName);
};

export const expectEventuallyNotToExist = async (
  mountedComponent,
  selector
) => {
  await retry(() => {
    mountedComponent.update();
    const shouldNotExist = mountedComponent.find(selector);
    expect(shouldNotExist.exists()).toEqual(false);
  });
};

export const expectEventuallyToExist = async (mountedComponent, selector) => {
  await retry(() => {
    mountedComponent.update();
    const shouldExist = mountedComponent.find(selector);
    expect(shouldExist.exists()).toEqual(true);
  });
};

//handles if input contains value
export const containsValue = (
  mountedComponent,
  inputSelector,
  expectedText
) => {
  const containsValue = mountedComponent.find(inputSelector).last();

  expect(containsValue).not.toBeUndefined();
  return expect(containsValue.instance().value).toEqual(expectedText);
};

//handles if node contains text
export const containsText = (mountedComponent, selector, expectedText) => {
  const containsText = mountedComponent.find(selector).first();

  expect(containsText).not.toBeUndefined();
  return expect(containsText.text()).toContain(expectedText);
};

export const retry = async retriableFunction => {
  await promiseRetry(
    doRetry => {
      try {
        retriableFunction();
      } catch (e) {
        doRetry(e);
      }
    },
    { retries: 2 }
  );
};

export const convertStringToArrayBuffer = stringToConvert => {
  const buffer = new ArrayBuffer(stringToConvert.length * 2);
  const bufferView = new Uint16Array(buffer);
  for (let i = 0; i < stringToConvert.length; i++) {
    bufferView[i] = stringToConvert.charCodeAt(i);
  }
  return buffer;
};
