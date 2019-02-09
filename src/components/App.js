import React, { Component } from 'react';
import './App.css';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/lab/Slider';
import Input from '@material-ui/core/Input';
import Card from '@material-ui/core/Card';
import _ from 'lodash';


const styles = {
  root: {
    width: 400,
    padding: '2em'
  },
  slider: {
    padding: '22px 0px',
    width: 400
  },
  input: {
    width: 400
  }
};


class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      amount: 1000,
      duration: 6,
      data: {
        interestRate: 0,
        monthlyPayment: {
          amount: 0,
          currency: 'USD'
        }
      },
      error: false,
      disabled: false
    }
  }

  // This funtion handle the slider when change the amount from slider
  handleChange = (amounts) => {
    let amount = parseInt(amounts)
    this.apiCall(amount, this.state.duration);
    this.setState({
      amount: amount
    });
  }

  /** This function is used for the duration.
      This will call when the duration will change from input field
  */
  handleDuration = (e) => {
    let duration = e.target.value;
    if (parseInt(e.target.value) >= 6 && parseInt(e.target.value) <= 24) {
      this.apiCall(this.state.amount, duration);
      this.setState({
        duration: duration,
        error: false,
        disabled: false
      })
    }
    else {
      this.setState({
        data: {
          interestRate: 0,
          monthlyPayment: {
            amount: 0
          }
        },
        duration: duration,
        error: true,
        disabled: true
      });
    }
  }

  //This funtion is used for api call
  apiCall = _.debounce((amount, duration) => {
    fetch("https://ftl-frontend-test.herokuapp.com/interest?amount=" + amount + "&numMonths=" + duration)
      .then((res) => res.json())
      .then((json) => {
        this.setState({
          data: {
            interestRate: json.interestRate,
            monthlyPayment: {
              amount: json.monthlyPayment.amount,
              currency: 'USD'
            }
          }
        });
      })

  }, 100)

  //This will show the initial value when open this application
  componentDidMount() {
    this.apiCall(this.state.amount, this.state.duration)
  }

  render() {
    const { duration, amount } = this.state;
    const { classes } = this.props;
    return (

      <Card id="card" className={classes.root}>
        <Typography id="label">Amount : {this.state.amount} {this.state.data.monthlyPayment.currency}</Typography>
        <Slider classes={{ container: classes.slider }}
          id="slider"
          aria-labelledby="label"
          value={amount}
          min={500}
          max={5000}
          step={10}
          disabled={this.state.disabled}
          onChange={this.handleChange}
        />
        <Typography id="label">Duration(months):</Typography>
        <Input
          className={classes.input}
          id="input"
          aria-labelledby="label"
          value={duration}
          min={6}
          max={24}
          onChange={(e) => this.handleDuration(e)}
          error={this.state.error}
        />
        <Typography id="label">Interest Rate: {this.state.data.interestRate}</Typography>
        <Typography id="label">Monthly Payment: {this.state.data.monthlyPayment.amount} {this.state.data.monthlyPayment.currency}</Typography>
      </Card>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
