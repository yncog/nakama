import React, {Component} from 'react';
import {RouteComponentProps} from 'react-router';
import {Link} from 'react-router-dom';

import {Dispatch} from 'redux';
import {connect} from 'react-redux';
import {ApplicationState, ConnectedReduxProps} from '../../store';
import * as tournamentActions from '../../store/tournaments/actions';
import {TournamentObject, TournamentObjectRequest} from '../../store/tournaments/types';

import {
  Box,
  Breadcrumb,
  Button,
  Column,
  Control,
  Dropdown,
  Field,
  Generic,
  Icon,
  Input,
  Label,
  Level,
  Notification,
  Section,
  Select,
  Textarea,
  Title
} from 'rbx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import json_to_csv from '../../utils/json_to_csv';

import Header from '../../components/header';
import Sidebar from '../../components/sidebar';

/*
 * https://dfee.github.io/rbx/
 */

interface PropsFromState {
  loading: boolean,
  errors: string | undefined,
  updated: boolean,
  data: TournamentObject
}

interface PropsFromDispatch {
  fetchRequest: typeof tournamentActions.tournamentFetchRequest,
  //updateRequest: typeof tournamentActions.tournamentUpdateRequest,
  deleteRequest: typeof tournamentActions.tournamentDeleteRequest
}

type Props = RouteComponentProps & PropsFromState & PropsFromDispatch & ConnectedReduxProps;

type State = {};

class TournamentDetails extends Component<Props, State> {
  public componentDidMount() {
    const {match} = this.props;
    this.props.fetchRequest(match.params as TournamentObjectRequest);
  }

  public key(prefix: string) {
    const {data} = this.props;
    return `${prefix}_${data.id}`;
  }

  /*public update(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.target as HTMLFormElement);
    const payload = {
      id: data.get('id') as string,
      title: data.get('title') as string,
      description: data.get('description') as string
    };
    this.props.updateRequest(payload);
  }*/

  public remove() {
    const {match, history} = this.props;
    if (confirm('Are you sure you want to delete this tournament?')) {
      this.props.deleteRequest(match.params as TournamentObjectRequest);
      history.goBack();
    }
  }

  public download(format: string) {
    const {data} = this.props;
    const element = document.createElement('a');
    let file;
    if (format === 'json') {
      file = new Blob(
        [JSON.stringify([data], null, 2)],
        {type: 'application/json'}
      );
    } else {
      file = new Blob(
        [json_to_csv([data])],
        {type: 'text/plain'}
      );
    }
    element.href = URL.createObjectURL(file);
    element.download = `export.${format}`;
    document.body.appendChild(element);
    element.click();
  }

