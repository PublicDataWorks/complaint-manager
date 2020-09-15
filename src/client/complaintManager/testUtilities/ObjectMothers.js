import Civilian from "../../../sharedTestHelpers/civilian";
import Address from "../../../sharedTestHelpers/Address";
import { ADDRESSABLE_TYPE } from "../../../sharedUtilities/constants";

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
      .withAddressableType(ADDRESSABLE_TYPE.CIVILIAN)
      .build()
  )
  .withId(undefined)
  .withCaseId(undefined)
  .build();
