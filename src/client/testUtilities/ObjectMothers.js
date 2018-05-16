import Civilian from "./civilian";
import Address from "./Address";

export const civilianWithoutAddress = new Civilian.Builder()
  .defaultCivilian()
  .withClearedOutAddress()
  .withId(undefined)
  .build();

export const civilianWithAddress = new Civilian.Builder()
  .defaultCivilian()
  .withAddress(
    new Address.Builder()
      .defaultAddress()
      .withId(undefined)
      .build()
  )
  .withId(undefined)
  .build();
