local nk = require("nakama")

--- Ensure the rpc is only called from the console
local function _http_request(context, payload)
    if context.user_id then
        error("Invalid")
    end
    return nk.json_decode(payload)
end

local function list(context, payload)
    local request = _http_request(context, payload)
    
    local objects = nk.storage_list_full(
        request.user_id or "",
        request.collection or "",
        request.key or "",
        request.limit or 50,
        request.cursor or ""
    )
    
    if ~objects then
        objects = {}
    end

    local res = {}
    res["data"] = objects
    return nk.json_encode(objects)
    
end

nk.register_rpc(list, "console.list_storage")