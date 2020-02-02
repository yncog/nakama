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
	"context"
	"encoding/json"
	"strings"

	"github.com/heroiclabs/nakama-common/api"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/status"
)

func (s *ConsoleServer) RpcFunc(ctx context.Context, in *api.Rpc) (*api.Rpc, error) {
	if in.Id == "" {
		return nil, status.Error(codes.InvalidArgument, "RPC ID must be set")
	}

	id := strings.ToLower(in.Id)

	fn := s.runtime.Rpc(id)
	if fn == nil {
		return nil, status.Error(codes.NotFound, "RPC function not found")
	}

	queryParams := make(map[string][]string, 0)
	md, ok := metadata.FromIncomingContext(ctx)
	if !ok {
		return nil, status.Error(codes.Internal, "RPC function could not get incoming context")
	}
	for k, vs := range md {
		if k != "http_key" {
			queryParams[k[2:]] = vs
		}
	}
	// Prepare input to function.

	// Check if we need to mimic existing GRPC Gateway behaviour or expect to receive/send unwrapped data.
	// Any value for this query parameter, including the parameter existing with an empty value, will
	// indicate that raw behaviour is expected.
	_, unwrap := queryParams["unwrap"]

	var payload string
	if len(in.Payload) > 0 && !unwrap {
		// Maybe attempt to decode to a JSON string to mimic existing GRPC Gateway behaviour.
		b := []byte(in.Payload)
		err := json.Unmarshal(b, &payload)
		if err != nil {
			return nil, status.Error(codes.InvalidArgument, "Cannot unmarshal JSON string!")
		}
	} else {
		payload = in.Payload
	}

	clientIP, clientPort := extractClientAddressFromContext(s.logger, ctx)

	result, fnErr, code := fn(ctx, queryParams, "", "", nil, 0, "", clientIP, clientPort, payload)
	if fnErr != nil {
		return nil, status.Error(code, fnErr.Error())
	}

	// Return the successful result.
	if !unwrap {
		var response []byte
		// GRPC Gateway equivalent behaviour.
		var err error
		response, err = json.Marshal(map[string]interface{}{"payload": result})
		if err != nil {
			return nil, status.Error(codes.Internal, "Error marshaling wrapped response to client")
		}
		result = string(response)
	}
	return &api.Rpc{Payload: result}, nil
}
