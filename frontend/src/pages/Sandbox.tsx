import { useEffect, useState } from "react";
import NewLeetcodeQuestionModal from "../components/company/NewLeetcodeQuestionModal";
import { useAuth } from "../contexts/useAuth";
import { Difficulty, LeetcodeQuestion } from "../types/LeetcodeQuestion";
import LeetcodeQuestionModal from "../components/company/LeetcodeQuestionModal";
import { User, UserType } from "../types/User";
import { State } from "../types/Company";

const Sandbox = () => {
  const user: User = {
    _id: "123",
    name: "Kevin",
    email: "kevin123@gmail.com",
    type: UserType.Alumni,
    profilePicture: "",
  };

  const company = {
    _id: "6744401901ea4031b0848bfe",
    name: "Waymo",
    city: "Mountain View",
    state: State.California,
  };

  const lq: LeetcodeQuestion = {
    _id: "12345678",
    title: "Two Sum",
    company: company,
    user: user,
    difficulty: Difficulty.Easy,
    url: "www.google.com",
    date: new Date(),
  };

  const [isOpen, setIsOpen] = useState(true);
  const [leetcodeQuestion, setLeetcodeQuestion] =
    useState<LeetcodeQuestion>(lq);
  const { user: u } = useAuth();

  useEffect(() => {
    if (u) {
      setLeetcodeQuestion({ ...leetcodeQuestion, user: u });
    }
  }, [u, leetcodeQuestion]);

  if (user) {
    return (
      <div>
        <LeetcodeQuestionModal
          leetcodeQuestion={leetcodeQuestion}
          isOpen={isOpen}
          onClose={() => {
            setIsOpen(false);
          }}
          onUpdateLeetcodeQuestion={() => {}}
          setLeetcodeQuestion={setLeetcodeQuestion}
        />
      </div>
    );
  }

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
