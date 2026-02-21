import { apiRequest } from "../api";

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const data = await apiRequest("/api/auth/login", "POST", {
      email,
      password,
    });

    localStorage.setItem("token", data.token);
    navigate("/dashboard");
  } catch (error) {
    alert(error.message);
  }
};