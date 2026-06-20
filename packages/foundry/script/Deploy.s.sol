//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./DeployHelpers.s.sol";
import { DeployCLAWDGate } from "./DeployCLAWDGate.s.sol";

contract DeployScript is ScaffoldETHDeploy {
    function run() external {
        DeployCLAWDGate deployCLAWDGate = new DeployCLAWDGate();
        deployCLAWDGate.run();
    }
}
