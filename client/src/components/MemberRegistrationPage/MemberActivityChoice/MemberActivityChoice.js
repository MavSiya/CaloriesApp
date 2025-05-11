import { activities } from "../../../dataActivity";
import './ActivityChoice.css';
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { Context } from "../../../index";

function MemberActivityChoice() {
  const { memberStore } = useContext(Context);

  const selectedActivityId = memberStore.activityId;

  const handleSelect = (activityId) => {
    memberStore.activityId = activityId;
  };

  return (
    <section className="all_activities">
      <h1>Активність</h1>
      <ul className="activities">
        {activities.map((activity) => (
          <li key={activity.id}>
            <button
              className={`button_activity ${selectedActivityId === activity.id ? "active" : ""}`}
              onClick={() => handleSelect(activity.id)}
            >
              <h2>{activity.title}</h2>
              <span>{activity.description}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default observer(MemberActivityChoice);
