export function Button({label,onClick}){
    return<div>
        
        <button onClick={onClick} type="button" className="text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-10 py-2.5 me-2 mb-2">{label}</button>
    
    </div>
}