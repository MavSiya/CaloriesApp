import './ButtonHeader.css'

export default function ButtonHeader({children, className = "", onClick }){

    return(
     <button className={`button-header ${className}`} onClick={onClick}>{children}</button>
    )
  }