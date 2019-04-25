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
import Select from "react-select";

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
    gitUrl: ""
  };

  iState = this.state; // initial state
  iStateSelectProjects = this.iState.selectProjects;
  iStateSelectProjects = this.iState.selectRepos;
  iStategitUrl = this.iState.gitUrl;
  reposSelect = null; // :React.ElementRef<AsyncSelect>;

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
        GitUrl: this.iStateGitUrl
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
      const url = "https://test.ncbi.nlm.nih.gov/ipmc-dev11/ka/bb_projects.cgi";
      if (this.state.selectProjects.loaded)
        resolve(this.filterProjects(inputValue));
      else {
        console.info(`loadOptionsProjects() url: ${url}`);
        axios
          .get(url)
          .then(response => {
            let projects = response.data.map(({ id, name, key }, idx) => ({
              label: name,
              value: key,
              id: id,
              idx: idx
            }));
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
                  this.reposSelect.focus();
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
        this.resetSelectProjects();
        return;
    }
  };

  onChangeRepos = (selectedOption, { action }) => {
    const { selectRepos } = this.state;
    switch (action) {
      case "select-option":
        this.resetGitUrl(() =>
          this.setState({
            selectRepos: {
              loaded: selectRepos.loaded,
              selectedOption: selectedOption,
              options: selectRepos.options
            },
            gitUrl: selectedOption.git_url.href
          })
        );
        return;
      default:
        this.resetSelectRepos();
        return;
    }
  };

  onExit = e => {
    this.resetState();
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
        classes={{ paperScrollPaper: classes.root }}
        {...otherProps}
        onExit={this.onExit}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add a Repository</DialogTitle>

        <DialogContent className={classes.root}>
          <DialogContentText>
            To add an NCBI BitBucket Repository please choose the project and
            repo from the lists below.
          </DialogContentText>
          <form
            id="form-add-repo"
            action="/repos/add"
            // action={this.props.addRepoUrl}
            method="POST"
            onSubmit={e => {
              e.preventDefault();
              alert("Submitted form!");
              this.handleClose();
            }}
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
                this.reposSelect = ref;
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
              dependantLoadOptionsArgs={state.selectProjects.selectedOption}
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
              label="Git URL"
              className={classes.field}
              /*helperText="Another Gut URL"*/
              value={state.gitUrl}
              fullWidth
              InputProps={{
                readOnly: true
              }}
              InputLabelProps={{
                shrink: true
              }}
              variant="outlined"
              disabled
            />
          </form>
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

const StyledRepoAddDialog = withStyles(styles)(RepoAddDialog);

export default StyledRepoAddDialog;
