import "./styles/global.scss";
import { DefaultLayout } from "./layouts/DefaultLayout";
import { HashRouter } from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./redux/store";
function App() {
  return (
   <ReduxProvider store={store}>
     <HashRouter>
        {<DefaultLayout />}
    </HashRouter>
   </ReduxProvider>
  );
}

export default App;
