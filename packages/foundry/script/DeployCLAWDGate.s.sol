// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./DeployHelpers.s.sol";
import { CLAWDGate } from "../contracts/CLAWDGate.sol";

contract DeployCLAWDGate is ScaffoldETHDeploy {
    // CLAWD token on Base mainnet
    address constant CLAWD_TOKEN = 0x9f86dB9fc6f7c9408e8Fda3Ff8ce4e78ac7a6b07;
    // Client wallet — receives ownership of CLAWDGate
    address constant CLIENT = 0xf2c44aF68aE2a983d1331b2D3aEF3c516Ae4a0Fc;

    function run() external ScaffoldEthDeployerRunner {
        CLAWDGate gate = new CLAWDGate(CLAWD_TOKEN, CLIENT);
        deployments.push(Deployment({ name: "CLAWDGate", addr: address(gate) }));
        console.log("CLAWDGate deployed at:", address(gate));
        console.log("Owner:", gate.owner());
        console.log("CLAWD token:", address(gate.clawdToken()));
        console.log("Tier 1 threshold:", gate.tierThresholds(1));
    }
}
