import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';
import { Router, browserHistory, Route, Link } from 'react-router';
const Web3 = require("web3");

class App extends Component {



    state = {
      manager: '',
      players: [],
      balance: '',
      value:'',
      message: '',
      price: '',
      numerodeboletos:'',
      players_till_game:[],
      winnerLength:'',
      winners:'',

      prize1:'',
      prize2:'',
      prize3:'',
      prize4:'',
      prize5:'',
      prize6:'',



      winners2:'',
      winners3:'',
      winners4:'',
      winners5:'',
      winners6:'',


    };

    async  componentDidMount() {

        const web3 = new Web3(window.web3.currentProvider);
        const manager = '0xBc3560E1318DB684f65c8be37D195C3a5Fc76B4A';
        const players = await lottery.methods.get_players().call();
        const players_till_game = await lottery.methods.tickets_Till_Game().call();
        const balance = await web3.eth.getBalance(lottery.options.address);
        const price = await lottery.methods.get_price().call();
        const coinName = await lottery.methods.name().call();
        const coins = await lottery.methods.totalSupply().call();
        const winnerLength = await lottery.methods.get_winners_length().call();

        const prize1 = await lottery.methods.price_list(11).call();
        const prize2 = await lottery.methods.price_list(10).call();
        const prize3 = await lottery.methods.price_list(2-this.state.winnerLength.length).call();
        const prize4 = await lottery.methods.price_list(3-this.state.winnerLength.length).call();
        const prize5 = await lottery.methods.price_list(4-this.state.winnerLength.length).call();

        const winners = await lottery.methods.get_winners(11).call();
        const winners2 =await lottery.methods.get_winners(10).call();
        const winners3 =await lottery.methods.get_winners(6).call();
        const winners4 =await lottery.methods.get_winners(5).call();
        const winners5 =await lottery.methods.get_winners(4).call();
        const winners6 =await lottery.methods.get_winners(3).call();

        // const balance = await web3.eth.get_balance(lottery.options.address);


        this.setState({ manager, players, balance, price, players_till_game, winnerLength,
           winners, winners2, winners3, winners4, winners5, winners6, prize1,  prize2, prize3, prize4, prize5,
         });

      }

      onBla = async (event) => {
            event.preventDefault();
            this.setState({ message: 'Remember to use your Metamask extension to get your Lotto Coins!'});

          };


        onSubmit = async (event) => {
          event.preventDefault();

          const accounts = await web3.eth.getAccounts();
          this.setState({ message: 'Waiting on transaction success...'});
          setTimeout(function (){window.location.reload()}, 40000);
          await lottery.methods.enter(this.state.value)
          .send({
                from: accounts[0],
                value: (this.state.price)*(this.state.value)});
                this.setState({ message: 'You are in!'});
                window.location.reload()
                };

      onClick = async () => {

        const accounts = await web3.eth.getAccounts();

        this.setState({ message: 'Waiting on transaction successs...'});
        await lottery.methods.selectWinner().send({
          from: accounts[0]


        });
        this.state({ message: 'A winner has been picked!'});

      };

  render() {
    return (
      <div>

              <ol>  <h1>Forever Lottery</h1> </ol>
 <ol>  <h3>Collective  Capitalization</h3></ol>
 <ol>  <h4>Buy once play forever</h4></ol>
  <ol>  <h3> Contract Address:</h3> <h3>{this.state.manager}</h3></ol>
    <li> Use this address to add your LottoCoins to your Metamask account. Just follow the 'add Tokens' instructions!</li>
  <ol>  <h3> Tickets remaining until next draw:{' '} {50-this.state.players_till_game.length} </h3></ol>
    <li>Every  time 50 tickets are sold the contract will pick a random winner! </li>
  <ol>  <h3> Tickets sold so far: {' '}{this.state.players.length}</h3></ol>
    <li>The tickets are called LottoCoins and are fully functional Tokens so you can use them as any other ERC20 token!</li>
  <ol>  <h3> Accumulated pot: {web3.utils.fromWei(this.state.balance.toString(), 'ether')} ether! </h3></ol>
    <li>When 50 tickets are sold 45% of the pot will be paid to a randomly selected ticket,
    10% of the pot will be payed to the creator</li>
  <ol>  45% will be saved for the next pot making it forever increasing! </ol>
  <ol>  <h3> Current ticket price: {web3.utils.fromWei(this.state.price.toString())} ether! </h3></ol>
    <li>The ticket price will rise 0.0001 ethers every time 10 tickets are sold.</li>

    <hr />
          <form onSubmit={this.onBla}>
            <div><h4>How many tickets will you buy today?
            <input
              value={this.state.value}
              onChange= {event => this.setState({value: event.target.value}) }
            /></h4>
            </div>

        </form>

        <hr />

          <form onSubmit={this.onSubmit}>
         <h4>Ready to try your luck?</h4>
            <div>
           <label> Prepare to send:  </label>

            <input
            value = {web3.utils.fromWei(this.state.value)*(this.state.price)}
            onChange={event => this.setState({value: event.target.value})}

            /> <button>Enter</button>
            <hr/>

            <h2>{this.state.message}</h2>

            </div>

        </form>
< hr/>
<ol>
<h4>Last Winner</h4>
<h5>{this.state.winners}</h5>
{web3.utils.fromWei(this.state.prize1.toString())} ether!
{(1-this.state.winnerLength.length)}
<h4>Past Winners</h4>
<h5>{this.state.winners2}</h5>
{web3.utils.fromWei(this.state.prize2.toString())} ether!
<h5>{this.state.winners3}</h5>
{web3.utils.fromWei(this.state.prize3.toString())} ether!
<h5>{this.state.winners4}</h5>
{web3.utils.fromWei(this.state.prize4.toString())} ether!
<h5>{this.state.winners5}</h5>
{web3.utils.fromWei(this.state.prize5.toString())} ether!

<h5>{this.state.winners6}</h5>
</ol>
<hr/>
<h2>NEVER STOP PLAYING :)</h2>
<hr/>
<ol><h3>How does it work?</h3>

<li>Buy a ticket by sending the amount of ether stated on the 'enter' button.</li>
<li>The tickets you buy will be sent to the Metamask account you paid with.</li>
<li>In order to see your tickets follow the Metamask instructions to add tokens. Use the "contract address" to add them.</li>
<li>The tickets are actual Tokens called LottoCoins built on ERC20Interface so you can send them to other accounts.</li>
<li>Whoever owns the ticket owns the right to participate in the lottery.</li>
<li>The tickets never expire so as long as you hold them they will participate in the ongoing raffles.</li>
<li>Every time 50 tickets are sold the contract will automatically run the raffle.</li>
<li>The contract holds 45% of the paid tickets in orther to increase the next pot, which means that the pot is forever increasing.</li>
<li>Every time 10 tickets are sold the ticket price will rise 0.0001 ethers so make sure to buy as many tickets in advance as you can.</li>
<li>This lottery has no owner and is automatic. It will keep on going without human interference for as long as the ethereum blockchain exists.</li>
</ol>
<hr/>
<hr/>

</div>
    );

  }

}

export default App;
