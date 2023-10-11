import {
  Stack,
  CardBody,
  Card,
  Select,
  Heading,
  Avatar,
  Box,
  Text,
  VStack,
  Grid,
  Spinner,
  Modal,
  Button,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Image,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Logo } from "./components/Logo";
import { NFT_ABI } from "./components/NFTAbi";
// @ts-ignore
import { usePioneer } from "@pioneer-platform/pioneer-react";
import Web3 from "web3";

// @ts-ignore
import KEEPKEY_ICON from "lib/assets/png/keepkey.png";
// @ts-ignore
import METAMASK_ICON from "lib/assets/png/metamask.png";
// @ts-ignore
import PIONEER_ICON from "lib/assets/png/pioneer.png";

const ALL_CHAINS = [
  {
    name: "ethereum",
    chain_id: 1,
    symbol: "ETH",
    image: "https://pioneers.dev/coins/ethereum.png",
  },
  {
    name: "polygon",
    chain_id: 137,
    symbol: "MATIC",
    image: "https://pioneers.dev/coins/polygon.png",
  },
  {
    name: "pulsechain",
    chain_id: 369,
    symbol: "PLS",
    image: "https://pioneers.dev/coins/pulsechain.png",
  },
  {
    name: "optimism",
    chain_id: 10,
    symbol: "ETH",
    image: "https://pioneers.dev/coins/optimism.png",
  },
  {
    name: "gnosis",
    chain_id: 100,
    symbol: "xDAI",
    image: "https://pioneers.dev/coins/gnosis.png",
  },
  {
    name: "binance-smart-chain",
    chain_id: 56,
    symbol: "BNB",
    image: "https://pioneers.dev/coins/binance-smart-chain.png",
  },
  {
    name: "smart-bitcoin-cash",
    chain_id: 10000,
    symbol: "BCH",
    image: "https://pioneers.dev/coins/smart-bitcoin-cash.png",
  },
  {
    name: "dogechain",
    chain_id: 2000,
    symbol: "DOGE",
    image: "https://pioneers.dev/coins/dogecoin.png",
  },
  // { name: "arbitrum", chain_id: 42161, symbol: "ARB", image: "https://pioneers.dev/coins/arbitrum.png" }, //TODO push node
  {
    name: "fuse",
    chain_id: 122,
    symbol: "FUSE",
    image: "https://pioneers.dev/coins/fuse.png",
  },
  // { name: "bittorrent", chain_id: 199, symbol: "BTT", image: "https://pioneers.dev/coins/bittorrent.png" },//TODO push node
  {
    name: "celo",
    chain_id: 42220,
    symbol: "CELO",
    image: "https://pioneers.dev/coins/celo.png",
  },
  {
    name: "avalanche-c-chain",
    chain_id: 43114,
    symbol: "AVAX",
    image: "https://pioneers.dev/coins/avalanche-c-chain.png",
  },
  // { name: "görli", chain_id: 5, symbol: "GOR", image: "https://pioneers.dev/coins/görli.png" },
  {
    name: "eos",
    chain_id: 59,
    symbol: "EOS",
    image: "https://pioneers.dev/coins/eos.png",
  },
  // { name: "ethereum-classic", chain_id: 61, symbol: "ETC", image: "https://pioneers.dev/coins/ethereum-classic.png" }, //TODO push node
  {
    name: "evmos",
    chain_id: 9001,
    symbol: "EVMOS",
    image: "https://pioneers.dev/coins/evmos.png",
  },
  // { name: "poa-core", chain_id: 99, symbol: "POA", image: "https://pioneers.dev/coins/poa-core.png" }, //TODO push node
];

interface WalletOption {
  context: string;
  icon: any;
}

