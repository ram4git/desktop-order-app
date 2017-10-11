import React, { Component } from 'react'
import { Button, Grid, Segment, Search, List } from 'semantic-ui-react'


export default class Settings extends Component {
  render () {
    return (
      <div className="settings head">
        <h1>Settings</h1>
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <Segment className="main" color="green">
                <Button primary>Add a new Agent</Button>
              </Segment>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row className="agents">
            <Grid.Column width={6}>
              <Segment className="agentList" color="green">
                <Search
                  loading={true}
                  onResultSelect={() => {}}
                  onSearchChange={ () => {}}
                  results={'results'}
                  value={'value'}
                />
                { this.renderAgentList() }
              </Segment>
            </Grid.Column>
            <Grid.Column width={10}>
              <Segment className="AgentDetails" color="green">
                <h1>Agent Name</h1>
                <div className="buttonGroup">
                  <Button content='Text Agent' icon='phone' labelPosition='left' primary/>
                  <Button content='Edit Agent' icon= 'edit' labelPosition='left' primary/>
                  <Button content='Delete Agent' icon='trash' labelPosition='left' primary/>
                </div>
            </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  }

  renderAgentList() {
    return (
        <List divided>
          <List.Item>
            <List.Content>
              Kankatala Nanaji
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Content>
              Rama Rao
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Content>
              Anand Kumar
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Content>
              Shravn Bellgola
            </List.Content>
          </List.Item>
        </List>
    );
  }
}
