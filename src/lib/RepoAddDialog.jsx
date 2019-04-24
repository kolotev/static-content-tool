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
        areProjectsLoaded: false,
        areReposLoaded: false,
        selectedProject: null,
        selectedRepo: null,
        selectGitUrl: null,
        projects: [],
        repos: []
    };
    initialState = this.state;
    reposSelect = null; // :React.ElementRef<AsyncSelect>;

    filterProjects = inputValue => {
        return this.state.projects.filter(p =>
            p.label.toLowerCase().includes(inputValue.toLowerCase())
        );
    };

    filterRepos = inputValue => {
        return this.state.repos.filter(r =>
            r.label.toLowerCase().includes(inputValue.toLowerCase())
        );
    };

    loadOptionsProjects = inputValue =>
        new Promise(resolve => {
            console.info(
                `loadOptionsProjects() this.state.areProjectsLoaded: ${
                    this.state.areProjectsLoaded
                }`
            );
            const url =
                "https://test.ncbi.nlm.nih.gov/ipmc-dev11/ka/bb_projects.cgi";
            this.state.areProjectsLoaded
                ? resolve(this.filterProjects(inputValue))
                : axios
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
                              projects: projects,
                              areProjectsLoaded: true
                          });
                          resolve(this.filterProjects(inputValue));
                      })
                      .catch(error => console.error(error));
        });

    loadOptionsRepos = inputValue =>
        new Promise(resolve => {
            if (this.state.selectedProject === null) return resolve([]);
            else {
                const url = `https://test.ncbi.nlm.nih.gov/ipmc-dev11/ka/bb_repos.cgi?project=${
                    this.state.selectedProject
                }`;
                console.info(`loadOptionsRepos() url: ${url}`);
                this.state.areReposLoaded
                    ? resolve(this.filterRepos(inputValue))
                    : axios
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
                              console.info(
                                  `loadOptionsRepos() # of loaded repos: ${
                                      repos.length
                                  }`
                              );
                              this.setState({
                                  repos: repos,
                                  areReposLoaded: true
                              });
                              resolve(this.filterRepos(inputValue));
                          })
                          .catch(error => console.error(error));
            }
        });

    onChangeProjects = (selectedOption, { action }) => {
        console.info(
            `onChangeProjects() selectedOption.value: ${
                selectedOption.value
            }, action: ${action}`
        );
        switch (action) {
            case "select-option":
                this.setState(
                    {
                        selectedProject: selectedOption.value,
                        selectedRepo: null
                    },
                    () => this.reposSelect.focus()
                );
                return;
            default:
                this.setState({ selectedProject: null, selectedRepo: null });
                return;
        }
    };

    onChangeRepos = (selectedOption, { action }) => {
        console.info(
            `onChangeRepos() selectedOption.value: ${
                selectedOption.value
            }, action: ${action}`
        );
        switch (action) {
            case "select-option":
                this.setState({
                    selectedRepo: selectedOption.value,
                    selectGitUrl: selectedOption.git_url.href
                });
                return;
            default:
                this.setState({ selectedRepo: null });
                return;
        }
    };

    onExit = e => {
        console.info("onExit: clear the form");
        this.setState(this.initialState);
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
                            onInputChange={this.onInputChangeProjects}
                            loadOptions={this.loadOptionsProjects}
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
                            isDisabled={state.selectedProject === null}
                            onChange={this.onChangeRepos}
                            onInputChange={this.onInputChangeRepos}
                            loadOptions={this.loadOptionsRepos}
                            dependantLoadOptionsArgs={state.selectedProject}
                        />
                        <TextField
                            key="git-url"
                            id="git-url-tf"
                            label="Git URL"
                            /*helperText="Another Gut URL"*/
                            value={state.selectGitUrl}
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
