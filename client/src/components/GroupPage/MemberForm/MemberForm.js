import { useContext, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../../../index.js";
import ActivityChoice from "../../RegistrationPage/ActivityChoice/ActivityChoice";
import Goal from "../../RegistrationPage/Goal/Goal";
import RegistrationForm from "../../RegistrationPage/RegistrationForm/RegistrationForm";

function MemberForm() {
  const { memberStore } = useContext(Context);
  const member = memberStore.selectedMember;

  useEffect(() => {
    if (member) {
      memberStore.fetchMemberInfo(member.id);
    }
  }, [member]);

  return (
    <section className="form_and_activity">
      <RegistrationForm isForMember />
      <Goal isForMember />
      <ActivityChoice isForMember />
    </section>
  );
}

export default observer(MemberForm);
