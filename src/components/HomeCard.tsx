import React from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
} from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) =>
  createStyles({
    cardContent: {
      paddingBottom: "0",
    },
    title: {
      marginBottom: "12px",
    },
    paragraphs: {
      marginBottom: "8px",
    },
    actionsWrapper: {
      position: "relative",
      display: "flex",
      justifyContent: "space-around",
      padding: theme.spacing(0.5),
    },
    divider: {
      position: "absolute",
      top: 0,
      left: "50%",
    },
  })
);

interface Props {
  title: string;
  paragraphs: string[];
  buttons: [string, string][];
}

const HomeCard: React.VFC<Props> = (props) => {
  const classes = useStyles();

  return (
    <Card>
      <CardContent className={classes.cardContent}>
        <Typography variant="h5" component="h2" className={classes.title}>
          {props.title}
        </Typography>
        {props.paragraphs.map((text) => {
          return (
            <Typography
              variant="body2"
              key={text}
              paragraph={true}
              className={classes.paragraphs}
            >
              {text}
            </Typography>
          );
        })}
      </CardContent>
      <Divider />
      <CardActions className={classes.actionsWrapper} disableSpacing>
        {props.buttons.map(([label, route]) => {
          return (
            <Button color="secondary" key={label} component={Link} to={route}>
              {label}
            </Button>
          );
        })}
        {props.buttons.length === 2 && (
          <Divider
            orientation="vertical"
            // flexItem
            className={classes.divider}
          />
        )}
      </CardActions>
    </Card>
  );
};

export default HomeCard;
