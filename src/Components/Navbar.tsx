import React from "react";
import {
  AppBar,
  Typography,
} from "@material-ui/core";
function Navbar() {
  return (
    <AppBar position="static">
      <Typography style={{margin: "0 auto 0 auto"}} variant="h4">React Form with Formik and Yup</Typography>
    </AppBar>
  );
}

export default Navbar;
