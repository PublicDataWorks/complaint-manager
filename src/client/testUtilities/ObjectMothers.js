import Civilian from "./civilian";
import Address from "./Address";

export const civilianWithoutAddress = new Civilian.Builder()
  .defaultCivilian()
  .withClearedOutAddress()
  .withId(undefined)
  .withCaseId(undefined)
  .build();

export const civilianWithAddress = new Civilian.Builder()
  .defaultCivilian()
  .withAddress(
    new Address.Builder()
      .defaultAddress()
      .withId(undefined)
      .withAddressableId(undefined)
      .withAddressableType("civilian")
      .build()
  )
  .withId(undefined)
  .withCaseId(undefined)
  .build();
