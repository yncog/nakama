import React, {Component} from 'react';
import {RouteComponentProps} from 'react-router';
import {Link} from 'react-router-dom';

import {Dispatch} from 'redux';
import {connect} from 'react-redux';
import {ApplicationState, ConnectedReduxProps} from '../../store';
import * as tournamentActions from '../../store/tournaments/actions';
import {NewTournamentRequest, TournamentReference} from '../../store/tournaments/types';

import {
  Breadcrumb,
  Button,
  Column,
  Control,
  Field,
  Generic,
  Input,
  Label,
  Level,
  Notification,
  Section,
  Select,
  Textarea
} from 'rbx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import Header from '../../components/header';
import Sidebar from '../../components/sidebar';

/*
 * https://dfee.github.io/rbx/
 */

interface PropsFromState {
  loading: boolean,
  data: TournamentReference,
  errors: string | undefined
}

interface PropsFromDispatch {
  createRequest: typeof tournamentActions.tournamentCreateRequest
}

type Props = RouteComponentProps & PropsFromState & PropsFromDispatch & ConnectedReduxProps;

type State = {};

class NewTournament extends Component<Props, State> {
  
  public key(prefix: string) {
    return `${prefix}_new_tournament`;
  }

  public create(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.target as HTMLFormElement);
    const payload = {
      title: data.get('title') as string,
      description: data.get('description') as string,
      category: parseInt(data.get('category') as string),
      sort_order: data.get('sort_order') as string,
      operator: data.get('operator') as string,
      max_size: parseInt(data.get('max_size') as string),
      max_num_scores: parseInt(data.get('max_num_scores') as string),
      duration: parseInt(data.get('duration') as string),
      start_time: parseInt(data.get('start_time') as string),
      end_time: parseInt(data.get('end_time') as string),
      reset: (data.get('reset') as string),
      metadata: (data.get('metadata') as string),
      join_required: (data.get('join_required') as string) == 'true'
    };
    this.props.createRequest(payload);
    this.details();
  }

  public details()
  {
    const {history, data} = this.props;
    history.push(`/tournaments/${data.id}`);
  }

  public render() {
    const {errors, data} = this.props;
    return <Generic id="new_tournament">
      <Header/>
      <Section>
        <Column.Group>
          <Sidebar active="tournaments"/>

          <Column>
            <Level>
              <Level.Item align="left">
                <Level.Item>
                  <Breadcrumb>
                    <Breadcrumb.Item as="span"><Link to="/tournaments">Tournaments</Link></Breadcrumb.Item>
                    <Breadcrumb.Item active>New Tournament</Breadcrumb.Item>
                  </Breadcrumb>
                </Level.Item>
              </Level.Item>
            </Level>

            <form onSubmit={this.create.bind(this)}>
              <Column.Group>
                <Column size={8}>
                  <Field horizontal>
                    <Field.Label size="normal" textAlign="left">
                      <Label>Title</Label>
                    </Field.Label>
                    <Field.Body>
                      <Field>
                        <Control>
                          <Input
                            key={this.key('title')}
                            type="text"
                            name="title"
                          />
                        </Control>
                      </Field>
                    </Field.Body>
                  </Field>
                </Column>
              </Column.Group>
              <Column.Group>
                <Column size={8}>
                  <Field>
                    <Label>Description</Label>
                    <Field>
                      <Control>
                        <Textarea
                          key={this.key('description')}
                          placeholder="Description"
                          rows={2}
                          name="description"
                        />
                      </Control>
                    </Field>
                  </Field>
                </Column>
              </Column.Group>
              <Column.Group>
                <Column size={8}>
                <Field horizontal>
                    <Field.Label size="normal" textAlign="left">
                      <Label>Category</Label>
                    </Field.Label>
                    <Field.Body>
                      <Field>
                        <Control>
                          <Input
                            key={this.key('category')}
                            type="number"
                            min="0"
                            max="127"
                            name="category"
                          />
                        </Control>
                      </Field>
                    </Field.Body>
                  </Field>

                  <Field horizontal>
                    <Field.Label size="normal" textAlign="left">
                      <Label>Sort Order</Label>
                    </Field.Label>
                    <Field.Body>
                      <Field>
                        <Control>
                          <Select.Container>
                            <Select
                              key={this.key('sort_order')}
                              name="sort_order"
                            >
                              <Select.Option value="desc">Descending</Select.Option>
                              <Select.Option value="asc">Ascending</Select.Option>
                            </Select>
                          </Select.Container>
                        </Control>
                      </Field>
                    </Field.Body>
                  </Field>

                  <Field horizontal>
                    <Field.Label size="normal" textAlign="left">
                      <Label>Operator Type</Label>
                    </Field.Label>
                    <Field.Body>
                      <Field>
                        <Control>
                          <Select.Container>
                            <Select
                              key={this.key('operator')}
                              name="operator"
                            >
                              <Select.Option value="best">Best</Select.Option>
                              <Select.Option value="set">Set</Select.Option>
                              <Select.Option value="incr">Increment</Select.Option>
                            </Select>
                          </Select.Container>
                        </Control>
                      </Field>
                    </Field.Body>
                  </Field>

                  <Field horizontal>
                    <Field.Label size="normal" textAlign="left">
                      <Label>Max Num Score</Label>
                    </Field.Label>
                    <Field.Body>
                      <Field>
                        <Control>
                          <Input
                            key={this.key('max_num_score')}
                            type="number"
                            name="max_num_score"
                          />
                        </Control>
                      </Field>
                    </Field.Body>
                  </Field>

                  <Field horizontal>
                    <Field.Label size="normal" textAlign="left">
                      <Label>Max Size</Label>
                    </Field.Label>
                    <Field.Body>
                      <Field>
                        <Control>
                          <Input
                            key={this.key('max_size')}
                            type="number"
                            name="max_size"
                          />
                        </Control>
                      </Field>
                    </Field.Body>
                  </Field>
                  <Field horizontal>
                    <Field.Label size="normal" textAlign="left">
                      <Label>Duration (seconds)</Label>
                    </Field.Label>
                    <Field.Body>
                      <Field>
                        <Control>
                          <Input
                            key={this.key('duration')}
                            type="number"
                            name="duration"
                          />
                        </Control>
                      </Field>
                    </Field.Body>
                  </Field>
                  <Field horizontal>
                    <Field.Label size="normal" textAlign="left">
                      <Label>Start Time (seconds from now)</Label>
                    </Field.Label>
                    <Field.Body>
                      <Field>
                        <Control>
                          <Input
                            key={this.key('start_time')}
                            type="number"
                            name="start_time"
                          />
                        </Control>
                      </Field>
                    </Field.Body>
                  </Field>
                  <Field horizontal>
                    <Field.Label size="normal" textAlign="left">
                      <Label>End Time (seconds after start)</Label>
                    </Field.Label>
                    <Field.Body>
                      <Field>
                        <Control>
                          <Input
                            key={this.key('end_time')}
                            type="number"
                            name="end_time"
                          />
                        </Control>
                      </Field>
                    </Field.Body>
                  </Field>
                  <Field horizontal>
                    <Field.Label size="normal" textAlign="left">
                      <Label>Reset Schedule (CRON string)</Label>
                    </Field.Label>
                    <Field.Body>
                      <Field>
                        <Control>
                          <Input
                            key={this.key('reset')}
                            type="text"
                            name="reset"
                          />
                        </Control>
                      </Field>
                    </Field.Body>
                  </Field>
                  <Field horizontal>
                    <Field.Label size="normal" textAlign="left">
                      <Label>Requires Join</Label>
                    </Field.Label>
                    <Field.Body>
                      <Field>
                        <Control>
                          <Select.Container>
                            <Select
                              key={this.key('join_required')}
                              name="join_required"
                            >
                              <Select.Option value="true">Yes</Select.Option>
                              <Select.Option value="false">No</Select.Option>
                            </Select>
                          </Select.Container>
                        </Control>
                      </Field>
                    </Field.Body>
                  </Field>
                </Column>
              </Column.Group>
              <Column.Group>
                <Column size={8}>
                  <Field>
                    <Label>Metadata</Label>
                    <Field>
                      <Control>
                        <Textarea
                          key={this.key('metadata')}
                          placeholder="Metadata"
                          rows={3}
                          name="metadata"
                        />
                      </Control>
                    </Field>
                  </Field>
                </Column>
              </Column.Group>

              <Field kind="group" align="right">
                {
                  errors ?
                    <Notification color="danger">{errors}</Notification> :
                    null
                }
                &nbsp;
                <Control>
                  <Button color="info">Create</Button>
                </Control>
              </Field>
            </form>
          </Column>
        </Column.Group>
      </Section>
    </Generic>;
  }
}

const mapStateToProps = ({new_tournament}: ApplicationState) => ({
  loading: new_tournament.loading,
  errors: new_tournament.errors,
  data: new_tournament.data
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  createRequest: (data: NewTournamentRequest) => dispatch(
    tournamentActions.tournamentCreateRequest(data)
  )
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewTournament);
