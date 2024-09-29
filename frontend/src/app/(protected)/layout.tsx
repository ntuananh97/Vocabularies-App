import ProtectedRoute from "@/components/ProtectedRoute";
import UserLayout from "@/views/layouts/UserLayout";

const ProtectedLayout = ({ children }: React.PropsWithChildren) => {
  return <ProtectedRoute>
      <UserLayout>{children}</UserLayout>
    </ProtectedRoute>;
};

export default ProtectedLayout;
 