

var buildZeroResultResp = function() {
  return {
    status: "_Zero_Result",
    time: new Date().getTime()
  };
}

var buildSuccessResp = function(data, dtg) {
  return {
    status: "_OK",
    time: new Date().getTime(),
    dtg: dtg,
    data: data
  };
}

var buildOperationFailResp = function(failcode) {
  return {
    status: "_Failure",
    time: new Date().getTime(),
    error: failcode
  };
}

var buildErrorResp = function(errcode) {
  return {
    status: "_Error",
    time: new Date().getTime(),
    error: errcode
  };
}

module.exports = {
  buildZeroResultResp: buildZeroResultResp,
  buildSuccessResp: buildSuccessResp,
  buildOperationFailResp: buildOperationFailResp,
  buildErrorResp: buildErrorResp
};
