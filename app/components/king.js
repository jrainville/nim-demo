import EmbarkJS from 'Embark/EmbarkJS';
import King from '../../embarkArtifacts/contracts/King';
import React from 'react';
import {Form, FormGroup, Input, Button, FormText, Alert} from 'reactstrap';
console.log('King', King);

class Blockchain extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      value: '',
      nameGet: "",
      valueGet: "",
      logs: [],
      setTo: '',
      error: '',
      mining: false
    };
  }

  handleChange(e, name) {
    this.setState({ [name]: e.target.value });
  }

  checkEnter(e, func) {
    if (e.key !== 'Enter') {
      return;
    }
    e.preventDefault();
    func.apply(this, [e]);
  }

  async setValue(e) {
    e.preventDefault();
    await EmbarkJS.enableEthereum();
    const name = this.state.name;
    const value = parseFloat(this.state.value);

    if (!value) {
      alert('Need to specify a value');
      return;
    }

    console.log('hexed', web3.utils.toHex(name));
    try {
      const toSend = King.methods.becomeKing(web3.utils.toHex(name));
      const gas = await toSend.estimateGas();
      this._addToLog("King.methods.becomeKing(web3.utils.toHex(value)).send()");
      this.setState({mining: true});
      console.log({gas: gas + 200, value: web3.utils.toWei(value.toString(), 'ether')});
      await toSend.send({gas: gas + 200, value: web3.utils.toWei(value.toString(), 'ether')});
      this.setState({setTo: value, mining: false});
    } catch (e) {
      console.error(e);
      this.setState({error: e.message, mining: false});
    }
  }

  getValue(e) {
    e.preventDefault();

    King.methods.king_name().call().then(_value => this.setState({ nameGet: _value }));
    King.methods.king_value().call().then(_value => this.setState({ valueGet: _value }));
  }

  _addToLog(txt) {
    this.state.logs.push(txt);
    this.setState({ logs: this.state.logs });
  }

  render() {
    return (<React.Fragment>
        {this.state.error && <Alert color="danger">{this.state.error}</Alert>}
        {this.state.mining && 'Mining...'}
        <h3>Become the King</h3>
        <Form onKeyDown={(e) => this.checkEnter(e, this.setValue)}>
          <FormGroup>
            <Input
              type="text"
              value={this.state.name}
              placeholder="Your name"
              onChange={(e) => this.handleChange(e, 'name')}/>
            <br/>
            <Input
              type="text"
              value={this.state.value}
              placeholder="Value to stake to become king"
              onChange={(e) => this.handleChange(e, 'value')}/>
            <Button color="primary" onClick={(e) => this.setValue(e)}>Become King</Button>
            {this.state.setTo !== '' && <p>Value set to: {this.state.name} with {this.state.setTo}</p>}
            <FormText color="muted">
              Once you set the value, the transaction will need to be mined and then the value will be updated on the blockchain.
            </FormText>
          </FormGroup>
        </Form>

        <h3>Get the current King</h3>
        <Form>
          <FormGroup>
            <Button color="primary" onClick={(e) => this.getValue(e)}>Get Value</Button>
            <FormText color="muted">Click the button to get the current King</FormText>
            {this.state.nameGet &&
            <p>Current king is <span className="value font-weight-bold">{this.state.nameGet} with {this.state.valueGet}</span></p>}
          </FormGroup>
        </Form>

        <h3> 3. Contract Calls </h3>
        <p>Javascript calls being made: </p>
        <div className="logs">
          {
            this.state.logs.map((item, i) => <p key={i}>{item}</p>)
          }
        </div>
      </React.Fragment>
    );
  }
}

export default Blockchain;
