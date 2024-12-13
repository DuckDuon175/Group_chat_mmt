import { Navigate, Route, Routes as ReactRouterRoutes } from "react-router-dom";
import { Home } from "../pages/home";
import { Detail } from "../pages/account";
import { ChatMes } from "../pages/chat";
interface IProps {}

export const Routes = (props: IProps) => {
  const isConsentBackUrl = () => {
    return false;
  };

  return (
    <ReactRouterRoutes>
      <Route path="/home" element={<Home />} />
      <Route path="/account" element={<Detail />} />
      <Route path="/chat" element={<ChatMes />} />
      {!isConsentBackUrl() && (
        <Route path="*" element={<Navigate to={"/home"} />} />
      )}
    </ReactRouterRoutes>
  );
};