  public render() {
    const {data, updated, errors} = this.props;
    return <Generic id="tournament_details">
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
                    <Breadcrumb.Item active>{data.id}</Breadcrumb.Item>
                  </Breadcrumb>
                </Level.Item>
              </Level.Item>
              <Level.Item align="right">
                <Level.Item>
                  <Dropdown hoverable>
                    <Dropdown.Trigger>
                      <Button>
                        <span>Export</span>
                        <Icon>
                          <FontAwesomeIcon icon="angle-down"/>
                        </Icon>
                      </Button>
                    </Dropdown.Trigger>
                    <Dropdown.Menu>
                      <Dropdown.Content>
                        <Dropdown.Item
                          onClick={this.download.bind(this, 'csv')}
                        >
                          <Icon>
                            <FontAwesomeIcon icon="file-csv"/>
                          </Icon>
                          <span>Export with CSV</span>
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={this.download.bind(this, 'json')}
                        >
                          <Icon>
                            <FontAwesomeIcon icon="file"/>
                          </Icon>
                          <span>Export with JSON</span>
                        </Dropdown.Item>
                      </Dropdown.Content>
                    </Dropdown.Menu>
                  </Dropdown>
                </Level.Item>
                <Level.Item>
                  <Button
                    onClick={this.remove.bind(this)}
                  >
                    <Icon>
                      <FontAwesomeIcon icon="trash"/>
                    </Icon>
                    <span>Delete</span>
                  </Button>
                </Level.Item>
              </Level.Item>
            </Level>

            <form> {/*onSubmit={this.update.bind(this)}*/}
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
                            defaultValue={data.title}
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
                          defaultValue={data.description}
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
                            static
                            key={this.key('category')}
                            type="text"
                            name="category"
                            defaultValue={data.category}
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
                          <Input
                            static
                            key={this.key('sort_order')}
                            type="text"
                            name="sort_order"
                            defaultValue={data.sort_order == 'desc' ? 'Descending': 'Ascending'}
                          />
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
                            static
                            key={this.key('max_num_score')}
                            type="text"
                            name="max_num_score"
                            defaultValue={data.max_num_score}
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
                            static
                            key={this.key('max_size')}
                            type="text"
                            name="max_size"
                            defaultValue={data.max_size}
                          />
                        </Control>
                      </Field>
                    </Field.Body>
                  </Field>
                  <Field horizontal>
                    <Field.Label size="normal" textAlign="left">
                      <Label>Current Size</Label>
                    </Field.Label>
                    <Field.Body>
                      <Field>
                        <Control>
                          <Input
                            static
                            key={this.key('size')}
                            type="text"
                            name="size"
                            defaultValue={data.size}
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
                    <Label>Metadata</Label>
                    <Field>
                      <Control>
                        <Textarea
                          key={this.key('metadata')}
                          placeholder="Metadata"
                          rows={3}
                          name="metadata"
                          defaultValue={JSON.stringify(data.metadata)}
                        />
                      </Control>
                    </Field>
                  </Field>
                </Column>
              </Column.Group>
              <Column.Group>
                <Column size={8}>
                  <Box>
                    <Field horizontal>
                      <Field.Label size="normal" textAlign="left">
                        <Label>Create Time</Label>
                      </Field.Label>
                      <Field.Body>
                        <Field>
                          <Control>
                            <Input
                              static
                              key={this.key('create_time')}
                              type="text"
                              name="create_time"
                              defaultValue={this.formatDate(data.create_time)}
                            />
                          </Control>
                        </Field>
                      </Field.Body>
                    </Field>

                    <Field horizontal>
                      <Field.Label size="normal" textAlign="left">
                        <Label>Start Time</Label>
                      </Field.Label>
                      <Field.Body>
                        <Field>
                          <Control>
                            <Input
                              static
                              key={this.key('start_time')}
                              type="text"
                              name="start_time"
                              defaultValue={this.formatDate(data.start_time)}
                            />
                          </Control>
                        </Field>
                      </Field.Body>
                    </Field>

                    <Field horizontal>
                      <Field.Label size="normal" textAlign="left">
                        <Label>End Time</Label>
                      </Field.Label>
                      <Field.Body>
                        <Field>
                          <Control>
                            <Input
                              static
                              key={this.key('end_time')}
                              type="text"
                              name="end_time"
                              defaultValue={this.formatDate(data.end_time)}
                            />
                          </Control>
                        </Field>
                      </Field.Body>
                    </Field>
                    <Field horizontal>
                      <Field.Label size="normal" textAlign="left">
                        <Label>Duration</Label>
                      </Field.Label>
                      <Field.Body>
                        <Field>
                          <Control>
                            <Input
                              static
                              key={this.key('duration')}
                              type="text"
                              name="duration"
                              defaultValue={this.formatDuration(data.duration)}
                            />
                          </Control>
                        </Field>
                      </Field.Body>
                    </Field>
                    <Field horizontal>
                      <Field.Label size="normal" textAlign="left">
                        <Label>Currently Active</Label>
                      </Field.Label>
                      <Field.Body>
                        <Field>
                          <Control>
                            <Input
                              static
                              key={this.key('can_enter')}
                              type="text"
                              name="can_enter"
                              defaultValue={(data.can_enter ? 'Yes ' : 'No ')}
                            />
                          </Control>
                        </Field>
                      </Field.Body>
                    </Field>
                    <Field horizontal>
                      <Field.Label size="normal" textAlign="left">
                        <Label>Active Start Time</Label>
                      </Field.Label>
                      <Field.Body>
                        <Field>
                          <Control>
                            <Input
                              static
                              key={this.key('start_active')}
                              type="text"
                              name="start_active"
                              defaultValue={this.formatDate(data.start_active)}
                            />
                          </Control>
                        </Field>
                      </Field.Body>
                    </Field>
                    <Field horizontal>
                      <Field.Label size="normal" textAlign="left">
                        <Label>Active End Time</Label>
                      </Field.Label>
                      <Field.Body>
                        <Field>
                          <Control>
                            <Input
                              static
                              key={this.key('end_active')}
                              type="text"
                              name="end_active"
                              defaultValue={this.formatDate(data.end_active)}
                            />
                          </Control>
                        </Field>
                      </Field.Body>
                    </Field>
                    <Field horizontal>
                      <Field.Label size="normal" textAlign="left">
                        <Label>Next Reset</Label>
                      </Field.Label>
                      <Field.Body>
                        <Field>
                          <Control>
                            <Input
                              static
                              key={this.key('next_reset')}
                              type="text"
                              name="next_reset"
                              defaultValue={this.formatDate(data.next_reset)}
                            />
                          </Control>
                        </Field>
                      </Field.Body>
                    </Field>
                  </Box>
                </Column>
              </Column.Group>

              <Field kind="group" align="right">
                {
                  updated ?
                    <Notification color="success">Successfully updated storage record.</Notification> :
                    null
                }
                {
                  errors ?
                    <Notification color="danger">{errors}</Notification> :
                    null
                }
                &nbsp;
                <Control>
                  <Button color="info">Update</Button>
                </Control>
              </Field>
            </form>
          </Column>
        </Column.Group>
      </Section>
    </Generic>;
  }

  private formatDate(unix: number) {
    return (new Date(1000*unix)).toLocaleString();
  }

  private formatDuration(duration: number) {
    let result = [];
    let days = ~~(duration/(3600*24));
    if(days > 0) {
      result.push(days + " days");
      duration = duration % (3600*24);
    }
    let hours = ~~(duration/3600);
    if(hours > 0){
      result.push(hours + " hours");
      duration = duration % (3600);
    }
    let minutes = ~~(duration/60);
    if(minutes > 0){
      result.push(minutes + " minutes");
      duration = duration % (60);
    }
    if(duration > 0) {
      result.push(duration + " seconds");
    }
    return result.join(", ");
  }
}

const mapStateToProps = ({tournament_details}: ApplicationState) => ({
  loading: tournament_details.loading,
  errors: tournament_details.errors,
  updated: tournament_details.updated,
  data: tournament_details.data
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchRequest: (data: TournamentObjectRequest) => dispatch(
    tournamentActions.tournamentFetchRequest(data)
  ),
  /*updateRequest: (data: TournamentObject) => dispatch(
    tournamentActions.storageUpdateRequest(data)
  ),*/
  deleteRequest: (data: TournamentObjectRequest) => dispatch(
    tournamentActions.tournamentDeleteRequest(data)
  )
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TournamentDetails);
