import sanitizeHtml from 'sanitize-html';

export const sanitize = input => sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {},
    disallowedTagsMode: 'escape'
});

//todo - Write Test