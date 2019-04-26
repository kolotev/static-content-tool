/*eslint no-console: ["error", { allow: ["warn", "error"] }] */
/* original sandbox https://codesandbox.io/s/j38lynp68w */
/* git hub connected sandbox https://codesandbox.io/s/github/kolotev/static-content-tool */
// TODO:
// error handling of axios reqyests
// error handling of recieved data inconsistencies/error.
//   - such as json parsing error
//   - unexpected/missing/bad properties values.

import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import AsyncSelect from "react-select/lib/Async";
import DependantAsyncSelect from "./DependantAsyncSelect";
import axios from "axios";
import { withSnackbar } from "notistack";

function inputComponent({ inputRef, ...props }) {
    return <div ref={inputRef} {...props} />;
}

function Control(props) {
    return (
        <TextField
            InputProps={{
                inputComponent,
                inputProps: {
                    className: props.selectProps.classes.input,
                    inputRef: props.innerRef,
                    children: props.children,
                    ...props.innerProps
                }
            }}
            {...props.selectProps.textFieldProps}
        />
    );
}

const components = {
    Control
};

const styles = theme => ({
    root: {
        overflow: "visible"
    },
    field: {
        margin: `${theme.spacing(2)}px 0`,
        display: "block"
    },
    input: {
        display: "flex",
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(1.5)
    }
});

class RepoAddDialog extends React.Component {
    state = {
        selectProjects: {
            loaded: false,
            options: [],
            selectedOption: null
        },
        selectRepos: {
            loaded: false,
            options: [],
            selectedOption: null
        },
        gitUrl: "",
        bbRepoUrl: "",
        submitAttempted: false
    };

    iState = this.state; // initial state
    iStateSelectProjects = this.iState.selectProjects;
    iStateSelectProjects = this.iState.selectRepos;
    iStateGitUrl = this.iState.gitUrl;
    iStateBBRepoUrl = this.iState.bbRepoUrl;
    reposRef = null; // :React.ElementRef<AsyncSelect>;

    handleCallback = callback =>
        typeof callback === "function" ? callback() : null;

    resetState = callback => {
        this.setState(this.iState, () => this.handleCallback(callback));
    };

    resetSelectProjects = callback => {
        this.resetSelectRepos(() =>
            this.setState(
                {
                    selectProjects: this.iStateSelectProjects
                },
                () => this.handleCallback(callback)
            )
        );
    };

    resetSelectRepos = callback => {
        this.resetGitUrl(() =>
            this.setState(
                {
                    selectRepos: this.iStateSelectProjects
                },
                () => this.handleCallback(callback)
            )
        );
    };

    resetGitUrl = callback => {
        this.setState(
            {
                gitUrl: this.iStateGitUrl
            },
            () => this.handleCallback(callback)
        );
    };

    resetBBRepoUrl = callback => {
        this.setState(
            {
                bbRepoUrl: this.iStateBBRepoUrl
            },
            () => this.handleCallback(callback)
        );
    };

    filterProjects = inputValue => {
        return this.state.selectProjects.options.filter(p =>
            p.label.toLowerCase().includes(inputValue.toLowerCase())
        );
    };

    filterRepos = inputValue => {
        return this.state.selectRepos.options.filter(r =>
            r.label.toLowerCase().includes(inputValue.toLowerCase())
        );
    };

    loadOptionsProjects = inputValue =>
        new Promise(resolve => {
            const url =
                // "https://test.ncbi.nlm.nih.gov/ipmc-dev11/ka/bb_projects.cgi";
                "https://test.ncbi.nlm.nih.gov/ipmc-dev11/ka/sct_api_proxy.cgi?http://ipmc-dev11.be-md.ncbi.nlm.nih.gov:5788/api/ncbi_bb/projects/";
            if (this.state.selectProjects.loaded)
                resolve(this.filterProjects(inputValue));
            else {
                axios
                    .get(url)
                    .then(response => {
                        let projects = response.data.map(
                            ({ id, name, key }, idx) => ({
                                label: name,
                                value: key,
                                id: id,
                                idx: idx
                            })
                        );
                        this.setState(
                            {
                                selectProjects: {
                                    loaded: true,
                                    selectedOption: null,
                                    options: projects
                                }
                            },
                            () => resolve(this.filterProjects(inputValue))
                        );
                    })
                    .catch(error => console.error(error));
            }
        });

