import Header from '../../Header/Header';

import { useContext} from 'react';
import { Context } from '../../../index.js';
import { observer } from "mobx-react-lite";

 function JournalPage(){
   const { store } = useContext(Context);
    return(
      <div className="journal">
        <Header />
     <h1>Hi journal</h1>
     </div>
    )
  }

  export default observer(JournalPage);