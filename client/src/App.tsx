import { useNavigate } from "react-router";
import { useAuth } from "./components/AuthContext";

const App = () => {
  const navigate = useNavigate();
  const { user, loading, login } = useAuth();
  if (loading) {
    return <div>Loading...</div>;
  } else if (user === null) {
    navigate("/login");
  } else if (user) {
    navigate("/chat");
  }

  return (
    <div>
      <div>{JSON.stringify(user)}</div>
      <button onClick={login}>Login</button>
    </div>
  );
};

export default App;
