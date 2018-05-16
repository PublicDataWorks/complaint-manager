import {shallow} from "enzyme";
import {CaseHistory} from "./CaseHistory";
import React from 'react';

describe("CaseHistory", () => {
    test("it fetches the case history on mount", () => {
        const getCaseHistory = jest.fn();
        shallow(<CaseHistory getCaseHistory={getCaseHistory} match={{params: {id: 5}}} />);
        expect(getCaseHistory).toHaveBeenCalledWith(5);
    });
});