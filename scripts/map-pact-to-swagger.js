const fs = require("fs");
const path = require("path");

const STATUS_MAPPING = {
  200: "OK",
  201: "Created",
  202: "Accepted",
  204: "No Content",
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  500: "Internal Server Error"
};

const getValueType = value => {
  if (typeof value === "string") {
    return "string";
  } else if (Number.isInteger(value)) {
    return "integer";
  } else if (typeof value === "number") {
    return "float";
  } else if (typeof value === "boolean") {
    return "boolean";
  } else if (Array.isArray(value)) {
    return "array";
  } else if (typeof value === "object") {
    return "object";
  } else {
    return "unknown";
  }
};

const CASE_OFFICER = {
  id: { type: "integer" },
  fullName: { type: "string" },
  officerId: { type: "integer" },
  firstName: { type: "string" },
  middleName: { type: "string" },
  lastName: { type: "string" },
  phoneNumber: { type: "string" },
  email: { type: "string" },
  isUnknownOfficer: { type: "boolean" },
  windoewsUserName: { type: "string" },
  supervisorFullName: { type: "string" },
  supervisorWindoesUserName: { type: "string" },
  employeeType: { type: "string" },
  caseEmployeeType: { type: "string" },
  bureau: { type: "string" },
  rank: { type: "string" },
  dob: { type: "string" },
  endDate: { type: "string" },
  hireDate: { type: "string" },
  sex: { type: "string" },
  race: { type: "string" },
  workStatus: { type: "string" },
  notes: { type: "string" },
  roleOnCase: { type: "string" },
  isAnonymous: { type: "boolean" }
};

const HARD_CODINGS = {
  accusedOfficers: {
    type: "array",
    items: {
      type: "object",
      properties: CASE_OFFICER
    }
  },
  tagNames: {
    type: "array",
    items: {
      type: "string"
    }
  }
};

const mapArrayType = (array, key) => {
  if (array.length && array[0]) {
    return {
      type: "array",
      items: mapElement(array[0])
    };
  } else {
    return HARD_CODINGS[key];
  }
};

const mapObjectType = object => {
  if (object) {
    return {
      type: "object",
      properties: Object.keys(object).reduce((properties, key) => {
        return {
          ...properties,
          [key]: mapElement(object[key], key)
        }; // FIXME
      }, {})
    };
  }
};

const mapElement = (element, key) => {
  const valueType = getValueType(element);
  if (valueType === "array") {
    return mapArrayType(element, key);
  } else if (valueType === "object") {
    return mapObjectType(element);
  } else {
    return { type: valueType };
  }
};

// Path to the Pact JSON file
const pactFilePath = path.join(
  __dirname.replace("/scripts", ""),
  "/pact/pacts/complaint-manager.client-complaint-manager.server.json"
);

// Read the Pact JSON file
const pact = fs.readFileSync(pactFilePath, "utf8");

const swagger = {
  openapi: "3.0.0",
  info: {
    title: "Complaint Manager API",
    version: "1.0.0",
    description: "API for managing complaints"
  },
  servers: [
    {
      url: "https://noipm-staging.herokuapp.com",
      description: "Staging server"
    },
    {
      url: "https://noipm-ci.herokuapp.com",
      description: "CI server"
    }
  ],
  paths: Object.values(JSON.parse(pact).interactions).reduce(
    (paths, interaction) => {
      const { description, request, response } = interaction;
      const { method, path } = request;
      const { status } = response;

      if (!paths[path]) {
        // TODO handle path params
        paths[path] = {};
      }
      paths[path][method.toLowerCase()] = {
        summary: description,
        responses: {
          [status]: {
            description: STATUS_MAPPING[status],
            content: response.body
              ? {
                  [response.headers["Content-Type"]]: {
                    schema: mapElement(response.body),
                    example: Array.isArray(response.body)
                      ? undefined
                      : {
                          summary: `${description} example request`,
                          value: response.body
                        }
                  }
                }
              : undefined
          }
        }
      };
      return paths;
    },
    {}
  ),
  components: {
    schemas: {}
  }
};

// Write swagger as JSON to a file
const swaggerFilePath = path.join(
  __dirname.replace("/scripts", ""),
  "swagger.json"
);
fs.writeFileSync(swaggerFilePath, JSON.stringify(swagger, null, 2));
