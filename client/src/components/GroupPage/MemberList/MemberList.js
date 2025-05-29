import { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../../../index.js';
import './MemberList.css';

function MemberList() {
    const { memberStore } = useContext(Context);

    return (
        <aside>
            <h2>Члени групи</h2>
            <div className="container">
                {memberStore.members.length === 0 ? (
                    <div>Членів групи немає</div>
                ) : (
                    <ul className="member-list-ul">
                        {memberStore.members.map((member) => (
                            <li className="member-list-li" key={member.id}>
                                <button
                                    onClick={() => memberStore.setSelectedMember(member)}
                                    className={
                                        memberStore.selectedMember?.id === member.id ? 'active' : ''
                                    }
                                >
                                    {member.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </aside>
    );
}

export default observer(MemberList);
