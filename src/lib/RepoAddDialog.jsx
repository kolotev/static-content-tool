/* original sandbox https://codesandbox.io/s/j38lynp68w */
/* git hub connected sandbox https://codesandbox.io/s/github/kolotev/static-content-tool */
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

const styles = theme => ({
    dialogContent: {
        minHeight: "auto",
        overflow: "hidden"
    },
    select: {
        margin: `${theme.spacing(1)}px 0`
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
        gitUrl: ""
    };

    iState = this.state; // initial state
    iStateSelectProjects = this.iState.selectProjects;
    iStateSelectProjects = this.iState.selectRepos;
    iStategitUrl = this.iState.gitUrl;
    reposSelect = null; // :React.ElementRef<AsyncSelect>;

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
                "https://test.ncbi.nlm.nih.gov/ipmc-dev11/ka/bb_projects.cgi";
            if (this.state.selectProjects.loaded)
                resolve(this.filterProjects(inputValue));
            else {
                console.info(`loadOptionsProjects() url: ${url}`);
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
                        this.setState({
                            selectProjects: {
                                loaded: true,
                                selectedOption: null,
                                options: projects
                            }
                        });
                        resolve(this.filterProjects(inputValue));
                    })
                    .catch(error => console.error(error));
            }
        });

    loadOptionsRepos = inputValue =>
        new Promise(resolve => {
            const { selectProjects, selectRepos } = this.state;
            if (selectProjects.loaded === null) resolve([]);
            else {
                const url = `https://test.ncbi.nlm.nih.gov/ipmc-dev11/ka/bb_repos.cgi?project=${
                    selectProjects.selectedOption.value
                }`;

                if (selectRepos.loaded) resolve(this.filterRepos(inputValue));
                else {
                    console.info(`loadOptionsRepos() url: ${url}`);
                    axios
                        .get(url)
                        .then(response => {
                            let repos = response.data.map(
                                ({ id, name, slug, links }, idx) => ({
                                    label: name,
                                    value: slug,
                                    id: id,
                                    idx: idx,
                                    git_url: links.clone[1]
                                })
                            );
                            this.setState({
                                selectRepos: {
                                    loaded: true,
                                    selectedOption: null,
                                    options: repos
                                }
                            });
                            resolve(this.filterRepos(inputValue));
                        })
                        .catch(error => console.error(error));
                }
            }
        });

    resetSelectProjects = () => {
        this.setState({
            selectProjects: this.iStateSelectProjects
        });
        this.resetSelectRepos();
    };

    resetSelectRepos = () => {
        this.setState({
            selectRepos: this.iStateSelectProjects
        });
        this.resetGitUrl();
    };

    resetGitUrl = () => {
        this.setState({
            GitUrl: this.iStateGitUrl
        });
    };

    onChangeProjects = (selectOption, { action }) => {
        switch (action) {
            case "select-option":
                this.setState(
                    {
                        selectProjects: {
                            selectedOption: selectOption
                        },
                        selectRepos: {
                            selectedOption: null
                        },
                        gitUrl: ""
                    },
                    () => this.reposSelect.focus()
                );
                return;
            default:
                this.resetSelectProjects();
                return;
        }
    };

    onChangeRepos = (selectedOption, { action }) => {
        console.info(
            `onChangeRepos() selectedOption.value: ${selectedOption}, action: ${action}`
        );
        switch (action) {
            case "select-option":
                this.setState({
                    selectRepos: {
                        selectedOption: selectedOption
                    },
                    gitUrl: selectedOption.git_url.href
                });

                return;
            default:
                this.resetSelectRepos();
                return;
        }
    };

    onExit = e => {
        this.setState(this.iState);
        if (typeof this.props.onExit === "function") this.props.onExit(e);
    };

    render() {
        const { state, props } = this;
        const { classes, ...otherProps } = props;
        const selectStyles = {
            menu: base => ({
                ...base,
                zIndex: 100
            })
        };

        return (
            <Dialog
                {...otherProps}
                onExit={this.onExit}
                aria-labelledby="form-dialog-title"
            >
                <form
                    action="/"
                    method="POST"
                    onSubmit={e => {
                        e.preventDefault();
                        alert("Submitted form!");
                        this.handleClose();
                    }}
                >
                    <DialogTitle id="form-dialog-title">
                        Add a Repository
                    </DialogTitle>
                    <DialogContent classes={{ root: classes.dialogContent }}>
                        <DialogContentText>
                            To add an NCBI BitBucket Repository please choose
                            the project and repo from the lists below.
                        </DialogContentText>
                        <AsyncSelect
                            key="project"
                            id="bb-project-select"
                            styles={selectStyles}
                            className={classes.select}
                            name="bb-project"
                            placeholder="Select Project*"
                            openMenuOnFocus
                            autoFocus
                            cacheOptions
                            defaultOptions
                            onChange={this.onChangeProjects}
                            loadOptions={this.loadOptionsProjects}
                            value={state.selectProjects.selectedOption}
                        />
                        <DependantAsyncSelect
                            key="repo"
                            ref={ref => {
                                this.reposSelect = ref;
                            }}
                            id="bb-repo-select"
                            styles={selectStyles}
                            className={classes.select}
                            placeholder="Select Repository*"
                            name="bb-repo"
                            openMenuOnFocus
                            defaultOptions
                            isDisabled={
                                state.selectProjects.selectedOption === null
                            }
                            onChange={this.onChangeRepos}
                            loadOptions={this.loadOptionsRepos}
                            dependantLoadOptionsArgs={
                                state.selectProjects.selectedOption !== null
                                    ? state.selectProjects.selectedOption.value
                                    : null
                            }
                            value={state.selectRepos.selectedOption}
                        />
                        <TextField
                            key="git-url"
                            id="git-url-tf"
                            label="Git URL"
                            /*helperText="Another Gut URL"*/
                            value={state.gitUrl}
                            margin="normal"
                            fullWidth
                            InputProps={{
                                readOnly: true
                            }}
                            InputLabelProps={{
                                shrink: true
                            }}
                            variant="filled"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button
                            aria-label="Cancel"
                            onClick={this.props.onClose}
                            color="default"
                            variant="outlined"
                        >
                            Cancel
                        </Button>
                        <Button
                            aria-label="Save"
                            variant="contained"
                            color="primary"
                            type="submit" //set the buttom type is submit
                            form="save_repo_form" //target the form which you want to sent
                        >
                            Save
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        );
    }
}

const StyledRepoAddDialog = withStyles(styles)(RepoAddDialog);

export default StyledRepoAddDialog;
