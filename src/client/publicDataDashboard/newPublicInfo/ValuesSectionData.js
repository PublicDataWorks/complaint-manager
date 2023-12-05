const config =
require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/clientConfig`)[
    process.env.REACT_APP_ENV
];

export const TEXT =
"The Hawaii Correctional System Oversight Commission's goal is to increase transparency by making data available to the public to support safe conditions for employees and people in custody, and to push for reform to a rehabilitative and therapeutic correctional system. Below are our values:";

export const VALUES = [
{
    name: "Alohiloh",
    subtext: "(Transparency)",
    icon: `${config.frontendUrl}/images/Alohiloh.svg`,
    altText: "white outline of three people holding hands in a circle"
},
{
    name: "Kuleana",
    subtext: "(Accountability)",
    icon: `${config.frontendUrl}/images/Kuleana.svg`,
    altText:
    "white outline of three people shoulder to shoulder celebrating with their hands up"
},
{
    name: "Pono",
    subtext: "(Integrity)",
    icon: `${config.frontendUrl}/images/Pono.svg`,
    altText: "white outline of hibiscus flower"
},
{
    name: "Aloha",
    subtext: "(Compassion)",
    icon: `${config.frontendUrl}/images/Aloha.svg`,
    altText: "white outline of shaka or hang loose hand gesture"
},
{
    name: "Ha'aha'a",
    subtext: "(Humility)",
    icon: `${config.frontendUrl}/images/Haahaa.svg`,
    altText: "white outline of five smiley faces connected by eight lines"
}
];
