import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Icon } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    grow: {
      flexGrow: 1,
    },
    menuButton: {
      marginLeft: -6,
      marginRight: 18,
    },
  }),
);

export default function AppMenuBar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Toolbar>
          <Icon className={classes.menuButton} color="inherit" aria-label="Menu">
            school
          </Icon>
          <Typography variant="h6" color="inherit" className={classes.grow}>
            Core NLP UI
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}
