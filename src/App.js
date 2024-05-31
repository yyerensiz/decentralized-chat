import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import Navbar from './components/Navbar';
import Register from './components/Register';
import Chat from './components/Chat';
import SendNFT from './components/SendNFT';
import UserList from './components/UserList';
import DecentralizedChatABI from './contracts/DecentralizedChat.json';
import 'bootstrap/dist/css/bootstrap.min.css';

//const contractAddress = "0x357f6537047d983989fbc92b583550e058f85f17";
const contractAddress = "0xca57597e98efadf081930c712b1d92cbb3065bc5";

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [registered, setRegistered] = useState(false);
  const [users, setUsers] = useState([]);
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    loadBlockchainData();
  }, []);

  const loadBlockchainData = async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);

      const contract = new web3.eth.Contract(DecentralizedChatABI, contractAddress);
      setContract(contract);

      const user = await contract.methods.users(accounts[0]).call();
      setRegistered(user.wallet !== "0x0000000000000000000000000000000000000000");

      // Load registered users
      const events = await contract.getPastEvents('MessageSent', { fromBlock: 0, toBlock: 'latest' });
      const uniqueUsers = [...new Set(events.flatMap(event => [event.returnValues.sender, event.returnValues.receiver]))];
      const userInfos = await Promise.all(uniqueUsers.map(addr => contract.methods.users(addr).call()));
      setUsers(userInfos.filter(u => u.wallet !== "0x0000000000000000000000000000000000000000"));
    }
  };

  const registerUser = async (nickname) => {
    await contract.methods.register(nickname).send({ from: account });
    setRegistered(true);
    setNickname(nickname);
  };

  return (
    <div className="App">
      <Navbar account={account} />
      <div className="container">
        {!registered && <Register registerUser={registerUser} />}
        {registered && (
          <>
            <UserList users={users} />
            <Chat contract={contract} account={account} />
            <SendNFT contract={contract} account={account} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
