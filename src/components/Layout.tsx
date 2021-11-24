import { ButtonAppBar } from "./ButtonAppBar";

export const Layout: React.FC = ({ children }) => {
  return (
    <div className="bg-orange-100">
      <ButtonAppBar />
      {children}
    </div>
  );
};
