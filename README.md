# Bot for Discord communties to facilitate crypto coin tipping!
(This README will be updated along with bot updates)
Features:

- Tipbot for any coin running the bitcoind client.
    - Help message `!tip`.
- Dynamic plugin loading with permission support.
- **out of the box Supported Coins**
    - Dogecoin (DOGE)
    - Ravencoin (RVN)
    - LBRY Credits (LBC)
    - Uniform Fiscal Object (UFO)
    - ~~Proton (PROTON)~~ Higgs(PROTON)

## Auto-Installation

for Windows Users Only!

Create a bot and get the bot's API Token:
https://discordapp.com/developers/applications/me

make sure you have setup your wallet config properly to facilitate this bot

wallets data folder can be found in %appdata% (default Roaming Folder):

```
server=1
par=1
rpcbind=127.0.0.1
rpcallowip=127.0.0.1
rpcport=3335
rpcuser=<Same-as-you-set-in-config.json>
rpcpassword=<Same-as-you-set-in-config.json>
rpcclienttimeout=30
rpcthreads=<Number-of-Threads>
rpcworkqueue=1000
```

NOTE: if you are using a masternode coin you also need to add these to extra option into your wallets config file

```
staking=0
enableaccounts=1
```

edit and rename default.json.example in /config to default.json

edit the following according to your wallets config options set in the previous step:

(you can add more coins by following this format and using the exampleTipper.js)

```
"ravend": {
    "port": 3335,
    "user": "username",
    "pass": "Do-Not-Use-This-Password-Youll-Be-Hacked-For-all-Teh-Moneys!"
},
```

to start the install run the windows-install.bat file!

before you start the file make sure the directories in ecosystem.config.js, you have to rename the old one from ecosystem.config.js.example to the file name above, properly match those of the project your deploying!

and finally `pm2 start ecosystem.config.js`

ENJOY!

## Manual-Installation

## Requirements

- node > 8.0.0
- npm > 0.12.x
- yarn ( install with npm install -g yarn if not installed )

## Installation

Download the respective coins wallet that uses bitcoind (aka bitcoin-qt).

Create a bot and get the bot's Token: https://discordapp.com/developers/applications/me

make sure you have setup your wallet config properly to facilitate this bot

wallet folder found in %appdata% (default Roaming Folder):

```
server=1
par=1
rpcbind=127.0.0.1
rpcallowip=127.0.0.1
rpcport=3335
rpcuser=<Same-as-you-set-in-config.json>
rpcpassword=<Same-as-you-set-in-config.json>
rpcclienttimeout=30
rpcthreads=<Number-of-Threads>
rpcworkqueue=1000
```

NOTE: if you are using a masternode coin you also need to add these to extra option into your wallets config file

```
staking=0
enableaccounts=1
```

rename default.json.example in /config to default.json

edit the following according to your wallets config options set in the previous step:

(you can add more coins by following this format and using the exampleTipper.js)

```
"ravend": {
    "port": 3335,
    "user": "username",
    "pass": "Do-Not-Use-This-Password-Youll-Be-Hacked-For-all-Teh-Moneys!"
},
```

then run:

```
npm install
pm2 start ecosystem.config.js
```

### Development

Be sure to run the command below before working on any code, this ensures
prettier goes to work and keeps code to our standard.

```
yarn install --production=false
```
to run prettier before submitting your code simply run the following in the bots root directory.

```
yarn precommit
```
