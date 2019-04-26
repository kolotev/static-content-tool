// The base source of the following code is here
// https://stackoverflow.com/questions/45151914/populating-a-react-select-asynchronously
import AsyncSelect from "react-select/lib/Async";

export default class DependantAsyncSelect extends AsyncSelect {
    /**
     * reload()
     * Called when optional dependant load arguments change, to reload the
     * data from remote source with new options
     * loadOptions={
     *  (inputValue) => this.props.loadOptions(
     *      inputValue,
     *      this.props.dependantLoadOptionsArgs
     *    )
     *  }
     */
    reload() {
        this.loadOptions("", options => {
            console.warn(
                "reload:(): isLoading: %s !!this.lastRequest: %s",
                isLoading,
                !!this.lastRequest
            );
            const isLoading = !!this.lastRequest;
            this.setState({ defaultOptions: options || [], isLoading });
        });
    }

    componentWillReceiveProps(nextProps) {
        super.componentWillReceiveProps(nextProps);
        if (
            nextProps.dependantLoadOptionsArgs !==
            this.props.dependantLoadOptionsArgs
        ) {
            this.reload();
        }
    }
}
