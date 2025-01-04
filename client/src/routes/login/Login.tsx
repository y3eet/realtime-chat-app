import {
  Box,
  Card,
  Text,
  Center,
  Button,
  PasswordInput,
  TextInput,
} from "@mantine/core";
import { IconLock, IconMail } from "@tabler/icons-react";
import { useState, useTransition } from "react";
import { Link, useNavigate } from "react-router";
import { SERVER_URL } from "../../../url";
import { useAuth } from "../../components/AuthContext";

const Login = () => {
  const { user, loading, login } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string> | null>(null);
  const navigate = useNavigate();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    startTransition(() => {
      fetch(`${SERVER_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.success) {
            setErrors(null);
            login();
            navigate("/chat");
            // Redirect to home page
          } else {
            setErrors(data.error);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    });
  }
  if (user) {
    navigate("/chat");
  }
  return (
    <form onSubmit={handleSubmit}>
      <Box
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <Card
          shadow="xl"
          radius="lg"
          padding="xl"
          style={{
            width: "100%",
            maxWidth: "400px",
          }}
        >
          <Center>
            <Text
              size="xl"
              style={{
                marginBottom: 30,
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Log In
            </Text>
          </Center>
          <TextInput
            size="lg"
            placeholder="Email"
            name="email"
            leftSection={<IconMail size={20} stroke={1.5} />}
            style={{
              marginBottom: 15,
            }}
            error={errors?.email}
          />
          <PasswordInput
            size="lg"
            placeholder="Password"
            name="password"
            leftSection={<IconLock size={20} stroke={1.5} />}
            error={errors?.password}
          />
          <Button
            type="submit"
            size="lg"
            fullWidth
            loading={isPending || loading}
            style={{
              borderRadius: "8px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginTop: 20,
            }}
          >
            Log In
          </Button>
          <Text
            size="sm"
            color="dimmed"
            style={{
              marginTop: 15,
              textAlign: "center",
            }}
          >
            Don&apos;t have an account?{" "}
            <Link to="/register" style={{ color: "#667eea" }}>
              Register
            </Link>
          </Text>
        </Card>
      </Box>
    </form>
  );
};

export default Login;
