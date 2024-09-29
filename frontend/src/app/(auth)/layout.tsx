import ProtectedAuthRoute from "@/components/ProtectedAuthRoute";

const ProtectedLayout = ({ children }: React.PropsWithChildren) => {
  return <ProtectedAuthRoute>{children}</ProtectedAuthRoute>;
};

export default ProtectedLayout;