    loadOptionsRepos = inputValue =>
        new Promise(resolve => {
            const { selectProjects, selectRepos } = this.state;
            if (selectProjects.loaded === null) resolve([]);
            else {
                /*const url = `https://test.ncbi.nlm.nih.gov/ipmc-dev11/ka/bb_repos.cgi?project=${
                    selectProjects.selectedOption.value
                }`;*/
                const url = `https://test.ncbi.nlm.nih.gov/ipmc-dev11/ka/sct_api_proxy.cgi?http://ipmc-dev11.be-md.ncbi.nlm.nih.gov:5788/api/ncbi_bb/projects/${
                    selectProjects.selectedOption.value
                }/repos/`;

                if (selectRepos.loaded) resolve(this.filterRepos(inputValue));
                else {
                    axios
                        .get(url)
                        .then(response => {
                            let repos = response.data.map(
                                ({ id, name, slug, links, project }, idx) => ({
                                    label: name,
                                    value: slug,
                                    id: id,
                                    idx: idx,
                                    git_url: links.clone.filter(item => item.name === 'ssh')[0],
                                    bb_repo_url: project.links.self.filter(item => 'href' in item)[0].href
                                })
                            );
                            this.setState(
                                {
                                    selectRepos: {
                                        loaded: true,
                                        selectedOption: null,
                                        options: repos
                                    }
                                },
                                () => {
                                    resolve(this.filterRepos(inputValue));
                                    this.reposRef.focus();
                                }
                            );
                        })
                        .catch(error => console.error(error));
                }
            }
        });

    onChangeProjects = (selectOption, { action }) => {
        const { selectProjects } = this.state;
        switch (action) {
            case "select-option":
                this.resetSelectRepos(() =>
                    this.setState({
                        selectProjects: {
                            loaded: selectProjects.loaded,
                            selectedOption: selectOption,
                            options: selectProjects.options
                        }
                    })
                );
                return;
            default:
                return;
        }
    };

    onChangeRepos = (selectedOption, { action }) => {
        const { selectRepos } = this.state;
        switch (action) {
            case "select-option":
                this.resetBBRepoUrl(() =>
                    this.resetGitUrl(() =>
                        this.setState({
                            selectRepos: {
                                loaded: selectRepos.loaded,
                                selectedOption: selectedOption,
                                options: selectRepos.options
                            },
                            gitUrl: selectedOption.git_url.href,
                            bbRepoUrl: selectedOption.bb_repo_url.href
                        })
                    )
                );
                return;
            default:
                return;
        }
    };

    onExit = e => {
        this.resetState();
        if (typeof this.props.onExit === "function") this.props.onExit(e);
    };

    onSubmit = e => {
        let isValid = true;

        this.setState({
            submitAttempted: true
        });
        const { gitUrl, bbRepoUrl } = this.state;
        const { enqueueSnackbar } = this.props;

        if (!(gitUrl)) {
            enqueueSnackbar("Git URL must not be empty", {
                variant: "error"
            });
            isValid = false;
        } else if (!gitUrl.startsWith("ssh://")) {
            enqueueSnackbar("Git URL must begin with ssh://", {variant: "error"});
            isValid = false;
        }
        if (!(bbRepoUrl)) {
            enqueueSnackbar("BitBucket URL must not be empty", {variant: "error"});
            isValid = false;
        } else if (!bbRepoUrl.startsWith("http://") && !bbRepoUrl.startsWith("https://")) {
            enqueueSnackbar("BitBucket URL must begin with http:// or https://", {variant: "error"});
            isValid = false;
        }

        if (!isValid) {
            e.preventDefault();
            return false;
        }
        return true;
    };

