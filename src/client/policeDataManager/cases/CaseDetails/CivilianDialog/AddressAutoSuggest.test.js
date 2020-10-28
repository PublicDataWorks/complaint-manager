import AddressAutoSuggest from "./AddressAutoSuggest";
import React from "react";
import { Provider } from "react-redux";
import createConfiguredStore from "../../../../createConfiguredStore";
import { fireEvent, render } from "@testing-library/react";
import { waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import MutationObserver from "@sheerun/mutationobserver-shim";
window.MutationObserver = MutationObserver;

describe("AddressAutoSuggest ", () => {
  let cannedSuggestions, cannedDisplayAddress, mapService;
  cannedSuggestions = ["123 main street", "Chicago, IL", "Burma"];
  cannedDisplayAddress = "123 North Street";
  mapService = {
    getSuggestionValue: jest.fn(suggestion => {
      return suggestion;
    }),

    fetchSuggestions: jest.fn((input, callback) => {
      callback(cannedSuggestions);
    }),

    fetchAddressDetails: jest.fn(
      (placeId, successCallback, failureCallback) => {
        const fakeParsedAddress = { street: "123" };
        return successCallback(fakeParsedAddress, cannedDisplayAddress);
      }
    ),

    healthCheck: setServiceAvailableProps => {
      setServiceAvailableProps({ googleAddressServiceIsAvailable: true });
      setServiceAvailableProps({ geocoderServiceIsAvailable: true });
    }
  };
  const renderAddressAutoSuggest = mapService => {
    const store = createConfiguredStore();
    const label = "Test Label";
    const wrapper = render(
      <Provider store={store}>
        <AddressAutoSuggest
          label={label}
          data-testid="my-custom-autosuggest"
          mapService={mapService}
          meta={{ error: "Error" }}
          onBlur={() => {}}
          setFormValues={jest.fn()}
        />
      </Provider>
    );

    return wrapper;
  };

  test("should display a label", async () => {
    const label = "Test Label";
    const { queryByText } = renderAddressAutoSuggest(mapService);

    await waitFor(() => {
      expect(queryByText(label)).toBeInTheDocument();
    });
  });

  test("should fill address from fetchAddressDetails when map service is available and click on option from dropdown", async () => {
    const { getByTestId, getAllByTestId } = renderAddressAutoSuggest(
      mapService
    );
    const input = getByTestId("my-custom-autosuggest");

    await userEvent.type(input, "12");

    let suggestions;
    await waitFor(() => {
      suggestions = getAllByTestId("suggestion-option");
    });

    fireEvent.click(suggestions[0]);

    await waitFor(() => {
      expect(input.value).toBe(cannedDisplayAddress);
    });
  });

  test(" lookup address when map service is available", () => {
    const { getByTestId } = renderAddressAutoSuggest(mapService);
    const input = getByTestId("my-custom-autosuggest");

    expect(input.placeholder).toBe("Search for an Address");
    expect(input.disabled).toBe(false);
  });

  test("address lookup should be down if places map service is down", async () => {
    mapService.healthCheck = setServiceAvailableProps => {
      setServiceAvailableProps({ googleAddressServiceIsAvailable: false });
      setServiceAvailableProps({ geocoderServiceIsAvailable: true });
    };

    const { getByTestId } = renderAddressAutoSuggest(mapService);
    const input = getByTestId("my-custom-autosuggest");

    await waitFor(() => {
      expect(input.value).toBe(
        "Address lookup is down, please try again later"
      );
      expect(input.disabled).toBe(true);
    });
  });

  test("address lookup should be down if geo map service is down", async () => {
    mapService.healthCheck = setServiceAvailableProps => {
      setServiceAvailableProps({ googleAddressServiceIsAvailable: true });
      setServiceAvailableProps({ geocoderServiceIsAvailable: false });
    };
    const { getByTestId } = renderAddressAutoSuggest(mapService);
    const input = getByTestId("my-custom-autosuggest");

    await waitFor(() => {
      expect(input.value).toBe(
        "Address lookup is down, please try again later"
      );
      expect(input.disabled).toBe(true);
    });
  });
});
