import React, {Component, RefObject} from 'react';
import {RouteComponentProps} from 'react-router';
import {Link} from 'react-router-dom';

import {Dispatch} from 'redux';
import {connect} from 'react-redux';
import {ApplicationState, ConnectedReduxProps} from '../../store';
import * as tournamentActions from '../../store/tournaments/actions';
import {NewTournamentRequest, TournamentReference, TournamentObject} from '../../store/tournaments/types';

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
  Textarea,
  Fieldset
} from 'rbx';

import Header from '../../components/header';
import Sidebar from '../../components/sidebar';

/*
 * https://dfee.github.io/rbx/
 */

interface PropsFromState {
  loading: boolean,
  errors: string | undefined,
  data: TournamentObject,
  created: TournamentReference
}

interface PropsFromDispatch {
  fetchRequest: typeof tournamentActions.tournamentFetchRequest,
  createRequest: typeof tournamentActions.tournamentCreateRequest
}

type Props = RouteComponentProps & PropsFromState & PropsFromDispatch & ConnectedReduxProps;

type State = {hideCustomReset: boolean};

class NewTournament extends Component<Props, State> {
  //
  refResetSelect = React.createRef<HTMLSelectElement>();
  public constructor(props: Props) {
    super(props);
    this.state = {hideCustomReset: true};
  }

  public componentDidMount() {
    const {match} = this.props;
    const params = match.params as TournamentReference;
    if(params.id){
      this.props.fetchRequest(params);
    }
  }

  private key(prefix: string) {
    return `${prefix}_new_tournament`;
  }

  private create(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.target as HTMLFormElement);
    let reset = data.get('reset') as string;
    if(reset === 'custom'){
      reset = data.get('reset_custom') as string;
    }

    let payload:any = {
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
      reset: reset,
      join_required: (data.get('join_required') as string) == 'true'
    };
    let metadata = (data.get('metadata') as string);
    if(metadata && metadata.length > 0) {
        payload.metadata = JSON.parse(metadata);
    }
    payload = Object.keys(payload).reduce((res: any, key: string) => {
      if(payload[key]){
        res[key] = payload[key];
      }
      return res;
    }, {});
    this.props.createRequest(payload);
    this.details();
  }

  private details() {
    const {history, created} = this.props;
    history.push(`/tournaments/${created.id}`);
  }

  private onResetChange() {
    let select: HTMLSelectElement = this.refResetSelect.current as HTMLSelectElement;
    let val = select.value;
    this.setState({hideCustomReset: val !== "custom"});
  }

  public render() {
    let {errors, data} = this.props;

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
                            defaultValue={data && data.title}
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
                          defaultValue={data && data.description}
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
                            defaultValue={data && data.category}
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
                              defaultValue={data && data.sort_order}
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
                            defaultValue={data && data.max_num_score}
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
                            defaultValue={data && data.max_size}
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
                            defaultValue={data && data.duration}
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
                      <Label>Reset Schedule</Label>
                    </Field.Label>
                    <Field.Body>
                      <Fieldset>
                        <Field>
                          <Control>
                            <Select.Container>
                              <Select
                                ref={this.refResetSelect}
                                onChange={this.onResetChange.bind(this)}
                                key={this.key('reset')}
                                name="reset"
                              >
                                <Select.Option value="0 0 * * *">Daily at midnight</Select.Option>
                                <Select.Option value="0 0 * * 1">Weekly on Monday</Select.Option>
                                <Select.Option value="0 0 1 * *">Monthly on 1st</Select.Option>
                                <Select.Option value="custom">Custom (CRON string)</Select.Option>
                              </Select>
                            </Select.Container>
                          </Control>
                        </Field>
                        <Field>
                          <Control>
                            <Input
                              hidden={this.state.hideCustomReset}
                              id="input-reset-custom"
                              key={this.key('reset_custom')}
                              type="text"
                              name="reset_custom"
                            />
                          </Control>
                        </Field>
                      </Fieldset>
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
                          defaultValue={data && JSON.stringify(data.metadata)}
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

const mapStateToProps = ({new_tournament, tournament_details}: ApplicationState) => ({
  loading: new_tournament.loading,
  errors: new_tournament.errors,
  created: new_tournament.data,
  data: tournament_details.data
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  createRequest: (data: NewTournamentRequest) => dispatch(
    tournamentActions.tournamentCreateRequest(data)
  ),
  fetchRequest: (data: TournamentReference) => dispatch(
    tournamentActions.tournamentFetchRequest(data)
  )
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewTournament);
