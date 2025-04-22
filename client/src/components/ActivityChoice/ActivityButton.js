import './ActivityChoice.css'

export default function ActivityButton({id, children, isActive, onClick}){
        return(
    <button 
    onClick={()=> onClick(id)} 
    className={`button_activity ${isActive ===id ? "active" : ""}` }>{children}</button>
)
}