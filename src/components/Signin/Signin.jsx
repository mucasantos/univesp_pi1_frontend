import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FormControl,
  TextField,
  Button,
  LinearProgress,
  Box,
} from "@mui/material";

import "./Signin.css";
import { login, isAuthenticated } from "../../services/auth";

const Signin = () => {
  const navigation = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    login(name, password);
    setTimeout(() => {
      if (isAuthenticated()) {
        setLoading(false);
        navigation("/products");
      } else {
        setLoading(false);
        alert("Erro ao logar");
      }
    }, 2000);
  };

  return (
    <div className="Signin">
      <h2>Login</h2>

      <FormControl>
        <TextField
          id="login"
          label="Nome"
          variant="outlined"
          onChange={(e) => setName(e.target.value)}
        />
        <br />
        <TextField
          id="password"
          label="Senha"
          type="password"
          variant="outlined"
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <Button variant="contained" size="medium" onClick={handleSubmit}>
          Login
        </Button>
      </FormControl>
      {loading ? (
        <Box sx={{ width: "100%", padding: "1em" }}>
          <LinearProgress />
        </Box>
      ) : null}
    </div>
  );
};

export default Signin;
