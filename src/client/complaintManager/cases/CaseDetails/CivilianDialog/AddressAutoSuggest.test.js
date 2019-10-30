import { mount } from "enzyme";
import AddressAutoSuggest from "./AddressAutoSuggest";
import React from "react";
import { containsText } from "../../../../testHelpers";
import { Provider } from "react-redux";
import createConfiguredStore from "../../../../createConfiguredStore";

describe("AddressAutoSuggest", () => {
  let store, cannedSuggestions, mapService;
  beforeEach(() => {
    store = createConfiguredStore();
    cannedSuggestions = ["123 main street", "Chicago, IL", "Burma"];
    mapService = {
      //returns suggestion value for updating input value
      getSuggestionValue: jest.fn(() => suggestion => {
        return suggestion;
      }),

      //fetches suggestions if need be, call calback with results
      onFetchSuggestions: jest.fn(() => (input, callback) => {
        callback(cannedSuggestions);
      }),

      //after selecting a suggestion, what else should be done?
      onSuggestionSelected: jest.fn(() => suggestion => {
        return suggestion;
      }),

      healthCheck: setServiceAvailableProps => {
        setServiceAvailableProps({ googleAddressServiceIsAvailable: true });
        setServiceAvailableProps({ geocoderServiceIsAvailable: true });
      }
    };
  });

  test("should display a label", () => {
    let autoSuggestWrapper, label;
    label = "Test Label";
    autoSuggestWrapper = mount(
      <Provider store={store}>
        <AddressAutoSuggest
          label={label}
          data-test="my-custom-autosuggest"
          mapService={mapService}
          input={{}}
          meta={{ error: "Error" }}
          onBlur={() => {}}
        />
      </Provider>
    );

    containsText(
      autoSuggestWrapper,
      '[data-test="my-custom-autosuggest"]',
      label
    );
  });

  test(" lookup address when map service is available", () => {
    let autoSuggestWrapper, label;
    label = "Test Label";
    autoSuggestWrapper = mount(
      <Provider store={store}>
        <AddressAutoSuggest
          label={label}
          data-test="my-custom-autosuggest"
          mapService={mapService}
          input={{}}
          meta={{ error: "Error" }}
          onBlur={() => {}}
        />
      </Provider>
    );

    const input = autoSuggestWrapper.find(
      '[data-test="my-custom-autosuggest"] > input'
    );

    expect(input.props().placeholder).toBe("Search for an Address");
    expect(input.props().disabled).toBe(false);
  });

  test("address lookup should be down if places map service is down", () => {
    mapService.healthCheck = setServiceAvailableProps => {
      setServiceAvailableProps({ googleAddressServiceIsAvailable: false });
      setServiceAvailableProps({ geocoderServiceIsAvailable: true });
    };

    let autoSuggestWrapper, label;
    label = "Test Label";
    autoSuggestWrapper = mount(
      <Provider store={store}>
        <AddressAutoSuggest
          label={label}
          data-test="my-custom-autosuggest"
          mapService={mapService}
          input={{}}
          meta={{ error: "Error" }}
          onBlur={() => {}}
        />
      </Provider>
    );

    const input = autoSuggestWrapper.find(
      '[data-test="my-custom-autosuggest"] > input'
    );

    expect(input.props().value).toBe(
      "Address lookup is down, please try again later"
    );
    expect(input.props().disabled).toBe(true);
  });

  test("address lookup should be down if geo map service is down", () => {
    mapService.healthCheck = setServiceAvailableProps => {
      setServiceAvailableProps({ googleAddressServiceIsAvailable: true });
      setServiceAvailableProps({ geocoderServiceIsAvailable: false });
    };

    let autoSuggestWrapper, label;
    label = "Test Label";
    autoSuggestWrapper = mount(
      <Provider store={store}>
        <AddressAutoSuggest
          label={label}
          data-test="my-custom-autosuggest"
          mapService={mapService}
          input={{}}
          meta={{ error: "Error" }}
          onBlur={() => {}}
        />
      </Provider>
    );

    const input = autoSuggestWrapper.find(
      '[data-test="my-custom-autosuggest"] > input'
    );

    expect(input.props().value).toBe(
      "Address lookup is down, please try again later"
    );
    expect(input.props().disabled).toBe(true);
  });
});
