local nk = require("nakama")

local FOREVER = 3600*24*365*10 -- 10 years

--- Ensure the rpc is only called as http REST from an authorized server (using http_key)
local function http_request(context, payload)
    if context.user_id then
        error("Invalid")
    end
    return nk.json_decode(payload)
end

local function create(context, payload)
    local request = http_request(context, payload)

    local id = nk.uuid_v4()

    local sort = request.sort  -- one of: "desc", "asc".
    sort = (sort and sort ~= "") and sort or "desc"

    local operator = request.operator -- one of: "best", "set", "incr"
    operator = (operator and operator ~= "") and operator or "best"

    local startTime = (nk.time() / 1000) -- start now
    if request.startTime and request.startTime > startTime then
        startTime = request.startTime
    end

    local endTime = request.endTime
    if not endTime or endTime <= 0 then
        endTime = startTime  + FOREVER -- End after FOREVER years
    end

    nk.tournament_create(
        id, sort, operator, request.duration, request.reset,
        request.metadata, request.title, request.description,
        request.category, startTime, endTime, request.maxSize,
        request.maxNumScores, request.joinRequired or false)

    local response = {
        id = id
    }
    return nk.json_encode(response)
end

nk.register_rpc(create, "console.create_tournament")

local function delete(context, payload)
    local request = http_request(context, payload)

    nk.tournament_delete(request.id)
end

nk.register_rpc(delete, "console.delete_tournament")

local function list(context, payload)
    local request = http_request(context, payload)

    local tournaments = nk.tournament_list(
        request.categoryStart or 0,
        request.categoryEnd or -1,
        request.startTime or 0,
        request.endTime or -1,
        request.limit or 20)

    local result = {
        tournaments = tournaments,
        total_count = #tournaments
    }
    return nk.json_encode(result)
end

nk.register_rpc(list, "console.list_tournaments")

local function get(context, payload)
    local request = http_request(context, payload)
    local ids = {request.id}
    local tournaments = nk.tournament_get(ids)

    local result = nil
    if tournaments and #tournaments > 0 then
        result = tournaments[1]
    else
        result = {error="Not Found", error_code=404}
    end

    return nk.json_encode(result)
end

nk.register_rpc(get, "console.get_tournament")