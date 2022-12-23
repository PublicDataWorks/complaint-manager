import { useState } from "React";

/**
 * useMenuControl - meant to be used in tandem with the material UI <Menu> component.
 * This keeps track of whether the menu is open and allows you to do so, and attaches
 * the menu to the button that triggers its opening
 * @returns an object containing the following properties:
 * - menuOpen: a boolean indicating whether the menu is open
 * - anchorEl: the element to which the menu will be anchored
 * - handleMenuOpen: a function that opens the menu (this function expects to be called with a DOM event object)
 * - handleMenuClose: a function that closes the menu
 */
const useMenuControl = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = event => {
    setMenuOpen(true);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
  };

  return {
    menuOpen,
    anchorEl,
    handleMenuOpen,
    handleMenuClose
  };
};

export default useMenuControl;
