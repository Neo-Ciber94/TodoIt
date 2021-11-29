export const Center: React.FC = ({ children }) => {
  return (
    <div className={`flex flex-col justify-center items-center h-[40vh]`}>
      {children}
    </div>
  );
};
