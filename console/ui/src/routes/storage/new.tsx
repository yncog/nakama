import React, {Component} from 'react';
import {RouteComponentProps} from 'react-router';
import {Link} from 'react-router-dom';

import {Dispatch} from 'redux';
import {connect} from 'react-redux';
import {ApplicationState, ConnectedReduxProps} from '../../store';
import * as storageActions from '../../store/storage/actions';
import {StorageObject, StorageObjectRequest} from '../../store/storage/types';

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

import Header from '../../components/header';
import Sidebar from '../../components/sidebar';

/*
 * https://dfee.github.io/rbx/
 */

interface PropsFromState {
  loading: boolean,
  errors: string | undefined
}

interface PropsFromDispatch {
  fetchRequest: typeof storageActions.storageFetchRequest,
  createRequest: typeof storageActions.storageCreateRequest
}

type Props = RouteComponentProps & PropsFromState & PropsFromDispatch & ConnectedReduxProps;

type State = {hideUserInput: boolean, userTypeVal: string};

class NewStorage extends Component<Props, State> {
  public constructor(props: Props) {
    super(props);
    this.state = {hideUserInput: true, userTypeVal: ''};
  }

  public key(prefix: string) {
    let ts = (new Date()).getTime();
    return `${prefix}_new_storage_${ts}`;
  }

  public create(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.target as HTMLFormElement);
    let user_id = data.get('user_type') as string;
    if(user_id !== '0'){
      user_id = data.get('user_id') as string;
    }
    else {
      user_id = '00000000-0000-0000-0000-000000000000';
    }
    const payload:any = {
      collection: data.get('collection') as string,
      key: data.get('key') as string,
      user_id: user_id,
      permission_read: parseInt(data.get('permission_read') as string),
      permission_write: parseInt(data.get('permission_write') as string),
    };
    let value = data.get('value') as string;data.get('user_id') as string
    if(value && value.length > 0){
      payload.value = JSON.stringify(JSON.parse(value));
    }
    this.props.createRequest(payload as StorageObject);
    if(!this.props.errors){
      const {history} = this.props;
      history.push(`/storage/${payload.collection}/${payload.key}/${payload.user_id}`);
    }
  }

  private onUserTypeChange(event: React.ChangeEvent) {
    let val = (event.target as HTMLSelectElement).value;
    this.setState({hideUserInput: val === '0', userTypeVal: val});
  }

  public render() {
    const {errors} = this.props;
    return <Generic id="storage_details">
      <Header/>
      <Section>
        <Column.Group>
          <Sidebar active="storage"/>

          <Column>
            <Level>
              <Level.Item align="left">
                <Level.Item>
                  <Breadcrumb>
                    <Breadcrumb.Item as="span"><Link to="/storage">Storage</Link></Breadcrumb.Item>
                    <Breadcrumb.Item active>New Storage Item</Breadcrumb.Item>
                  </Breadcrumb>
                </Level.Item>
              </Level.Item>
            </Level>

            <form onSubmit={this.create.bind(this)}>
              <Column.Group>
                <Column size={6}>
                  <Field horizontal>
                    <Field.Label size="normal">
                      <Label>Collection</Label>
                    </Field.Label>
                    <Field.Body>
                      <Field>
                        <Control>
                          <Input
                            key={this.key('collection')}
                            type="text"
                            name="collection"
                          />
                        </Control>
                      </Field>
                    </Field.Body>
                  </Field>

                  <Field horizontal>
                    <Field.Label size="normal">
                      <Label>Key</Label>
                    </Field.Label>
                    <Field.Body>
                      <Field>
                        <Control>
                          <Input
                            key={this.key('key')}
                            type="text"
                            name="key"
                          />
                        </Control>
                      </Field>
                    </Field.Body>
                  </Field>

                  <Field horizontal>
                    <Field.Label size="normal">
                      <Label>Owned by</Label>
                    </Field.Label>
                    <Field.Body>
                      <Field>
                        <Control>
                          <Select.Container>
                            <Select
                              key={this.key('user_type')}
                              name="user_type"
                              onChange={this.onUserTypeChange.bind(this)}
                              value={this.state.userTypeVal}
                            >
                              <Select.Option value="0">System</Select.Option>
                              <Select.Option value="1">User ID:</Select.Option>
                            </Select>
                          </Select.Container>
                          <Input
                            hidden={this.state.hideUserInput}
                            key={this.key('user_id')}
                            type="text"
                            name="user_id"
                          />
                        </Control>
                      </Field>
                    </Field.Body>
                  </Field>

                  <Field horizontal>
                    <Field.Label size="normal">
                      <Label>Read Permission</Label>
                    </Field.Label>
                    <Field.Body>
                      <Field>
                        <Control>
                          <Select.Container>
                            <Select
                              key={this.key('permission_read')}
                              name="permission_read"
                            >
                              <Select.Option value="0">No Read (0)</Select.Option>
                              <Select.Option value="1">Private Read (1)</Select.Option>
                              <Select.Option value="2">Public Read (2)</Select.Option>
                            </Select>
                          </Select.Container>
                        </Control>
                      </Field>
                    </Field.Body>
                  </Field>

                  <Field horizontal>
                    <Field.Label size="normal">
                      <Label>Write Permission</Label>
                    </Field.Label>
                    <Field.Body>
                      <Field>
                        <Control>
                          <Select.Container>
                            <Select
                              key={this.key('permission_write')}
                              name="permission_write"
                            >
                              <Select.Option value="0">No Write (0)</Select.Option>
                              <Select.Option value="1">Private Write (1)</Select.Option>
                            </Select>
                          </Select.Container>
                        </Control>
                      </Field>
                    </Field.Body>
                  </Field>
                </Column>
              </Column.Group>

              <Column.Group>
                <Column>
                  <Field>
                    <Label>Value</Label>
                    <Field>
                      <Control>
                        <Textarea
                          key={this.key('value')}
                          placeholder="Value"
                          rows={8}
                          name="value"
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

const mapStateToProps = ({storage_details}: ApplicationState) => ({
  loading: storage_details.loading,
  errors: storage_details.errors
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchRequest: (data: StorageObjectRequest) => dispatch(
    storageActions.storageFetchRequest(data)
  ),
  createRequest: (data: StorageObject) => dispatch(
    storageActions.storageCreateRequest(data)
  )
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewStorage);
