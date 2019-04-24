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
            const isLoading = !!this.lastRequest;
            this.setState({ defaultOptions: options || [], isLoading });
        });
    }

    componentWillReceiveProps(nextProps) {
        // if the cacheOptions prop changes, clear the cache, force a reload
        if (nextProps.cacheOptions !== this.props.cacheOptions) {
            this.optionsCache = {};
        }
        /**
         * dependantLoadOptionsArgs
         * Optional property used in the remote request.
         * If these change externally, then the options should be reloaded.
         * This is handy for things like related selects.
         */
        if (
            nextProps.dependantLoadOptionsArgs !==
            this.props.dependantLoadOptionsArgs
        ) {
            this.reload();
        }
        if (nextProps.defaultOptions !== this.props.defaultOptions) {
            this.setState({
                defaultOptions: Array.isArray(nextProps.defaultOptions)
                    ? nextProps.defaultOptions
                    : undefined
            });
        }
    }
}