const Home = () => {
  const { state, dispatch } = usePioneer();
  const {
    api,
    app,
    context,
    assetContext,
    blockchainContext,
    pubkeyContext,
    status,
  } = state;
  const [isLoading, setIsLoading] = useState(true);
  const [address, setAddress] = useState("");
  const [wallet, setWallet] = useState([]);
  const [walletOptions, setWalletOptions] = useState([]);
  const [balance, setBalance] = useState("0.000");
  const [tokenBalance, setTokenBalance] = useState("0.000");
  const [amount, setAmount] = useState("0.00000000");
  const [contract, setContract] = useState("");
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [block, setBlock] = useState("");
  const [isNFT, setIsNFT] = useState(false);
  const [tokenId, setTokenId] = useState("");
  const [icon, setIcon] = useState("https://pioneers.dev/coins/ethereum.png");
  const [tokenName, setTokenName] = useState("");
  const [prescision, setPrescision] = useState("");
  const [token, setToken] = useState("");
  const [assets, setAssets] = useState("");
  const [blockchain, setBlockchain] = useState("");
  const [chainId, setChainId] = useState(1);
  const [web3, setWeb3] = useState(null);
  const [service, setService] = useState(null);
  const [toAddress, setToAddress] = useState("");
  const [txid, setTxid] = useState(null);
  const [signedTx, setSignedTx] = useState(null);
  const [loading, setLoading] = useState(null);
  const [isTokenSelected, setIsTokenSelected] = useState(null);
  const [error, setError] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [data, setData] = useState(() => []);
  const [query, setQuery] = useState("bitcoin...");
  const [timeOut, setTimeOut] = useState(null);
  const [showCustomNetworkForm, setShowCustomNetworkForm] = useState(false);
  const [serviceValid, setServiceValid] = useState(true);

  const setContextWallet = async function (wallet: string) {
    try {
      //console.log("setContextWallet: ", wallet);
      // eslint-disable-next-line no-console
      //console.log("wallets: ", app.wallets);
      const matchedWallet = app.wallets.find(
        (w: { type: string }) => w.type === wallet
      );
      //console.log("matchedWallet: ", matchedWallet);
      if (matchedWallet) {
        const context = await app.setContext(matchedWallet.wallet);
        console.log("result change: ", context);
        //console.log("app.context: ", app.context);

        //console.log(
        //   "app.pubkeyContext: ",
        //   app.pubkeyContext.master || app.pubkeyContext.pubkey
        // );
        const pubkeyContext =
          app.pubkeyContext.master || app.pubkeyContext.pubkey;

        dispatch({ type: "SET_CONTEXT", payload: app.context });
        dispatch({ type: "SET_PUBKEY_CONTEXT", payload: app.pubkeyContext });
        // dispatch({ type: "SET_WALLET", payload: wallet });
      } else {
        //console.log("No wallet matched the type of the context");
      }
    } catch (e) {
      console.error("header e: ", e);
    }
  };

  useEffect(() => {
    console.log("pubkeyContext: ", pubkeyContext);
    const address =
      pubkeyContext.master || pubkeyContext.pubkey || pubkeyContext;
    if (address && address.length > 0 && address !== "0") {
      setAddress(address);
    }
  }, [pubkeyContext, status]);

  const checkAddress = function () {
    setContextWallet("metamask");
    setContextWallet("keepkey");
    setIsLoading(true);
    const address =
      pubkeyContext.master || pubkeyContext.pubkey || pubkeyContext;
    if (address && address.length > 0 && address !== "0") {
      setAddress(address);
    }
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const onSend = async function () {
    try {
      console.log("onSend");
      //get current context
      console.log("prescision: ", prescision);
      //build transaction
      //web3 get nonce
      // @ts-ignore
      let nonce = await web3.eth.getTransactionCount(address);
      // @ts-ignore
      nonce = web3.utils.toHex(nonce);
      app.sendToAddress();
      //get gas price
      // @ts-ignore
      let gasPrice = await web3.eth.getGasPrice();
      // @ts-ignore
      gasPrice = web3.utils.toHex(gasPrice);
      console.log("gasPrice: ", gasPrice);
      let gasLimit;
      let input;
      //get balance
      if (contract && !isNFT) {
        console.log("THIS IS A TOKEN SEND!");
        if (!contract) throw Error("Invalid token contract address");
        // @ts-ignore
        console.log("valuePRE: ", amount);
        //"0.01"
        // Use BigNumber to handle the large value and perform calculations
        // @ts-ignore
        const amountSat = parseInt(
          // @ts-ignore
          amount * Math.pow(10, prescision)
        ).toString();

        console.log("amountSat: ", amountSat.toString());
        //"10000000000"
        //"1"
        console.log("amountSat: ", amountSat);
        console.log("valamountSatue: ", amountSat.toString());
        //get token data
        // @ts-ignore
        const tokenData = await web3.eth.abi.encodeFunctionCall(
          {
            name: "transfer",
            type: "function",
            inputs: [
              {
                type: "address",
                name: "_to",
              },
              {
                type: "uint256",
                name: "_value",
              },
            ],
          },
          [toAddress, amountSat]
        );
        console.log("tokenData: ", tokenData);
        //get gas limit
        try {
          // @ts-ignore
          gasLimit = await web3.eth.estimateGas({
            to: address,
            value: amountSat,
            data: tokenData,
          });
          // @ts-ignore
          gasLimit = web3.utils.toHex(gasLimit + 941000); // Add 21000 gas to cover the size of the data payload
        } catch (e) {
          console.error("failed to get ESTIMATE GAS: ", e);
          // @ts-ignore
          gasLimit = web3.utils.toHex(30000 + 41000);
        }

        //sign
        input = {
          addressNList: [2147483692, 2147483708, 2147483648, 0, 0],
          nonce,
          gasPrice,
          gas: gasLimit,
          gasLimit,
          maxFeePerGas: gasPrice,
          maxPriorityFeePerGas: gasPrice,
          value: "0x0",
          from: address,
          to: contract,
          data: tokenData,
          chainId,
        };
        //console.log("input: ",input)
      } else if (contract && isNFT) {
        // @ts-ignore
        console.log("NFT send: ", contract);
        // console.log("NFT_ABI: ", NFT_ABI);
        // Create a contract instance
        // @ts-ignore
        const contractAbi = new web3.eth.Contract(NFT_ABI, contract);

        // Call the function to get the balance of the NFT owner
        const balance = await contractAbi.methods.balanceOf(address).call();
        console.log("balance: ", balance);

        if (balance == 0) {
          throw new Error("You do not own this NFT");
        }

        // Define the function selector for the transfer function
        // @ts-ignore
        const transferFunctionSelector = web3.eth.abi.encodeFunctionSignature({
          name: "transferFrom",
          type: "function",
          inputs: [
            { type: "address", name: "_from" },
            { type: "address", name: "_to" },
            { type: "uint256", name: "_tokenId" },
          ],
        });

        // Encode the parameters for the "transferFrom" function
        // @ts-ignore
        const transferParameters = web3.eth.abi.encodeParameters(
          ["address", "address", "uint256"],
          [address, toAddress, tokenId]
        );

        // Combine the function selector and encoded parameters to create the full data for the transaction
        const tokenData =
          transferFunctionSelector + transferParameters.slice(2); // Remove the first 2 characters ("0x") from the encoded parameters

        console.log("tokenData: ", tokenData);
        try {
          // @ts-ignore
          gasLimit = await web3.eth.estimateGas({
            to: address,
            value: "0x0",
            data: tokenData,
          });
          // @ts-ignore
          gasLimit = web3.utils.toHex(gasLimit + 941000); // Add 21000 gas to cover the size of the data payload
        } catch (e) {
          console.error("failed to get ESTIMATE GAS: ", e);
          // @ts-ignore
          gasLimit = web3.utils.toHex(30000 + 41000);
        }

        input = {
          addressNList: [2147483692, 2147483708, 2147483648, 0, 0],
          nonce,
          gasLimit,
          gasPrice,
          gas: gasLimit,
          value: "0x0",
          from: address,
          to: contract,
          data: tokenData,
          chainId,
        };
        //@ts-ignore
        console.log("input: ", input);
      } else {
        console.log("THIS IS A NATIVE SEND!");
        //get value in hex
        console.log("amount: ", amount);
        // @ts-ignore
        const valueInWei = amount * Math.pow(10, 18); // Keep it as a number without converting to string
        console.log("valueInWei: ", valueInWei);
        // @ts-ignore
        const valueInWeiHex = "0x" + valueInWei.toString(16);
        console.log("valueInWeiHex: ", valueInWeiHex);

        //get gas limit
        const gasLimitCall = {
          to: address,
          value: valueInWeiHex, // Use the hexadecimal value
          data: "0x",
        };
        let gasLimit;
        try {
          // @ts-ignore
          gasLimit = await web3.eth.estimateGas(gasLimitCall);
          console.log("gasLimit: ", gasLimit);
          // @ts-ignore
          gasLimit = web3.utils.toHex(gasLimit);
        } catch (e) {
          // @ts-ignore
          gasLimit = web3.utils.toHex(300000);
        }

        //sign
        input = {
          addressNList: [2147483692, 2147483708, 2147483648, 0, 0],
          nonce,
          gasLimit,
          // maxFeePerGas:gasPrice,
          // maxPriorityFeePerGas:gasPrice,
          gasPrice,
          gas: gasLimit,
          value: valueInWeiHex, // Use the hexadecimal value
          from: address,
          to: toAddress,
          data: "0x",
          chainId,
        };
        //@ts-ignore
        console.log("input: ", input);
      }
      //@ts-ignore
      console.log("input: ", input);
      //get gas limit
      console.log("wallet: ", wallet);
      //@ts-ignore @TODO detect context
      // const isMetaMask = await wallet?._isMetaMask;
      let isMetaMask = false;
      // @ts-ignore
      if (wallet[0].type === "metamask") isMetaMask = true;
      console.log("wallet: ", wallet);
      console.log("isMetaMask: ", isMetaMask);
      let responseSign;
      if (isMetaMask) {
        // @ts-ignore
        responseSign = await wallet[0].wallet.ethSendTx(input);
        console.log("responseSign: ", responseSign);
        setTxid(responseSign.hash);
      } else {
        // @ts-ignore
        responseSign = await wallet[0].wallet.ethSignTx(input);
        console.log("responseSign: ", responseSign);
      }
      console.log("responseSign: ", responseSign);
      setSignedTx(responseSign.serialized);
    } catch (e) {
      console.error("Error on send!", e);
    }
  };

  const onBroadcast = async function () {
    const tag = " | onBroadcast | ";
    try {
      // console.log("onBroadcast: ",signedTx)
      // @ts-ignore
      setLoading(true);
      // @ts-ignore
      const txHash = await web3.eth.sendSignedTransaction(signedTx);
      // console.log(tag,"txHash: ",txHash)
      setTxid(txHash.transactionHash);
      setBlock(txHash.blockNumber);
      // @ts-ignore
      setLoading(false);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(tag, e);
    }
  };

  const handleInputChangeAmount = (e: { target: { value: any } }) => {
    const inputValue = e.target.value;
    setAmount(inputValue);
  };

  const onStart = async function () {
    try {
      if (address) {
        console.log(app);
        setWallet(
          app.wallets.filter((wallet: any) => wallet.context === app.context)
        );
        console.log(wallet);
        //get wallets
        console.log("app: ", app);
        console.log("onStart context: ", app.context);
        console.log("onStart wallets: ", app.wallets);
        console.log("onStart walletDescriptions: ", app);
        console.log("onStart walletDescriptions: ", app.user);
        // console.log("walletDescriptions: ", app.walletDescriptions.length);

        const info = await api.SearchByNetworkId({ chainId: 1 });
        console.log("onStart: info: ", info.data[0]);
        if (!info.data[0]) {
          console.error("No network found!");
        }
        setService(info.data[0].service);
        setChainId(info.data[0].chainId);
        setBlockchain(info.data[0].name);
        // @ts-ignore
        const web3 = new Web3(
          // @ts-ignore
          new Web3.providers.HttpProvider(info.data[0].service)
        );
        // @ts-ignore
        setWeb3(web3);
        //Get the current block number
        const blockNumber = await web3.eth.getBlockNumber();
        console.log("blockNumber: ", blockNumber);
        const balanceResult = await web3.eth.getBalance(address, blockNumber);
        console.log("balanceResult: ", balanceResult);
        const balanceInEther = web3.utils.fromWei(balanceResult, "ether");
        setBalance(balanceInEther);
        // Now you can use the balanceInEther and blockNumber as needed
        console.log("Balance in Ether: ", balanceInEther);
        console.log("Block Number: ", blockNumber);

        //TODO get tokens for chain
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    onStart();
  }, [api, app, app?.walletDescriptions, address]);

  const handleClose = async function () {
    try {
      // @ts-ignore
      setLoading(false);
      setTxid(null);
      setSignedTx(null);
      // @ts-ignore
      setToken(null);
      // @ts-ignore
      setBlock(null);
      // @ts-ignore
      setContract(null);
      onClose();
    } catch (e) {
      console.error(e);
    }
  };

  const handleClickTabs = async function (type: any) {
    try {
      if (type === "NFT") {
        setIsNFT(true);
      } else {
        setIsNFT(false);
      }
      console.log("Tab Clicked!");
      //get tokens for chain

      let assets = await api.SearchAssetsListByChainId({
        chainId,
        limit: 100,
        skip: 0,
      });
      assets = assets.data;
      //console.log("assets: ",assets.length)
      const assetsFormated = [];
      for (let i = 0; i < assets.length; i++) {
        const asset = assets[i];
        asset.value = asset.name;
        asset.label = asset.name;
        assetsFormated.push(asset);
      }
      console.log("handleSelect: assetsFormated: ", assetsFormated.length);
      // @ts-ignore
      setAssets(assetsFormated);
    } catch (e) {
      console.error(e);
    }
  };

  const handleInputChangeAddress = (e: any) => {
    const inputValue = e.target.value;
    setToAddress(inputValue);
  };

  const handleInputChangeContract = async function (input: any) {
    try {
      const inputValue = input.target.value;
      console.log("handleInputChangeContract: ", inputValue);
      setContract(inputValue);
      if (inputValue.length > 16 && inputValue.indexOf("0x") >= 0) {
        const minABI = [
          // balanceOf
          {
            constant: true,
            inputs: [{ name: "_owner", type: "address" }],
            name: "balanceOf",
            outputs: [{ name: "balance", type: "uint256" }],
            type: "function",
          },
          // decimals
          {
            constant: true,
            inputs: [],
            name: "decimals",
            outputs: [{ name: "", type: "uint8" }],
            type: "function",
          },
        ];
        console.log("inputValue: ", inputValue);
        // @ts-ignore
        const newContract = new web3.eth.Contract(minABI, inputValue);
        console.log("newContract: ", newContract);
        console.log("newContract: ", newContract.methods);
        const decimals = await newContract.methods.decimals().call();
        console.log("decimals: ", decimals);
        setPrescision(decimals);
        console.log("address: ", address);
        const balanceBN = await newContract.methods.balanceOf(address).call();
        console.log("input: balanceBN: ", balanceBN);
        // @ts-ignore
        const tokenBalance = parseInt(balanceBN / Math.pow(10, decimals));
        if (tokenBalance > 0) {
          setError(null);
          console.log("input: tokenBalance: ", tokenBalance);

          // @ts-ignore
          setTokenBalance(tokenBalance);
        } else {
          // @ts-ignore
          setError(
            // @ts-ignore
            `no balance on this token! chainId: ${chainId} contract: ${contract}`
          );
        }
      } else {
        // @ts-ignore
        setError("Invalid contract! must start with 0x");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleInputChangeTokenId = async function (input: any) {
    try {
      const inputValue = input.target.value;
      console.log("handleInputChangeTokenId: ", inputValue);
      setTokenId(inputValue);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelect = async function (input: any) {
    try {
      console.log("handleSelect input: ", input.target.value);
      let selection: any = ALL_CHAINS.filter(
        (chain) => chain.name === input.target.value
      );
      console.log("handleSelect: ", selection);
      selection = selection[0];
      //get provider info
      const caip = "eip155:" + selection.chain_id + "/slip44:60";
      console.log("caip: ", caip);
      const info = await api.NodesByCaip({ caip });
      console.log("info: ", info);
      console.log("handleSelect: chainId: ", info.data[0].chainId);
      setIcon(selection.image);
      setService(info.data[0].service);
      setChainId(info.data[0].chainId);
      setBlockchain(info.data[0].name);
      // @ts-ignore
      console.log("web3 service provder: ", info.data[0].service);
      const web3New = new Web3(
        new Web3.providers.HttpProvider(info.data[0].service)
      );
      // @ts-ignore
      setWeb3(web3New);
      if (web3New) {
        //Get the current block number
        const blockNumber = await web3New.eth.getBlockNumber();
        console.log("blockNumber: ", blockNumber);
        const balanceResult = await web3New.eth.getBalance(
          address,
          blockNumber
        );
        console.log("balanceResult: ", balanceResult);
        const balanceInEther = web3New.utils.fromWei(balanceResult, "ether");
        setBalance(balanceInEther);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectChainId = async function (chainId: any) {
    try {
      console.log("handleSelectChainId input: ", chainId);
      const caip = "eip155:" + chainId + "/slip44:60";
      console.log("caip: ", caip);
      const info = await api.NodesByCaip({ caip });
      console.log("info: ", info.data[0]);
      if (info.data[0]) {
        const entry = info.data[0];

        //entry
        setIcon(entry.image);
        setService(entry.service);
        setChainId(chainId);
        setBlockchain(entry.blockchain);
        const web3New = new Web3(
          new Web3.providers.HttpProvider(entry.service)
        );
        // @ts-ignore
        setWeb3(web3New);
        if (web3New) {
          //Get the current block number
          const blockNumber = await web3New.eth.getBlockNumber();
          console.log("blockNumber: ", blockNumber);
          const balanceResult = await web3New.eth.getBalance(
            address,
            blockNumber
          );
          console.log("balanceResult: ", balanceResult);
          const balanceInEther = web3New.utils.fromWei(balanceResult, "ether");
          setBalance(balanceInEther);
        }
      } else {
        handleSelect({ target: { value: "ethereum" }  });
        alert("Unable to find chain info for chainId: " + chainId);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectWallet = (event: any) => {
    const selectedContext = event.target.value;
    console.log("selectedContext: ", selectedContext);
    setSelectedWallet(selectedContext);
  };

  // Event handler for custom RPC form submission
  const handleCustomRpcSubmit = () => {
    handleSelectChainId(chainId);
  };

  const toggleCustomNetworkForm = () => {
    setShowCustomNetworkForm(!showCustomNetworkForm);
  };

  useEffect(() => {
    // Simulate a 2-second delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // Clear the timer when the component unmounts
    return () => clearTimeout(timer);
  }, []);

  // @ts-ignore
  return (
    <div>
      <Modal isOpen={isOpen} onClose={() => handleClose()} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Broadcasting to {blockchain}</ModalHeader>
          <ModalCloseButton />
          {loading ? (
            <div>
              <div>
                <h2>Broadcasted! waiting on confirmation!</h2>
              </div>
              <Spinner size="xl" color="green.500" />
            </div>
          ) : (
            <div>
              <ModalBody>
                <Tabs>
                  <TabList>
                    <Tab>Native</Tab>
                    <Tab onClick={() => handleClickTabs("Token")}>Token</Tab>
                    <Tab onClick={() => handleClickTabs("NFT")}>NFT</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      <div>
                        Context: <small>{app?.user?.context || ""}</small>
                      </div>
                      <div>balance: {balance}</div>
                      <br />
                      <div>
                        amount:{" "}
                        <input
                          type="text"
                          name="amount"
                          value={amount}
                          onChange={handleInputChangeAmount}
                        />
                      </div>
                      <br />
                      <div>
                        address:{" "}
                        <input
                          type="text"
                          name="address"
                          value={toAddress}
                          placeholder="0x651982e85D5E43db682cD6153488083e1b810798"
                          onChange={handleInputChangeAddress}
                        />
                      </div>
                    </TabPanel>
                    <TabPanel>
                      <div>
                        contract:{" "}
                        <input
                          type="text"
                          name="contract"
                          value={contract}
                          onChange={handleInputChangeContract}
                        />
                      </div>
                      {tokenBalance ? (
                        <div>tokenBalance: {tokenBalance}</div>
                      ) : (
                        <div>no token balance</div>
                      )}
                      {prescision ? (
                        <div>precision: {prescision}</div>
                      ) : (
                        <div />
                      )}
                      <Text color="red.500">{error}</Text>
                      <br />

                      <div>
                        amount:{" "}
                        <input
                          type="text"
                          name="amount"
                          value={amount}
                          onChange={handleInputChangeAmount}
                        />
                      </div>
                      <br />
                      <div>
                        address:{" "}
                        <input
                          type="text"
                          name="address"
                          value={toAddress}
                          placeholder="0x6519....."
                          onChange={handleInputChangeAddress}
                        />
                      </div>
                    </TabPanel>
                    <TabPanel>
                      <div>
                        isNFT: {isNFT.toString()}
                        <br />
                        {tokenBalance ? (
                          <div>tokenBalance: {tokenBalance}</div>
                        ) : (
                          <div>no token balance</div>
                        )}
                        <br />
                        contract:{" "}
                        <input
                          type="text"
                          name="contract"
                          value={contract}
                          onChange={handleInputChangeContract}
                        />
                        <br />
                        <br />
                        tokenId:{" "}
                        <input
                          type="text"
                          name="tokenId"
                          value={tokenId}
                          onChange={handleInputChangeTokenId}
                        />
                        <br />
                        <br />
                        <div>
                          address:{" "}
                          <input
                            type="text"
                            name="address"
                            value={toAddress}
                            placeholder="0x6519....."
                            onChange={handleInputChangeAddress}
                          />
                        </div>
                      </div>
                    </TabPanel>
                  </TabPanels>
                  <br />
                  {error ? <div>error: {error}</div> : <div />}
                  {txid ? <div>txid: {txid}</div> : <div />}
                  {block ? <div>confirmed in block: {block}</div> : <div />}
                  {txid ? (
                    <div />
                  ) : (
                    <div>
                      {signedTx ? <div>signedTx: {signedTx}</div> : <div />}
                    </div>
                  )}
                </Tabs>
              </ModalBody>

              <ModalFooter>
                {!signedTx ? (
                  <div>
                    <Button colorScheme="green" mr={3} onClick={onSend}>
                      Send
                    </Button>
                  </div>
                ) : (
                  <div />
                )}
                {!txid ? (
                  <div>
                    {signedTx ? (
                      <div>
                        <Button
                          colorScheme="green"
                          mr={3}
                          onClick={onBroadcast}
                        >
                          broadcast
                        </Button>
                      </div>
                    ) : (
                      <div />
                    )}
                  </div>
                ) : (
                  <div />
                )}
                <Button colorScheme="blue" mr={3} onClick={handleClose}>
                  exit
                </Button>
              </ModalFooter>
            </div>
          )}
        </ModalContent>
      </Modal>
      {address ? (
        <Box textAlign="center" fontSize="xl">
          <Grid minH="100vh" p={3}>
            <VStack spacing={8}>
              <Logo h="40vmin" pointerEvents="none" logo={icon} />
              <Grid templateRows="1fr 1fr 1fr" gap="1rem" alignItems="center">
                <Box p="1rem" border="1px" borderColor="gray.300">
                  <Text fontSize="xl" fontWeight="bold">
                    Selected: {blockchain} (chainId{chainId})
                  </Text>
                  {showCustomNetworkForm ? (
                    <div>
                      <Select
                        placeholder={`selected: ${blockchain}`}
                        defaultValue="ethereum"
                        onChange={handleSelect}
                      >
                        {ALL_CHAINS.map((blockchain) => (
                          <option value={blockchain.name}>
                            {blockchain.name} ({blockchain.symbol})
                          </option>
                        ))}
                      </Select>
                      <br />
                      <Button onClick={toggleCustomNetworkForm}>
                        Add Custom Network{" "}
                        <span role="img" aria-label="Plug Symbol">
                          🔌
                        </span>
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Text>Custom RPC URL:</Text>

                      <input
                        type="text"
                        placeholder="Chain ID"
                        value={chainId}
                        onChange={(e) => setChainId(parseInt(e.target.value))}
                      />
                      <br />
                      {/*<input*/}
                      {/*  type="text"*/}
                      {/*  placeholder="Custom RPC URL"*/}
                      {/*  value={service}*/}
                      {/*  onChange={(e) => setService(e.target.value)}*/}
                      {/*  style={{*/}
                      {/*    borderColor: serviceValid ? "green" : "red",*/}
                      {/*  }}*/}
                      {/*/>*/}
                      {/*<br />*/}
                      <button type="submit" onClick={handleCustomRpcSubmit}>
                        Submit
                      </button>
                      <Box mt="1rem">
                        <Text fontWeight="bold">Find Networks:</Text>
                        <a
                          href="https://chainlist.org/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Visit chainlist.org
                        </a>
                      </Box>
                      <br />
                      <Button onClick={toggleCustomNetworkForm}>
                        Select from Common Networks{" "}
                      </Button>
                    </div>
                  )}
                </Box>
                <Box p="1rem" border="1px" borderColor="gray.300">
                  <Text>address: {address}</Text>
                </Box>
                <Box p="1rem" border="1px" borderColor="gray.300">
                  <Text>balance: {balance}</Text>
                </Box>
                <Box p="1rem" border="1px" borderColor="gray.300">
                  <Button colorScheme="green" onClick={onOpen}>
                    Send
                  </Button>
                </Box>
              </Grid>
            </VStack>
          </Grid>
        </Box>
      ) : (
        // Spinner to show while loading address
        <div>
          {isLoading ? (
            <Spinner
              size="xl"
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="green.500"
            />
          ) : (
            <Button onClick={checkAddress} variant="solid" colorScheme="green">
              Connect Wallet
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
