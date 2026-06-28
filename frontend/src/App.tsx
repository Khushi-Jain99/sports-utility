import AppRoutes from "./routes/AppRoutes";

import { AuthProvider } from "./context/AuthContext";

import { Toaster } from "react-hot-toast";

function App() {
  return (

    <AuthProvider>

      <Toaster position="top-right" />

      <AppRoutes />

    </AuthProvider>

  );
}

export default App;