import React, { useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import { QUERY_TYPES } from "../../../sharedUtilities/constants";

const ComplaintTotals = () => {
  const [data, setData] = useState({ ytd: null, previousYear: null });
  const previousYear = new Date().getFullYear() - 1;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `/api/data?queryType=${QUERY_TYPES.COUNT_COMPLAINT_TOTALS}`
        );
        setData(response.data);
      } catch (e) {
        setData({ ytd: null, previousYear: null });
        console.log(e);
      }
    };
    fetchData();
  }, []);

  return (
    <div data-testid={"complaintTotals"}>
      <Typography>Complaints YTD: {data.ytd}</Typography>
      <Typography>
        Complaints {previousYear}: {data.previousYear}
      </Typography>
    </div>
  );
};

export default ComplaintTotals;
