import Civilian from "./civilian";

export const civilianWithoutAddress = new Civilian.Builder().defaultCivilian().withClearedOutAddress().build()

export const civilianWithAddress = new Civilian.Builder().defaultCivilian().build()