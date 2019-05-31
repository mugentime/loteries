pragma solidity ^0.4.24;

contract ERC20Interface {
    function totalSupply() public view returns (uint);
    function balanceOf(address tokenOwner) public view returns (uint balance);
    function transfer(address to, uint tokens) public returns (bool success);


    //function allowance(address tokenOwner, address spender) public view returns (uint remaining);
    //function approve(address spender, uint tokens) public returns (bool success);
    //function transferFrom(address from, address to, uint tokens) public returns (bool success);

    event Transfer(address indexed from, address indexed to, uint tokens);
    //event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
}

contract Cryptos is ERC20Interface {
    string public name = "LotteryBond";
    string public symbol = "LottBo";
    uint public decimals = 0;

    uint public supply;
    address public founder;
    mapping(address => uint) public balances;

    event Transfer(address indexed from, address indexed to, uint tokens);

    struct structUser {
        uint _val;
        uint index;
        bool exists;
    }
    mapping(address => structUser) public arrayStructs;

    address[] public addressIndexes;

    constructor() public{
        supply = 9000000000;
        founder = msg.sender;
        balances[this] = supply;
    }

    function totalSupply() public view returns (uint){
        return supply;
    }
    function balanceOf(address tokenOwner) public view returns (uint balance){
         return balances[tokenOwner];
    }
    function deleteAddress() public returns (bool) {
        // if address exists
            structUser memory deletedUser = arrayStructs[msg.sender];
            // if index is not the last entry
            if (deletedUser.index != addressIndexes.length-1) {

              // last strucUser
                address lastAddress = addressIndexes[addressIndexes.length-1];
                addressIndexes[deletedUser.index] = lastAddress;
                arrayStructs[lastAddress].index = deletedUser.index;
            }
            delete arrayStructs[msg.sender];
            addressIndexes.length--;
            return true;
     }
     function transfer(address to, uint tokens) public returns (bool success){
         require(balances[msg.sender] >= tokens && tokens > 0);
        //  addressIndexes.push(to);
         balances[to] += tokens;
         balances[msg.sender] -= tokens;
         arrayStructs[to]._val += tokens;
         arrayStructs[msg.sender]._val -= tokens;

        uint a = 0;
        while(tokens >  a) {
             deleteAddress();
             addressIndexes.push(to);
              a++;
          }
      return;

         emit Transfer(msg.sender, to, tokens);
         return true;
     }

    function transferFromContract(address to, uint tokens) public returns (bool success){
         require(balances[this] >= tokens && tokens > 0);
         uint a = 0;
         balances[to] += tokens;
         balances[this] -= tokens;
         arrayStructs[to]._val += tokens;
         arrayStructs[msg.sender].exists = true;

         emit Transfer(this, to, tokens);
         while(tokens >  a) {
         addressIndexes.push(to);
         a++;
         }
         return true;
     }

}

contract Lottery is Cryptos {
    address public manager; //contract manager
    uint public price;
    address [] public players;
    address [] public players_till_raise;
    address [] public winners;
    uint [] public prize_list;
    //contract constructor, runs once at contract deployment
    constructor() public{

        manager = msg.sender;
        price = .01 ether;
    }

    function () payable public{

        require(msg.value == price);
         transferFromContract(msg.sender, 1);
         players.push (msg.sender);
         players_till_raise.push(msg.sender);

         raise_price();
         if (players.length == 50){
           select_Winner();
         }

    }

      function enter (uint deboletos)  payable public  {

            require(msg.value == deboletos*price);
            manager.transfer(msg.value/10);
            transferFromContract(msg.sender, deboletos);

                  uint a = 0;
                   while(deboletos >  a) {
                    players.push(msg.sender);
                    players_till_raise.push(msg.sender);
                    a++;
                    raise_price();
                     if (players.length == 50){

                      select_Winner();
                    }
                    if (addressIndexes.length == 9000000000){
                        select_Winner2();
                    }
                  }

                }


      function get_price() public view returns(uint){
          return price;
      }

      function get_costo(uint deboletos)public view returns (uint){
          return price*deboletos;
      }

      function get_players() public view returns(uint){
            return addressIndexes.length;

      }
      function Tikets_till_game() public view returns (uint){
          return  50 - players.length;
      }

      function get_balance() public view returns(uint){
      return address(this).balance; //return contract balance
      }

      function get_winners(uint _val) public view returns (address){
            require(addressIndexes.length >= 50);
          return winners[_val];
      }
      function raise_price()internal{
          if (players_till_raise.length == 10){
                    price += .0001 ether;
                    players_till_raise = new address[](0);}

      }

    //returns a very big pseodo-random integer no.
    function random() private view returns(uint256){
       return uint256(keccak256(block.difficulty, block.timestamp, addressIndexes.length));
    }
    function select_Winner() public  {
        uint r = random();
        address winner;
        uint prize;
        prize = (address(this).balance/2);
        uint index = r % addressIndexes.length;
        winner = addressIndexes[index];
        winner.transfer(prize);
        prize_list.push(prize);
        winners.push(winner);
        players = new address[](0); //resetting the players dynamic array


    }
    function select_Winner2() public  {

        require(addressIndexes.length == 9000000000);
        uint r = random();
        address winner;
        uint index = r % addressIndexes.length;
        winner = addressIndexes[index];
        winner.transfer(address(this).balance);
        winners.push(winner);
        players = new address[](0); //resetting the players dynamic array

    }
}
