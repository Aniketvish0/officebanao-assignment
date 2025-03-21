import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import { AssetProvider } from "./context/AssestProvider";

const App = () => {
  return (
    <>
    <Header/>
    <AssetProvider>
    <div className="container">
      <Outlet />
    </div>
    </AssetProvider>
    </>
  );
};

export default App;
