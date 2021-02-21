import React from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

const useStyles = makeStyles({
  cardContent: {
    paddingBottom: "0",
  },
  title: {
    marginBottom: "12px",
  },
  paragraphs: {
    marginBottom: "8px",
  },
});

interface Props {
  title: string;
  paragraphs: string[];
  buttons: [string, string][];
}

const HomeCard: React.FunctionComponent<Props> = (props) => {
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
      <CardActions>
        {props.buttons.map(([label, route]) => {
          return (
            <Button color="secondary" key={label} component={Link} to={route}>
              {label}
            </Button>
          );
        })}
      </CardActions>
    </Card>
  );
};

export default HomeCard;
