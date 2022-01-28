import { sanitize } from "./sanitizeHTML";

describe("sanitizeHTML", () => {
    test("Should escape all HTML tags", () => {
        const dirtyInput = "<h1>I'm a Headline</h1>";
        const cleanOutput = sanitize(dirtyInput);

        expect(cleanOutput).toEqual("&lt;h1&gt;I'm a Headline&lt;/h1&gt;");
    });

    test("Should discard HTML attributes", () => {
        const dirtyInput = `<a title="link">I'm a Link</a>`;
        const cleanOutput = sanitize(dirtyInput);

        expect(cleanOutput).toEqual("&lt;a&gt;I'm a Link&lt;/a&gt;");
    });
});

