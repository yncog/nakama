local nk = require("nakama")
local Util = require("console_util")

local function list(context, payload)
    local request = Util.http_request(context, payload)
    
    local objects, cursor = nk.storage_list_full(
        request.user_id or "",
        request.collection or "",
        request.key or "",
        request.limit or 50,
        request.cursor or ""
    )

    local res = {}
    if objects and #objects > 0 then
        res["objects"] = objects
        if cursor then
            res["cursor"] = cursor
        end
        res["total_count"] = #objects
    else
        res["total_count"] = 0
    end

    return nk.json_encode(res)
end

nk.register_rpc(list, "console.list_storage")