import ProtectedRoute from "@/components/ProtectedRoute";

const ProtectedLayout = ({ children }: React.PropsWithChildren) => {
  return <ProtectedRoute>{children}</ProtectedRoute>;
};

export default ProtectedLayout;
