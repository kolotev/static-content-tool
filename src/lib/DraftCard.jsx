/*eslint no-console: ["error", { allow: ["warn", "error"] }] */
import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

const styles = theme => ({
  card_actions: {
    justifyContent: "flex-end"
  },
  button: {
    marginBottom: theme.spacing(1)
  }
});

function DraftCard(props) {
  const {
    classes,
    id,
    name,
    project,
    repository,
    created,
    lastComited,
    sentForReview
  } = props;

  return (
    <React.Fragment key={id}>
      <Grid item xs={true}>
        <Card>
          <Grid container spacing={4}>
            <Grid item xs={6}>
              <CardContent>
                <Typography variant="h6">{name}</Typography>
                <List disablePadding={true}>
                  <ListItem divider={true} dense={true} disableGutters={true}>
                    <ListItemText
                      primary="Project/Repository"
                      secondary={`${project}/${repository}`}
                    />
                  </ListItem>
                  <ListItem divider={true} dense={true} disableGutters={true}>
                    <ListItemText primary="Created on" secondary={created} />
                  </ListItem>
                  <ListItem divider={true} dense={true} disableGutters={true}>
                    <ListItemText
                      primary="Last commited on"
                      secondary={lastComited}
                    />
                  </ListItem>
                  {sentForReview ? (
                    <ListItem divider={true} dense={true} disableGutters={true}>
                      <ListItemText
                        primary="Sent for review on"
                        secondary={sentForReview}
                        secondaryTypographyProps={{ color: "error" }}
                      />
                    </ListItem>
                  ) : null}
                </List>
              </CardContent>
            </Grid>
            <Grid item xs={6}>
              <CardContent>
                <Button
                  color="default"
                  variant="outlined"
                  fullWidth={true}
                  className={classes.button}
                >
                  Preview
                </Button>
                <Button
                  color="default"
                  variant="outlined"
                  fullWidth={true}
                  className={classes.button}
                >
                  Send for Review
                </Button>
                <Button
                  color="default"
                  variant="outlined"
                  fullWidth={true}
                  className={classes.button}
                >
                  Delete
                </Button>
                <Button
                  color="default"
                  variant="outlined"
                  fullWidth={true}
                  className={classes.button}
                >
                  Diff
                </Button>
              </CardContent>
            </Grid>
          </Grid>
          <CardActions className={classes.card_actions}>
            <Button color="primary" variant="text">
              See details
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </React.Fragment>
  );
}

const StyledDraftCard = withStyles(styles)(DraftCard);

export default StyledDraftCard;
