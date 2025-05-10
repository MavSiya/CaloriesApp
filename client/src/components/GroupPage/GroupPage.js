import { useContext, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../../index.js";
import Header from "../Header/Header";
import MemberList from "./MemberList/MemberList";
import MemberForm from "./MemberForm/MemberForm";
import CalculationKpfc from "../RegistrationPage/CalculationKpfc/CalculationKpfc";
import ButtonHeader from "../ButtonHeader/ButtonHeader";
import { useNavigate } from "react-router-dom"; 

function GroupPage() {
  const { memberStore, store } = useContext(Context);
  const userId = store.user.id;
 const navigate = useNavigate(); 

  useEffect(() => {
    memberStore.fetchAllMembers(userId);
  }, [userId]);

  const selected = memberStore.selectedMember;



  const handleDeleteMember = async () => {
    if (selected) {
      await memberStore.deleteMember({ memberId: selected.id, userId });
      navigate("/group");
    }
  };

  const handleNavigateToJournal = () => {
    if (selected) {
      navigate(`/group/journal/${selected.id}`);
    }
  };

  return (
    <>
      <Header />
      <main className="main">
        <MemberList />
        {memberStore.members.length === 0 ? (
          <div>
            <p>Членів групи немає</p>
            <ButtonHeader onClick={() => navigate('/personal', { state: { isCreatingMember: true } })}>
              Додати члена
            </ButtonHeader>
          </div>
        ) : selected ? (
          <>
            <MemberForm />
            <CalculationKpfc isForMember />
            <ButtonHeader
  onClick={async () => {
    // Оновлюємо дані для вибраного члена
    if (selected) {
      await memberStore.updateMemberInfo(selected.id);
    }
  }}
  disabled={!memberStore.isValid}
>
  Зберегти зміни
</ButtonHeader>

           <ButtonHeader type="button" onClick={handleDeleteMember}>
              Видалити члена
            </ButtonHeader>

            <ButtonHeader type="button" onClick={handleNavigateToJournal}>
              Перейти в журнал
            </ButtonHeader>
          </>
        ) : (
          <div>Виберіть члена групи для редагування</div>
        )}
      </main>
    </>
  );
}

export default observer(GroupPage);
