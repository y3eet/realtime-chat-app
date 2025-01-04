import {
  Box,
  Card,
  Center,
  PasswordInput,
  Button,
  Text,
  TextInput,
} from "@mantine/core";

import { IconUser, IconLock, IconMail } from "@tabler/icons-react";
import { useState, useTransition } from "react";
import { Link, useNavigate } from "react-router";
import { SERVER_URL } from "../../../url";
import { useAuth } from "../../components/AuthContext";

const Register = () => {
  const [isPending, startTransition] = useTransition();
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Record<string, string> | null>(null);
  const { login } = useAuth();
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    startTransition(() => {
      fetch(`${SERVER_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password, confirmPassword }),
        credentials: "include",
      }).then(async (response) => {
        if (response.ok) {
          setErrors(null);
          login().then(() => navigate("/login"));
        } else {
          const data = await response.json();
          setErrors(data.error);
        }
      });
    });
  }
  return (
    <form onSubmit={handleSubmit}>
      <Box
        style={{
          height: "100vh",
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
            display: "flex",
            flexDirection: "column",
            gap: 15,
          }}
        >
          <Center>
            <Text
              size="xl"
              style={{
                marginBottom: 30,
                textTransform: "uppercase",
                letterSpacing: "1px",
                alignItems: "center",
              }}
            >
              Register
            </Text>
          </Center>
          <TextInput
            size="lg"
            placeholder="Username"
            name="username"
            leftSection={<IconUser size={20} stroke={1.5} />}
            error={errors?.username}
            required
          />

          <TextInput
            size="lg"
            placeholder="Email"
            name="email"
            leftSection={<IconMail size={20} stroke={1.5} />}
            error={errors?.email}
            required
          />

          <PasswordInput
            size="lg"
            placeholder="Password"
            name="password"
            leftSection={<IconLock size={20} stroke={1.5} />}
            error={errors?.password}
            required
          />

          <PasswordInput
            size="lg"
            placeholder="Confirm Password"
            name="confirmPassword"
            leftSection={<IconLock size={20} stroke={1.5} />}
            error={errors?.confirmPassword}
            required
          />

          <Button
            loading={isPending}
            size="lg"
            fullWidth
            type="submit"
            style={{
              borderRadius: "8px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginTop: 20,
            }}
          >
            Register
          </Button>
          <Text
            size="sm"
            style={{
              textAlign: "center",
            }}
          >
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#667eea" }}>
              Log In
            </Link>
          </Text>
        </Card>
      </Box>
    </form>
  );
};

export default Register;
