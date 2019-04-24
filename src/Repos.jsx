/*eslint no-console: ["error", { allow: ["warn", "error"] }] */
/* https://codesandbox.io/s/github/kolotev/static-content-tool */
import React from "react";
import ReactDOM from "react-dom";
import withStyles from "@material-ui/core/styles/withStyles";
import App from "./_App";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
import Icon from "@material-ui/core/Icon";
import Tooltip from "@material-ui/core/Tooltip";
import { SnackbarProvider, withSnackbar } from "notistack";
import Fade from "@material-ui/core/Fade";
import CircularProgress from "@material-ui/core/CircularProgress";
import RepoCard from "./lib/RepoCard";
import RepoAddDialog from "./lib/RepoAddDialog";

const styles = theme => ({
    fab: {
        marginRight: theme.spacing(1)
    },
    grid_fabs_item: {
        display: "flex",
        justifyContent: "flex-end",
        flexBasis: "auto"
    },
    grid_spinner_container: {
        height: "100%"
    },
    grid_spinner_item: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexBasis: "auto"
    }
});

function LoadingSpinner(props) {
    const { loading } = props;
    return (
        <Fade in={loading} unmountOnExit>
            <CircularProgress />
        </Fade>
    );
}

function SnackSuccess(message) {
    return this.props.enqueueSnackbar(message, {
        variant: "success",
        autoHideDuration: 5000
    });
}

const DismissButton = withStyles({
    root: {
        color: "white",
        border: "1px solid rgba(255, 255, 255, 0.23)"
    }
})(Button);

function SnackFailureDismiss(message) {
    return this.props.enqueueSnackbar(message, {
        variant: "error",
        persist: true,
        action: (
            <DismissButton color="default" variant="outlined" size="small">
                {"Dismiss"}
            </DismissButton>
        )
    });
}

function SnackInfoDismiss(message) {
    return this.props.enqueueSnackbar(message, {
        variant: "info",
        persist: true,
        action: (
            <DismissButton color="default" variant="outlined" size="small">
                {"Dismiss"}
            </DismissButton>
        )
    });
}

class Repos extends React.Component {
    constructor(props) {
        super(props);
        // loaded:
        //         - false - "data" is not loaded.
        //         - true - "data" is loaded
        //         - undefined - "failure took place" at the time of loading/parsing data.
        this.state = {
            loaded: false,
            data: {},
            dialogOpen: false
        };
        this.boundSnackSuccess = SnackSuccess.bind(this);
        this.boundSnackFailureDismiss = SnackFailureDismiss.bind(this);
        this.boundSnackInfoDismiss = SnackInfoDismiss.bind(this);
    }

    parseData($data) {
        if (
            typeof $data === "undefined" ||
            $data === null ||
            !("innerHTML" in $data)
        ) {
            this.boundSnackFailureDismiss(
                'No data available [<script id="data" ... /> is missing]'
            );
        } else
            try {
                return JSON.parse($data.innerHTML);
            } catch (e) {
                console.error(e);
                this.boundSnackFailureDismiss(
                    "Failed parsing data [JSON.parse()]."
                );
            }
    }

    componentDidMount() {
        let parent = this;
        let waitingKey = this.boundSnackSuccess("Loading Repos.");
        //let $data = document.getElementById('data');
        let $data = document.querySelector(
            'script#data[type="application/json"]'
        );
        let data = this.parseData($data);
        setTimeout(function() {
            parent.props.closeSnackbar(waitingKey);
        }, 0);

        data === undefined
            ? this.setState({ loaded: undefined })
            : this.setState({ loaded: true, data: data });
    }

    handleAddRepoOpen = () => {
        this.setState({ dialogOpen: true });
    };

    handleAddRepoExit = () => {
        //alert("handleAddRepoExit()");
    };

    handleAddRepoOnClose = () => {
        //alert("handleAddRepoOnClose()");
        this.setState({ dialogOpen: false });
    };

    render() {
        const { classes } = this.props;
        const { loaded, data } = this.state;

        return loaded === true ? ( // data is loaded
            <div>
                <Grid container direction="column" spacing={4}>
                    <Grid item xs={true} className={classes.grid_fabs_item}>
                        <Tooltip
                            title="Add new repository"
                            aria-label="Add new repository"
                        >
                            <Fab
                                onClick={this.handleAddRepoOpen}
                                color="primary"
                                className={classes.fab}
                            >
                                <Icon>add_icon</Icon>
                            </Fab>
                        </Tooltip>
                    </Grid>
                    {data.repos.length > 0
                        ? data.repos.map((repoProps, idx) => (
                              <RepoCard {...repoProps} key={idx} />
                          ))
                        : (this.boundSnackInfoDismiss(
                              "No Repos yet. You can add new repository using button above."
                          ),
                          null)}
                </Grid>

                <RepoAddDialog
                    onExit={this.handleAddRepoExit}
                    onClose={this.handleAddRepoOnClose}
                    open={this.state.dialogOpen}
                />
                {/* App container */}
            </div>
        ) : this.state.loaded === false ? ( // loading seems in progress
            <Grid
                container
                direction="column"
                spacing={4}
                className={classes.grid_spinner_container}
            >
                <Grid item xs={true} className={classes.grid_spinner_item}>
                    <LoadingSpinner loading={this.state.loaded !== true} />
                </Grid>
            </Grid>
        ) : null;
    }
}

const SnackBarredRepos = withSnackbar(Repos);
const StyledRepos = withStyles(styles)(SnackBarredRepos);

function MainApp() {
    return (
        <SnackbarProvider
            maxSnack={3}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "center"
            }}
        >
            <App title="SCT Repos">
                <StyledRepos />
            </App>
        </SnackbarProvider>
    );
}

ReactDOM.render(<MainApp />, document.querySelector("#main_app"));

export default MainApp;
