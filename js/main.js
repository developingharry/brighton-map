function viewModel() {
    this.listIsVisible = ko.observable(true);
    toggleList = function() {
        this.listIsVisible(!this.listIsVisible());
    };
}
ko.applyBindings(viewModel);
