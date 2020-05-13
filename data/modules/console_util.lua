local nk = require("nakama")

local Util = {}

--- Ensure the rpc is only called from the console
function Util.http_request(context, payload)
    if context.user_id then
        error("Invalid")
    end
    return nk.json_decode(payload)
end

function Util.trim_empty(request)
    -- remove all empty strings
    for key, value in pairs(request) do
        if value == "" then
            request[key] = nil
        end
    end
    return request
end

return Util