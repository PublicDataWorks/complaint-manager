import axios from "axios";

const sendEmail = async (users, caseId, currentUserEmail, location) => {
  try {
    const response = await axios.get("/sendEmail", {
      params: { users, caseId, currentUserEmail, location }
    });

    console.log("data status ", response.data.status);
    console.log("data details ", response.data.details);
    console.log("Status:", response.status);
    console.log("Headers:", response.headers);
    return response;
  } catch (error) {
    console.error("Error:", error);
  }
};
export default sendEmail;
