#!/bin/bash

sh ./build.sh #just to not forget :D
near deploy --wasmFile ./out/rewarudo.wasm --accountId rewarudo.unicorny.testnet
