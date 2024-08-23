"use strict";
exports.__esModule = true;
exports.BaseResponse = void 0;
var BaseResponse = /** @class */ (function () {
    function BaseResponse() {
        this.success = false;
    }
    BaseResponse.from = function (data, message, success) {
        if (success === void 0) { success = true; }
        var response = new BaseResponse();
        response.success = success;
        response.data = data;
        response.message = message;
        return response;
    };
    return BaseResponse;
}());
exports.BaseResponse = BaseResponse;
