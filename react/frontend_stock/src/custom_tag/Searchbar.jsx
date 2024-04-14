import '../../node_modules/font-awesome/css/font-awesome.min.css';
import '../css/searchbar.css'
function Searchbar() {
   return (
        <>
            <form className='search_form' action="">
                <input className="search_input" type="search" placeholder='Search...' required/><i class="fa fa-search"></i>
            </form>
        </>
   );
}

export default Searchbar