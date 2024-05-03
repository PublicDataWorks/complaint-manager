import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import React from "react";
import UserAvatar from "./UserAvatar";
import { getUsers } from '../../../auth/okta/userService';

jest.mock('../../../auth/okta/userService', () => ({
  getUsers: jest.fn(),
}));


describe("UserAvatar", () => {
  test("should parse the first 2 letters of user's name and display in upper case", async () => {
    getUsers.mockResolvedValue([
      { email: 'test@gmail.com', name: 'Tom Edwards' },
    ]);
  
    render(<UserAvatar email="test@gmail.com" />);

    await waitFor(() => {
      const avatarElement = screen.getByTestId("tooltip-TE"); 
      expect(avatarElement).toBeTruthy(); 
      expect(avatarElement.title).toEqual('test@gmail.com');
      expect(avatarElement.textContent).toEqual('TE'); 
    });
  });

  it("should display full email on mouse hover", () => {
    render(<UserAvatar email="test@gmail.com"></UserAvatar>);
    fireEvent.mouseMove(screen.getByTitle("test@gmail.com"));
    expect(screen.getByTestId("tooltip-")).toBeTruthy();
  });

    it("should not display avatar unless an email is provided", () => {
    render(<UserAvatar></UserAvatar>);
    expect(screen.getByTestId("no-avatar")).toBeTruthy();
  });
});