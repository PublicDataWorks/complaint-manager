import Civilian from "./civilian";

export const civilianWithoutAddress = new Civilian.Builder().defaultCivilian().withNoAddress().build()

export const civilianWithAddress = new Civilian.Builder().defaultCivilian().build()