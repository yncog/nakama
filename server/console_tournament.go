// Copyright 2019 The Nakama Authors
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

	"github.com/gofrs/uuid"
	"github.com/golang/protobuf/ptypes/empty"
	"github.com/heroiclabs/nakama-common/api"
	"github.com/heroiclabs/nakama/v2/console"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

// Create a new tournament from the given data and return its id
func (s *ConsoleServer) CreateTournament(ctx context.Context, in *console.CreateTournamentRequest) (*console.TournamentId, error) {
	sortOrder := LeaderboardSortOrderAscending
	if in.Tournament.SortOrder > 0 {
		sortOrder = LeaderboardSortOrderDescending
	}

	var operator int
	switch in.Operator {
	case "best":
		operator = LeaderboardOperatorBest
	case "set":
		operator = LeaderboardOperatorSet
	case "incr":
		operator = LeaderboardOperatorIncrement
	default:
		return nil, StatusError(codes.InvalidArgument, "Operator should be one of 'best', 'set', or 'incr'")
	}

	if in.Tournament.Duration == 0 {
		return nil, StatusError(codes.InvalidArgument, "Duration must be > 0")
	}

	if in.ResetSchedule != "" {
		if _, err := cronexpr.Parse(in.ResetSchedule); err != nil {
			return nil, StatusError(codes.InvalidArgument, "Reset schedule should be a valid CRON expression")
		}
	}

	metadata := l.OptTable(6, nil)
	metadataStr := "{}"
	if metadata != nil {
		metadataMap := RuntimeLuaConvertLuaTable(metadata)
		metadataBytes, err := json.Marshal(metadataMap)
		if err != nil {
			l.RaiseError("error encoding metadata: %v", err.Error())
			return 0
		}
		metadataStr = string(metadataBytes)
	}

	title := l.OptString(7, "")
	description := l.OptString(8, "")
	category := l.OptInt(9, 0)
	if category < 0 || category >= 128 {
		l.ArgError(9, "category must be 0-127")
		return 0
	}
	startTime := l.OptInt(10, 0)
	if startTime < 0 {
		l.ArgError(10, "startTime must be >= 0.")
		return 0
	}
	endTime := l.OptInt(11, 0)
	if endTime != 0 && endTime <= startTime {
		l.ArgError(11, "endTime must be > startTime. Use 0 to indicate a tournament that never ends.")
		return 0
	}
	maxSize := l.OptInt(12, 0)
	if maxSize < 0 {
		l.ArgError(12, "maxSize must be >= 0")
		return 0
	}
	maxNumScore := l.OptInt(13, 0)
	if maxNumScore < 0 {
		l.ArgError(13, "maxNumScore must be >= 0")
		return 0
	}
	
	TournamentCreate(
		ctx, s.logger, s.leaderboardCache, s.leaderboardScheduler, 
		uuid.Must(uuid.NewV4()), sortOrder, operator, 
	return nil, nil
}

// GetTournament implements the corresponding GRPC rpc
func (s *ConsoleServer) GetTournament(ctx context.Context, in *console.TournamentId) (*api.Tournament, error) {
	tournamentID, err := uuid.FromString(in.Id)
	if err != nil || tournamentID == uuid.Nil {
		return nil, status.Error(codes.InvalidArgument, "Requires a valid tournament ID.")
	}

	tournaments, err := TournamentsGet(ctx, s.logger, s.db, []string{in.Id})
	if err != nil {
		// Error logged in the core function above.
		return nil, status.Error(codes.Internal, "An error occurred while trying get the tournament.")
	} else if len(tournaments) < 1 {
		return nil, status.Error(codes.NotFound, "No such tournament.")
	}

	return tournaments[0], nil
}

//
func (s *ConsoleServer) UpdateTournament(ctx context.Context, in *api.Tournament) (*empty.Empty, error) {
	/*// Delete all but the system user. Related data will be removed by cascading constraints.
	_, err := s.db.ExecContext(ctx, "DELETE FROM users WHERE id <> '00000000-0000-0000-0000-000000000000'")
	if err != nil {
		s.logger.Error("Error deleting all user accounts.", zap.Error(err))
		return nil, status.Error(codes.Internal, "An error occurred while trying to delete all users.")
	}*/
	return nil, nil
}

//
func (s *ConsoleServer) DeleteTournament(ctx context.Context, in *console.TournamentId) (*empty.Empty, error) {
	/*// Delete all but the system user. Related data will be removed by cascading constraints.
	_, err := s.db.ExecContext(ctx, "DELETE FROM users WHERE id <> '00000000-0000-0000-0000-000000000000'")
	if err != nil {
		s.logger.Error("Error deleting all user accounts.", zap.Error(err))
		return nil, status.Error(codes.Internal, "An error occurred while trying to delete all users.")
	}*/
	return nil, nil
}

func (s *ConsoleServer) QueryTournaments(ctx context.Context, in *api.ListTournamentsRequest) (*api.TournamentList, error) {
	return nil, nil
	// Searching only through tombstone records.
	/*if in.Tombstones {
		var userID *uuid.UUID
		if in.Filter != "" {
			uid, err := uuid.FromString(in.Filter)
			if err != nil {
				// Filtering for a tombstone using username, no results are possible.
				return &console.UserList{
					TotalCount: countUsers(ctx, s.logger, s.db),
				}, nil
			}
			userID = &uid
		}

		if userID != nil {
			// Looking up a single specific tombstone.
			var createTime pgtype.Timestamptz
			err := s.db.QueryRowContext(ctx, "SELECT create_time FROM user_tombstone WHERE user_id = $1", *userID).Scan(&createTime)
			if err != nil {
				if err == sql.ErrNoRows {
					return &console.UserList{
						TotalCount: countUsers(ctx, s.logger, s.db),
					}, nil
				}
				s.logger.Error("Error looking up user tombstone.", zap.Any("in", in), zap.Error(err))
				return nil, status.Error(codes.Internal, "An error occurred while trying to list users.")
			}

			return &console.UserList{
				Users: []*api.User{
					{
						Id:         in.Filter,
						UpdateTime: &timestamp.Timestamp{Seconds: createTime.Time.Unix()},
					},
				},
				TotalCount: countUsers(ctx, s.logger, s.db),
			}, nil
		}

		query := "SELECT user_id, create_time FROM user_tombstone LIMIT 50"

		rows, err := s.db.QueryContext(ctx, query)
		if err != nil {
			s.logger.Error("Error querying user tombstones.", zap.Any("in", in), zap.Error(err))
			return nil, status.Error(codes.Internal, "An error occurred while trying to list users.")
		}

		users := make([]*api.User, 0, 50)

		for rows.Next() {
			var id string
			var createTime pgtype.Timestamptz
			if err = rows.Scan(&id, &createTime); err != nil {
				_ = rows.Close()
				s.logger.Error("Error scanning user tombstones.", zap.Any("in", in), zap.Error(err))
				return nil, status.Error(codes.Internal, "An error occurred while trying to list users.")
			}

			users = append(users, &api.User{
				Id:         id,
				UpdateTime: &timestamp.Timestamp{Seconds: createTime.Time.Unix()},
			})
		}
		_ = rows.Close()

		return &console.UserList{
			Users:      users,
			TotalCount: countUsers(ctx, s.logger, s.db),
		}, nil
	}

	if in.Filter != "" {
		_, err := uuid.FromString(in.Filter)
		// If the filter is not a valid user ID treat it as a username instead.

		var query string
		params := []interface{}{in.Filter}
		if err != nil {
			query = "SELECT id, username, display_name, avatar_url, lang_tag, location, timezone, metadata, facebook_id, google_id, gamecenter_id, steam_id, edge_count, create_time, update_time FROM users WHERE username = $1"
		} else {
			query = "SELECT id, username, display_name, avatar_url, lang_tag, location, timezone, metadata, facebook_id, google_id, gamecenter_id, steam_id, edge_count, create_time, update_time FROM users WHERE id = $1"
		}

		if in.Banned {
			query += " AND disable_time <> '1970-01-01 00:00:00 UTC'"
		}

		rows, err := s.db.QueryContext(ctx, query, params...)
		if err != nil {
			s.logger.Error("Error querying users.", zap.Any("in", in), zap.Error(err))
			return nil, status.Error(codes.Internal, "An error occurred while trying to list users.")
		}

		users := make([]*api.User, 0, 2)

		for rows.Next() {
			user, err := convertUser(s.tracker, rows)
			if err != nil {
				_ = rows.Close()
				s.logger.Error("Error scanning users.", zap.Any("in", in), zap.Error(err))
				return nil, status.Error(codes.Internal, "An error occurred while trying to list users.")
			}
			users = append(users, user)
		}
		_ = rows.Close()

		return &console.UserList{
			Users:      users,
			TotalCount: countUsers(ctx, s.logger, s.db),
		}, nil
	}

	var query string

	if in.Banned {
		query = "SELECT id, username, display_name, avatar_url, lang_tag, location, timezone, metadata, facebook_id, google_id, gamecenter_id, steam_id, edge_count, create_time, update_time FROM users WHERE disable_time <> '1970-01-01 00:00:00 UTC' LIMIT 50"
	} else {
		query = "SELECT id, username, display_name, avatar_url, lang_tag, location, timezone, metadata, facebook_id, google_id, gamecenter_id, steam_id, edge_count, create_time, update_time FROM users LIMIT 50"
	}

	rows, err := s.db.QueryContext(ctx, query)
	if err != nil {
		s.logger.Error("Error querying users.", zap.Any("in", in), zap.Error(err))
		return nil, status.Error(codes.Internal, "An error occurred while trying to list users.")
	}

	users := make([]*api.User, 0, 50)

	for rows.Next() {
		user, err := convertUser(s.tracker, rows)
		if err != nil {
			_ = rows.Close()
			s.logger.Error("Error scanning users.", zap.Any("in", in), zap.Error(err))
			return nil, status.Error(codes.Internal, "An error occurred while trying to list users.")
		}

		users = append(users, user)
	}
	_ = rows.Close()

	return &console.UserList{
		Users:      users,
		TotalCount: countUsers(ctx, s.logger, s.db),
	}, nil*/
}
