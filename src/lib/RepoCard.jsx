/*eslint no-console: ["error", { allow: ["warn", "error"] }] */
import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Link from "@material-ui/core/Link";

const styles = theme => ({
  card_actions: {
    justifyContent: "flex-end"
  },
  button: {
    marginBottom: theme.spacing(1)
  },
  ticon: {
    // text icons
    fontSize: "inherit",
    transform: "rotate(-45deg)"
  }
});

function RepoCard(props) {
  const {
    classes,
    id,
    name,
    bb_project,
    bb_repo,
    bb_repo_url,
    git_url
  } = props;

  return (
    <React.Fragment key={id}>
      <Grid item xs={true}>
        <Card>
          <Grid container spacing={4}>
            <Grid item xs={true}>
              <CardContent>
                <Typography variant="h6">{name}</Typography>
                <List disablePadding={true}>
                  <ListItem divider={true} dense={true} disableGutters={true}>
                    <ListItemText
                      primary="BitBucket Project/Repo:"
                      secondary={
                        <Link href={bb_repo_url}>
                          {bb_project}/{bb_repo}
                          <Icon className={classes.ticon}>link</Icon>
                        </Link>
                      }
                    />
                  </ListItem>
                  <ListItem divider={true} dense={true} disableGutters={true}>
                    <ListItemText
                      primary="Git ssh clone URL:"
                      secondary={git_url}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Grid>
          </Grid>

          <CardActions className={classes.card_actions}>
            <Button
              color="default"
              variant="outlined"
              fullWidth={false}
              className={classes.button}
            >
              Delete
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </React.Fragment>
  );
}

const StyledRepoCard = withStyles(styles)(RepoCard);

export default StyledRepoCard;