    render() {
        const { state, props } = this;
        const { classes, dialogProps } = props;
        const selectStyles = {
            menu: base => ({
                ...base,
                zIndex: 100
            })
        };

        return (
            <Dialog
                classes={{ paperScrollPaper: classes.root }}
                {...dialogProps}
                onExit={this.onExit}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">
                    Add a Repository
                </DialogTitle>

                <DialogContent className={classes.root}>
                    <DialogContentText>
                        To add an NCBI BitBucket Repository please choose the
                        project and repo from the lists below.
                    </DialogContentText>
                    <form
                        id="form-add-repo"
                        action="/repos/add"
                        // action={this.props.addRepoUrl}
                        method="POST"
                        onSubmit={this.onSubmit}
                    >
                        <AsyncSelect
                            id="bb-project-select"
                            styles={selectStyles}
                            className={classes.field}
                            name="bb-project"
                            placeholder=""
                            onChange={this.onChangeProjects}
                            loadOptions={this.loadOptionsProjects}
                            defaultOptions
                            cacheOptions
                            value={state.selectProjects.selectedOption}
                            openMenuOnFocus
                            autoFocus
                            classes={classes}
                            textFieldProps={{
                                variant: "outlined",
                                label: "NCBI BitBucket Project",
                                fullWidth: true,
                                InputLabelProps: {
                                    shrink: true
                                }
                            }}
                            components={components}
                        />
                        <DependantAsyncSelect
                            id="bb-repo-select"
                            ref={ref => {
                                this.reposRef = ref;
                            }}
                            styles={selectStyles}
                            className={classes.field}
                            placeholder="Select Repository*"
                            name="bb-repo"
                            isDisabled={!state.selectRepos.loaded}
                            onChange={this.onChangeRepos}
                            loadOptions={this.loadOptionsRepos}
                            defaultOptions
                            cacheOptions
                            dependantLoadOptionsArgs={
                                state.selectProjects.selectedOption
                            }
                            value={state.selectRepos.selectedOption}
                            openMenuOnFocus
                            classes={classes}
                            textFieldProps={{
                                variant: "outlined",
                                label: "NCBI BitBucket Repository",
                                fullWidth: true,
                                InputLabelProps: {
                                    shrink: true
                                }
                            }}
                            components={components}
                        />
                        <TextField
                            id="git-url-tf"
                            name="bb-git-url"
                            label="Git URL"
                            className={classes.field}
                            helperText={
                                state.submitAttempted && !state.gitUrl
                                    ? "Error: empty field"
                                    : Boolean(state.gitUrl) &&
                                      !state.gitUrl.startsWith("ssh://")
                                    ? "Error: must begin with ssh://"
                                    : ""
                            }
                            value={state.gitUrl}
                            inputRef={ref => {
                                this.gitUrlInputRef = ref;
                            }}
                            fullWidth
                            InputProps={{
                                readOnly: true
                            }}
                            InputLabelProps={{
                                shrink: true
                            }}
                            variant="outlined"
                            disabled={false}
                            error={
                                (state.submitAttempted &&
                                    !state.gitUrl) ||
                                (Boolean(state.gitUrl) &&
                                    !state.gitUrl.startsWith("ssh://"))
                            }
                        />
                        <TextField
                            id="bb-repo-url-tf"
                            name="bb-repo-url"
                            label="BitBucket repo URL"
                            className={classes.field}
                            helperText={
                                state.submitAttempted && !state.bbRepoUrl
                                    ? "Error: empty field"
                                    : Boolean(state.bbRepoUrl) &&
                                      !state.bbRepoUrl.startsWith("http://") &&
                                      !state.bbRepoUrl.startsWith("https://")
                                    ? "Error: must begin with http:// or https://"
                                    : ""
                            }
                            value={state.bbRepoUrl}
                            inputRef={ref => {
                                this.bbRepoUrlInputRef = ref;
                            }}
                            fullWidth
                            InputProps={{
                                readOnly: true
                            }}
                            InputLabelProps={{
                                shrink: true
                            }}
                            variant="outlined"
                            disabled={false}
                            error={
                                (state.submitAttempted &&
                                    !state.bbRepoUrl) ||
                                (Boolean(state.bbRepoUrl) &&
                                    !state.bbRepoUrl.startsWith("http://") &&
                                    !state.bbRepoUrl.startsWith("https://"))
                            }
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button
                        aria-label="Cancel"
                        onClick={dialogProps.onClose}
                        color="default"
                        variant="outlined"
                    >
                        Cancel
                    </Button>
                    <Button
                        aria-label="Save"
                        variant="contained"
                        color="primary"
                        type="submit"
                        form="form-add-repo" //target the form which you want to sent
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

/*RepoAddDialog.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
};
*/
export default withStyles(styles)(withSnackbar(RepoAddDialog));
