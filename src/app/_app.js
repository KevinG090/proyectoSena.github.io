import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MyApp() {
  return (
    <div>
      <ToastContainer
        position={"top-center"}
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick={true}
        pauseOnHover={true}
        draggable={true}
      />
    </div>
  )
}

export default MyApp;
