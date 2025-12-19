  export default function MenuItem ({ icon: Icon, label, id,setActiveMenu,activeMenu }) {
    
    return(
      <div
      onClick={() => setActiveMenu(id)}
      className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all ${
        activeMenu === id
          ? 'bg-yellow-400 text-gray-900 font-semibold'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
       {Icon && <Icon size={20} />}
      <span>{label}</span>
    </div>
    )
 }
 