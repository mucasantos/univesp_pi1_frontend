import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import Home from "./pages/Home/Home";
import Products from "./pages/Products/Products";
import Supply from "./pages/Supply/Supply";
import List from "./pages/List/List";

import Error from "./pages/Error/Error";

const Router = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/products" element={<Products/>} />
          <Route exact path="/supply" element={<Supply/>} />
          <Route exact path="/list" element={<List/>} />

          <Route path="*" element={<Error />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
};

export default Router;
