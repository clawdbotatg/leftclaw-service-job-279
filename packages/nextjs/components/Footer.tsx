import React from "react";
import { SwitchTheme } from "~~/components/SwitchTheme";

const CONTRACT_URL = "https://basescan.org/address/0xc22B7b983EC81523c969753c2385106835E8CfCE";

export const Footer = () => {
  return (
    <div className="min-h-0 py-5 px-1 mb-11 lg:mb-0">
      <div>
        <div className="fixed flex justify-end items-center w-full z-10 p-4 bottom-0 left-0 pointer-events-none">
          <SwitchTheme className="pointer-events-auto" />
        </div>
      </div>
      <div className="w-full">
        <ul className="menu menu-horizontal w-full">
          <div className="flex justify-center items-center gap-2 text-sm w-full">
            <div className="text-center">
              <span className="text-base-content">CLAWD Gate — Token-gated score reveal on Base</span>
            </div>
            <span>·</span>
            <div className="text-center">
              <a href={CONTRACT_URL} target="_blank" rel="noreferrer" className="link">
                View contract on Basescan
              </a>
            </div>
          </div>
        </ul>
      </div>
    </div>
  );
};
