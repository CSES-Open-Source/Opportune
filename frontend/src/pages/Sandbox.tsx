import { useState } from "react";
import NewLeetcodeQuestionModal from "../components/NewLeetcodeQuestionModal";

const Sandbox = () => {
  const [isOpen, setIsOpen] = useState(true);
  const company = {
    _id: "6744401901ea4031b0848bfe",
    name: "Waymo",
    city: "Mountain View",
    state: "CA",
    __v: 0,
    employees: "ENTERPRISEPLUS",
    logoKey: "logos/ef56058e-3635-4167-9352-c20b36d131d7.png",
  };
  return (
    <div>
      <NewLeetcodeQuestionModal
        company={company}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onNewLeetcodeQuestion={() => {}}
      />
    </div>
  );
};

export default Sandbox;
