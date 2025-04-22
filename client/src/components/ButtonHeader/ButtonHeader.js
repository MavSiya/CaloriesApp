import './ButtonHeader.css'

export default function ButtonHeader({children, className = ""}){
function handleClick(){
    console.log('button clicked')
}

    return(
     <button className={`button ${className}`} onClick={handleClick}>{children}</button>
    )
  }