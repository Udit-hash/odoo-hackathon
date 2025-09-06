import { Link } from "react-router-dom";

export function ButtonWarning({label,buttonText,to}){
    return(
    <div>
        <div className="text-black-500">
            {label}
        </div>
        <Link className="pointer underline pl-1  cursor-pointer" to={to}>
            {buttonText}
        </Link>
    </div>
    )
}