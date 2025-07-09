// WorkingVisaDetails  thin wrapper around TourDetails
import React from "react";
import TourDetails from "./TourDetails";

import "./TourDetails.css";
import "./WorkingVisaDetails.css";

export default function WorkingVisaDetails() {
  return <TourDetails isVisa />;
}
