// Copyright 2018 The Nakama Authors
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package server

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"

	"github.com/grpc-ecosystem/grpc-gateway/runtime"
	"go.uber.org/zap"
)

const consoleRpcPrefix string = "console."
const consoleRpcRoutePrefix string = "/v2/console/rpc/"

// Should be already authenticated!
func (s *ConsoleServer) httpRpcHandler(w http.ResponseWriter, r *http.Request) {
	maybeID := r.URL.Path[len(consoleRpcRoutePrefix):]
	if strings.HasSuffix(maybeID, "/") {
		maybeID = maybeID[:len(maybeID)-1]
	}

	// Check the RPC function ID.
	if maybeID == "" {
		// Missing RPC function ID.
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		_, err := w.Write(rpcIDMustBeSetBytes)
		if err != nil {
			s.logger.Debug("Error writing response to client", zap.Error(err))
		}
		return
	}

	id := fmt.Sprintf("%s%s", consoleRpcPrefix, strings.ToLower(maybeID))

	// Find the correct RPC function.
	fn := s.runtime.Rpc(id)
	if fn == nil {
		// No function registered for this ID.
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusNotFound)
		errData := []byte(fmt.Sprintf(RPCNotFoundErrorTemplate, fmt.Sprintf(RPCNotFoundErrorMessageTemplate, id)))
		_, err := w.Write(errData)
		if err != nil {
			s.logger.Debug("Error writing response to client", zap.Error(err))
		}
		return
	}

	// Prepare input to function.
	var payload string
	if r.Method == "POST" {
		b, err := ioutil.ReadAll(r.Body)
		if err != nil {
			// Error reading request body.
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusInternalServerError)
			_, err := w.Write(internalServerErrorBytes)
			if err != nil {
				s.logger.Debug("Error writing response to client", zap.Error(err))
			}
			return
		}
		payload = string(b)
	}
	queryParams := r.URL.Query()
	queryParams.Del("http_key")

	clientIP, clientPort := extractClientAddressFromRequest(s.logger, r)
	result, fnErr, code := fn(r.Context(), queryParams, "", "", nil, 0, "", clientIP, clientPort, payload)
	if fnErr != nil {
		response, _ := json.Marshal(map[string]interface{}{"error": fnErr, "message": fnErr.Error(), "code": code})
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(runtime.HTTPStatusFromCode(code))
		_, err := w.Write(response)
		if err != nil {
			s.logger.Debug("Error writing response to client", zap.Error(err))
		}
		return
	}

	// Return the successful result.
	response := []byte(result)
	//if contentType := r.Header["Content-Type"]; len(contentType) > 0 {
	// Assume the request input content type is the same as the expected response.
	//	w.Header().Set("Content-Type", contentType[0])
	//} else {
	// Fall back to default response content type application/json.
	w.Header().Set("Content-Type", "application/json")
	//}
	w.WriteHeader(http.StatusOK)
	_, err := w.Write(response)
	if err != nil {
		s.logger.Debug("Error writing response to client", zap.Error(err))
	}
}
