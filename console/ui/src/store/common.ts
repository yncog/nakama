export type JSONValue = boolean | number | string | JSONObject | JSONArray

export interface JSONArray extends Array<JSONValue>{}

export interface JSONObject {
  [key: string]: JSONValue
}

export const doConsoleRpc = (rpc: string, payload: JSONValue|null, options: any = {}): Promise<JSONValue> => {
  if (rpc === null || rpc === undefined || rpc.length < 1) {
    throw new Error("'rpc' is a required parameter and must not be empty");
  }

  const urlPath = "/v2/console/rpc/{id}"
     .replace("{id}", encodeURIComponent(String(rpc)));

  const queryParams = {
  } as any;

  let _payload = null;
  _payload = JSON.stringify(payload || {});

  return window.nakama_api.doFetch(urlPath, "POST", queryParams, _payload, options)
};