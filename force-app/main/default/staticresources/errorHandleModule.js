(function() {
    function handleError(error, errorMessage) {
        var message = errorMessage;
        if (Array.isArray(error.body)) {
            message = message + ' ' + error.body.map(e => e.message).join(', ')
        } else if (typeof error.body.message === 'string') {
            message = message + ' ' + error.body.message
        }
        if (error.body != null && error.body.output != null) {
            if (error.body.output.errors != null && typeof error.body.output.errors === 'object' && error.body.output.errors.length > 0) {
                error.body.output.errors.forEach(er => {
                    message = message + ' ' + er.errorCode;
                    message = message + ' ' + er.message;
                    if (er.duplicateRecordError != null && typeof er.duplicateRecordError === 'object' && er.duplicateRecordError.matchResults != null && typeof er.duplicateRecordError.matchResults === 'object' && er.duplicateRecordError.matchResults.length > 0) {
                        message = message + ' Following are the matching records';
                        er.duplicateRecordError.matchResults.forEach(erMatchRec => {
                            erMatchRec.matchRecordIds.forEach(matchRec => {
                                message = message + ' ' + matchRec
                            })
                        })
                    }
                });
            } else if (error.body.output.fieldErrors != null && typeof error.body.output.errors === 'object') {
                Object.keys(error.body.output.fieldErrors).forEach(x => {
                    console.log(x);
                    error.body.output.fieldErrors[x].forEach(y => {
                        message = message + ' ' + y.errorCode;
                        message = message + ' ' + y.message;
                    })
                });
            }
        }
        //this.createLoggerEntry(message);
        return message;
    }
    window.handleError = handleError;
})();