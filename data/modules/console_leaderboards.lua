local nk = require("nakama")
local Util = require("console_util")

local FOREVER = 3600*24*365*10 -- 10 years

local function _validate_create_request(request)
    if request.sort and request.sort ~= "asc" and request.sort ~= "desc" then
        error({"Invalid sort order", 3})
    end

    if request.operator and request.operator ~= "best" and request.operator ~= "set" and request.operator ~= "incr" then
        error({"Invalid operator", 3})
    end
end

local function create(context, payload)
    local request = Util.trim_empty(Util.http_request(context, payload))
    _validate_create_request(request)

    local id = nk.uuid_v4()

    nk.leaderboard_create(id, request.authoritative, request.sort, request.operator, request.reset, request.metadata)

    local response = {
        id = id
    }
    return nk.json_encode(response)
end

nk.register_rpc(create, "console.create_leaderboard")

local function delete(context, payload)
    local request = Util.http_request(context, payload)

    nk.leaderboard_delete(request.id)
end

nk.register_rpc(delete, "console.delete_leaderboard")

local function list(context, payload)
    local request = Util.http_request(context, payload)

    local leaderboards = nk.leaderboard_list(request.limit or 20)

    local result = {}
    if leaderboards and #leaderboards > 0 then
        result["total_count"] = #leaderboards
        result["leaderboards"] = leaderboards
    else
        result["total_count"] = 0
    end

    return nk.json_encode(result)
end

nk.register_rpc(list, "console.list_leaderboards")

local function get(context, payload)
    local request = Util.http_request(context, payload)
    local ids = {request.id}
    local leaderboard = nk.leaderboards_get_id(ids)

    if leaderboard and #leaderboard > 0 then
        return nk.json_encode(leaderboard[1])
    end
    error({"NotFound", 5}) -- Code 5 = NotFound from google.golang.org/grpc/codes
end

nk.register_rpc(get, "console.get_leaderboard")